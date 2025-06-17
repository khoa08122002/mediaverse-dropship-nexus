import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, UseInterceptors, UploadedFile, BadRequestException, NotFoundException, InternalServerErrorException, Res, ConflictException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { RecruitmentService } from './recruitment.service';
import { FileUploadService } from '../file-upload/file-upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateJobDto, UpdateJobDto } from './dto/job.dto';
import { CreateApplicationDto, UpdateApplicationStatusDto, ApplicationQueryDto } from './dto/application.dto';
import { Role } from '../prisma';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { Job, Application } from './types/recruitment.types';
import { Public } from '../auth/decorators/public.decorator';


@ApiTags('recruitment')
@Controller('recruitment')
export class RecruitmentController {
  constructor(
    private readonly recruitmentService: RecruitmentService,
    private readonly fileUploadService: FileUploadService
  ) {}

  @Public()
  @Get('jobs')
  @ApiOperation({ summary: 'Get all jobs' })
  async getAllJobs(): Promise<Job[]> {
    return this.recruitmentService.getAllJobs();
  }

  @Public()
  @Get('jobs/:id')
  @ApiOperation({ summary: 'Get job by id' })
  async getJobById(@Param('id') id: string): Promise<Job> {
    return this.recruitmentService.getJobById(Number(id));
  }

