import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateJobDto, UpdateJobDto, JobTypeValues, JobStatusValues, JobTypeLowercase, JobStatusLowercase } from './dto/job.dto';
import { CreateApplicationDto, UpdateApplicationStatusDto, ApplicationQueryDto } from './dto/application.dto';
import { Job, Application, ApplicationStatus, JobType, JobStatus, Prisma } from '@prisma/client';
import { FileUploadService } from '../file-upload/file-upload.service';
import { Application as ApplicationInterface } from './interfaces/application.interface';
import { Job as JobInterface } from './interfaces/job.interface';

@Injectable()
export class RecruitmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUploadService: FileUploadService
  ) {}

  private mapPrismaJobToJob(job: any): JobInterface {
    return {
      id: job.id,
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      description: job.description,
      requirements: job.requirements,
      benefits: job.benefits || '',
      salary: job.salary || '',
      status: job.status,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt
    };
  }

  private transformJobData(jobDto: CreateJobDto | UpdateJobDto): Prisma.JobCreateInput | Prisma.JobUpdateInput {
    const transformedData: Record<string, any> = {};
    
    // Copy basic string fields
    transformedData.title = jobDto.title;
    transformedData.department = jobDto.department;
    transformedData.location = jobDto.location;
    transformedData.description = jobDto.description;
    transformedData.requirements = jobDto.requirements;
    if (jobDto.benefits) transformedData.benefits = jobDto.benefits;
    if (jobDto.salary) transformedData.salary = jobDto.salary;
    
    // Handle job type
    if (jobDto.type) {
      console.log('Input job type:', jobDto.type);
      if (!Object.keys(JobTypeValues).includes(jobDto.type)) {
        console.error('Invalid job type:', jobDto.type);
        console.error('Available types:', Object.keys(JobTypeValues));
        throw new BadRequestException(`Invalid job type: ${jobDto.type}. Must be one of: ${Object.keys(JobTypeValues).join(', ')}`);
      }
      transformedData.type = jobDto.type.toUpperCase() as JobType;
    } else {
      transformedData.type = 'fulltime' as JobType; // Default value
    }
    
    // Handle job status
    if (jobDto.status) {
      console.log('Input job status:', jobDto.status);
      if (!Object.keys(JobStatusValues).includes(jobDto.status)) {
        console.error('Invalid job status:', jobDto.status);
        console.error('Available statuses:', Object.keys(JobStatusValues));
        throw new BadRequestException(`Invalid job status: ${jobDto.status}. Must be one of: ${Object.keys(JobStatusValues).join(', ')}`);
      }
      transformedData.status = jobDto.status.toUpperCase() as JobStatus;
    } else {
      transformedData.status = 'active' as JobStatus; // Default value
    }
    
    return transformedData;
  }

  async getAllJobs(): Promise<Job[]> {
    const jobs = await this.prisma.job.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return jobs.map(job => this.mapPrismaJobToJob(job));
  }

  async getJobById(id: number): Promise<Job> {
    const job = await this.prisma.job.findUnique({
      where: { id }
    });
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    return this.mapPrismaJobToJob(job);
  }

  private validateAndConvertJobType(type: string): JobType {
    const convertedType = JobTypeValues[type.toLowerCase()];
    if (!convertedType) {
      throw new BadRequestException(`Invalid job type: ${type}. Must be one of: ${Object.keys(JobTypeValues).join(', ')}`);
    }
    return convertedType;
  }

  private validateAndConvertJobStatus(status: string): JobStatus {
    const convertedStatus = JobStatusValues[status.toLowerCase()];
    if (!convertedStatus) {
      throw new BadRequestException(`Invalid job status: ${status}. Must be one of: ${Object.keys(JobStatusValues).join(', ')}`);
    }
    return convertedStatus;
  }

  async createJob(createJobDto: CreateJobDto): Promise<Job> {
    try {
      console.log('Creating job with data:', createJobDto);

      // Validate and prepare job data
      const jobData: Prisma.JobCreateInput = {
        title: createJobDto.title,
        department: createJobDto.department,
        location: createJobDto.location,
        description: createJobDto.description,
        requirements: createJobDto.requirements,
        benefits: createJobDto.benefits || '',
        salary: createJobDto.salary || 'Negotiable',
        type: createJobDto.type as JobType,
        status: createJobDto.status as JobStatus
    };

      console.log('Transformed job data:', jobData);

    const job = await this.prisma.job.create({
        data: jobData
      });

      console.log('Created job:', job);
      return this.mapPrismaJobToJob(job);
    } catch (error) {
      console.error('Error details:', error);
      
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error('Prisma error code:', error.code);
        console.error('Prisma error message:', error.message);
        throw new BadRequestException('Invalid job data. Please check your input.');
      }
      
      throw new InternalServerErrorException('Could not create job. Please try again.');
    }
  }

  async updateJob(id: number, updateJobDto: UpdateJobDto): Promise<Job> {
    await this.getJobById(id);

    try {
      const jobData: Prisma.JobUpdateInput = {
        ...(updateJobDto.title && { title: updateJobDto.title }),
        ...(updateJobDto.department && { department: updateJobDto.department }),
        ...(updateJobDto.location && { location: updateJobDto.location }),
        ...(updateJobDto.description && { description: updateJobDto.description }),
        ...(updateJobDto.requirements && { requirements: updateJobDto.requirements }),
        ...(updateJobDto.benefits !== undefined && { benefits: updateJobDto.benefits }),
        ...(updateJobDto.salary !== undefined && { salary: updateJobDto.salary }),
        ...(updateJobDto.type && { type: updateJobDto.type.toUpperCase() as JobType }),
        ...(updateJobDto.status && { status: updateJobDto.status.toUpperCase() as JobStatus })
      };

      const job = await this.prisma.job.update({
        where: { id },
        data: jobData
      });

      return this.mapPrismaJobToJob(job);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException('Invalid job data. Please check your input.');
      }
      throw new InternalServerErrorException('Could not update job. Please try again.');
    }
  }

  async deleteJob(id: number): Promise<Job> {
    await this.getJobById(id);
      const job = await this.prisma.job.delete({
        where: { id }
      });
      return this.mapPrismaJobToJob(job);
  }

  async getAllApplications(): Promise<Application[]> {
      const applications = await this.prisma.application.findMany({
        include: {
          job: true
      },
      orderBy: { createdAt: 'desc' }
      });
    return applications.map(app => this.mapPrismaApplicationToApplication(app));
  }

  async createApplication(createApplicationDto: CreateApplicationDto & { cvFile?: string }) {
    const { jobId, ...applicationData } = createApplicationDto;

    try {
      console.log('Creating application with data:', createApplicationDto);

      // Validate that jobId exists
      const job = await this.getJobById(jobId);
      console.log('Found job:', job);

      // Clean and validate data
      const cleanedData: Prisma.ApplicationCreateInput = {
        fullName: applicationData.fullName?.trim() || '',
        email: applicationData.email?.trim().toLowerCase() || '',
        phone: applicationData.phone?.trim() || '',
        coverLetter: applicationData.coverLetter?.trim() || null,
        cvFile: applicationData.cvFile || null,
        job: {
          connect: {
            id: jobId
          }
        },
        status: 'pending' as ApplicationStatus
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

      console.log('Cleaned application data:', cleanedData);

      // Create application
      try {
        const application = await this.prisma.application.create({
          data: cleanedData,
      include: {
        job: true
      }
    });

        console.log('Created application:', application);
    return this.mapPrismaApplicationToApplication(application);
      } catch (error) {
        console.error('Error creating application in Prisma:', error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ConflictException('Bạn đã ứng tuyển vị trí này rồi');
          }
          console.error('Prisma error code:', error.code);
          console.error('Prisma error message:', error.message);
          throw new BadRequestException('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
        }
        if (error instanceof Prisma.PrismaClientValidationError) {
          console.error('Prisma validation error:', error.message);
          throw new BadRequestException('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
        }
        throw new BadRequestException('Không thể tạo đơn ứng tuyển');
      }
    } catch (error) {
      console.error('Error in createApplication:', error);
      if (error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Không thể tạo đơn ứng tuyển');
    }
  }

  async getJobApplications(jobId: number, query: ApplicationQueryDto): Promise<Application[]> {
    await this.getJobById(jobId);

    const where: Prisma.ApplicationWhereInput = {
      jobId,
      ...(query.status && { status: query.status })
    };

    const applications = await this.prisma.application.findMany({
      where,
      include: {
        job: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return applications.map(app => this.mapPrismaApplicationToApplication(app));
  }

  async getApplication(id: number): Promise<Application> {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        job: true
      }
    });

    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    return this.mapPrismaApplicationToApplication(application);
  }

  async updateApplicationStatus(id: number, status: ApplicationStatus): Promise<Application> {
    const application = await this.prisma.application.update({
      where: { id },
      data: { status },
      include: {
        job: true
      }
    });

    return this.mapPrismaApplicationToApplication(application);
  }

  async getStats() {
    try {
      const [totalApplications, applicationsByStatus] = await Promise.all([
        this.prisma.application.count(),
        this.prisma.application.groupBy({
          by: ['status'],
          _count: true,
        }),
      ]);

      const [totalJobs, activeJobs] = await Promise.all([
        this.prisma.job.count(),
        this.prisma.job.count({
          where: { status: 'active' as JobStatus },
        }),
      ]);

      const statusCounts = {
        pending: await this.prisma.application.count({
          where: { status: 'pending' }
        }),
        reviewed: await this.prisma.application.count({
          where: { status: 'reviewed' }
        }),
        interviewed: await this.prisma.application.count({
          where: { status: 'interviewed' }
        }),
        accepted: await this.prisma.application.count({
          where: { status: 'accepted' }
        }),
        rejected: await this.prisma.application.count({
          where: { status: 'rejected' }
        })
      };

      return {
        totalApplications,
        totalJobs,
        activeJobs,
        statusCounts
      };
    } catch (error) {
      console.error('Error in getStats:', error);
      throw new InternalServerErrorException('Failed to get recruitment stats');
    }
  }

  async deleteApplication(id: number): Promise<Application> {
      const application = await this.prisma.application.delete({
        where: { id },
        include: {
          job: true
        }
      });

      return this.mapPrismaApplicationToApplication(application);
  }

  private mapPrismaApplicationToApplication(prismaApplication: any): ApplicationInterface {
    return {
      id: prismaApplication.id,
      fullName: prismaApplication.fullName,
      email: prismaApplication.email,
      phone: prismaApplication.phone,
      coverLetter: prismaApplication.coverLetter || null,
      cvFile: prismaApplication.cvFile || null,
      status: prismaApplication.status || 'pending',
      createdAt: prismaApplication.createdAt,
      updatedAt: prismaApplication.updatedAt,
      jobId: prismaApplication.jobId,
      job: prismaApplication.job ? this.mapPrismaJobToJob(prismaApplication.job) : undefined
    };
  }
} 