  @Post('jobs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.HR)
  @ApiOperation({ summary: 'Create a new job' })
  async createJob(@Body() createJobDto: CreateJobDto): Promise<Job> {
    return this.recruitmentService.createJob(createJobDto);
  }

  @Put('jobs/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.HR)
  @ApiOperation({ summary: 'Update a job' })
  async updateJob(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto): Promise<Job> {
    return this.recruitmentService.updateJob(Number(id), updateJobDto);
  }

  @Delete('jobs/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.HR)
  @ApiOperation({ summary: 'Delete a job' })
  async deleteJob(@Param('id') id: string): Promise<Job> {
    return this.recruitmentService.deleteJob(Number(id));
  }

  @Public()
  @Post('applications')
  @UseInterceptors(FileInterceptor('cvFile', {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
      if (!file) {
        cb(null, true);
        return;
      }
      
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new BadRequestException('Chỉ chấp nhận file PDF hoặc Word'), false);
      }
    }
  }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Tạo đơn ứng tuyển mới' })
  @ApiResponse({ status: 201, description: 'Đơn ứng tuyển đã được tạo thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy vị trí tuyển dụng' })
  @ApiResponse({ status: 409, description: 'Bạn đã ứng tuyển vị trí này rồi' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['fullName', 'email', 'phone', 'jobId'],
      properties: {
        jobId: {
          type: 'number',
          description: 'ID của vị trí ứng tuyển'
        },
        fullName: {
          type: 'string',
          description: 'Họ và tên người ứng tuyển'
        },
        email: {
          type: 'string',
          format: 'email',
          description: 'Email liên hệ'
        },
        phone: {
          type: 'string',
          description: 'Số điện thoại liên hệ'
        },
        coverLetter: {
          type: 'string',
          description: 'Thư xin việc (không bắt buộc)'
        },
        cvFile: {
          type: 'string',
          format: 'binary',
          description: 'File CV (PDF hoặc Word, tối đa 5MB)'
        }
      }
    }
  })
  async createApplication(
    @Body() createApplicationDto: CreateApplicationDto,
    @UploadedFile() file?: Express.Multer.File
  ): Promise<Application> {
    try {
      console.log('Received application data:', createApplicationDto);
      console.log('Received file:', file);

      // Parse and validate jobId
      const jobId = typeof createApplicationDto.jobId === 'string' 
        ? parseInt(createApplicationDto.jobId, 10) 
        : createApplicationDto.jobId;

      if (isNaN(jobId)) {
        throw new BadRequestException('ID vị trí ứng tuyển không hợp lệ');
      }

      // Clean and validate data
      const cleanedData = {
        jobId,
        fullName: createApplicationDto.fullName?.trim(),
        email: createApplicationDto.email?.trim().toLowerCase(),
        phone: createApplicationDto.phone?.trim(),
        coverLetter: createApplicationDto.coverLetter?.trim(),
      };

      // Validate required fields
      if (!cleanedData.fullName) {
        throw new BadRequestException('Vui lòng nhập họ và tên');
      }
      if (!cleanedData.email) {
        throw new BadRequestException('Vui lòng nhập email');
      }
      if (!cleanedData.phone) {
        throw new BadRequestException('Vui lòng nhập số điện thoại');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanedData.email)) {
        throw new BadRequestException('Email không hợp lệ');
      }

      // Validate phone format (Vietnam)
      const phoneRegex = /^(\+84|84|0)[35789][0-9]{8}$/;
      if (!phoneRegex.test(cleanedData.phone)) {
        throw new BadRequestException('Số điện thoại không hợp lệ');
      }

      // Save CV file if provided
      let cvFilePath = null;
    if (file) {
        try {
          cvFilePath = await this.fileUploadService.saveCV(file);
        } catch (error) {
          console.error('Error saving CV file:', error);
          throw new InternalServerErrorException('Không thể lưu file CV. Vui lòng thử lại sau.');
        }
      }

      try {
        const result = await this.recruitmentService.createApplication({
          ...cleanedData,
          cvFile: cvFilePath
        });
        return result;
      } catch (error) {
        console.error('Error creating application:', error);
        
        if (error instanceof BadRequestException) {
          throw error;
        }
        
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ConflictException('Bạn đã ứng tuyển vị trí này rồi');
          }
          throw new BadRequestException('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
        }

        throw new InternalServerErrorException('Không thể tạo đơn ứng tuyển. Vui lòng thử lại sau.');
      }
    } catch (error) {
      // Clean up CV file if error occurs
      if (file && file.path) {
        try {
          await this.fileUploadService.deleteFile(file.path);
        } catch (deleteError) {
          console.error('Error deleting CV file:', deleteError);
        }
      }
      throw error;
    }
  }

  @Get('applications')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.HR)
  @ApiOperation({ summary: 'Get all applications' })
  async getAllApplications(): Promise<Application[]> {
    return this.recruitmentService.getAllApplications();
  }

  @Get('jobs/:id/applications')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.HR)
  @ApiOperation({ summary: 'Get applications for a job' })
  async getJobApplications(
    @Param('id') id: string,
    @Query() query: ApplicationQueryDto
  ): Promise<Application[]> {
    return this.recruitmentService.getJobApplications(Number(id), query);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.HR)
  @ApiOperation({ summary: 'Get recruitment statistics' })
  async getStats(): Promise<any> {
    return this.recruitmentService.getStats();
  }

  @Get('applications/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.HR)
  @ApiOperation({ summary: 'Get application by id' })
  async getApplication(@Param('id') id: string): Promise<Application> {
    return this.recruitmentService.getApplication(Number(id));
  }

  @Put('applications/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.HR)
  @ApiOperation({ summary: 'Update application status' })
  async updateApplicationStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateApplicationStatusDto
  ): Promise<Application> {
    return this.recruitmentService.updateApplicationStatus(Number(id), updateStatusDto.status);
  }

  @Get('applications/:id/cv')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.HR)
  @ApiOperation({ summary: 'Download CV của ứng viên' })
  async downloadCV(
    @Param('id') id: string,
    @Res() res: Response
  ) {
    const applicationId = Number(id);
    if (isNaN(applicationId)) {
      throw new BadRequestException('ID không hợp lệ');
    }
    const application = await this.recruitmentService.getApplication(applicationId);
    if (!application.cvFile) {
      throw new NotFoundException('CV không tồn tại');
    }
    const filePath = await this.fileUploadService.getCVPath(application.cvFile);
    if (!filePath) {
      throw new NotFoundException('File CV không tồn tại trên hệ thống');
    }
    return res.sendFile(filePath);
  }

  @Delete('applications/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.HR)
  @ApiOperation({ summary: 'Delete application' })
  async deleteApplication(@Param('id') id: number) {
    return this.recruitmentService.deleteApplication(id);
  }
} 