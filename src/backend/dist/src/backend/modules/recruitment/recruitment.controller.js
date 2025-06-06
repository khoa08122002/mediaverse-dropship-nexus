"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecruitmentController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const recruitment_service_1 = require("./recruitment.service");
const file_upload_service_1 = require("../file-upload/file-upload.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const job_dto_1 = require("./dto/job.dto");
const application_dto_1 = require("./dto/application.dto");
const prisma_1 = require("../prisma");
const client_1 = require("@prisma/client");
let RecruitmentController = class RecruitmentController {
    constructor(recruitmentService, fileUploadService) {
        this.recruitmentService = recruitmentService;
        this.fileUploadService = fileUploadService;
    }
    async getAllJobs() {
        return this.recruitmentService.getAllJobs();
    }
    async getJobById(id) {
        return this.recruitmentService.getJobById(Number(id));
    }
    async createJob(createJobDto) {
        return this.recruitmentService.createJob(createJobDto);
    }
    async updateJob(id, updateJobDto) {
        return this.recruitmentService.updateJob(Number(id), updateJobDto);
    }
    async deleteJob(id) {
        await this.recruitmentService.deleteJob(Number(id));
    }
    async getAllApplications() {
        return this.recruitmentService.getAllApplications();
    }
    async getJobApplications(id, query) {
        return this.recruitmentService.getJobApplications(Number(id), query);
    }
    async getStats() {
        return this.recruitmentService.getStats();
    }
    async createApplication(createApplicationDto, file) {
        try {
            console.log('Received application data:', createApplicationDto);
            console.log('Received file:', file);
            const jobId = typeof createApplicationDto.jobId === 'string'
                ? parseInt(createApplicationDto.jobId, 10)
                : createApplicationDto.jobId;
            if (isNaN(jobId)) {
                throw new common_1.BadRequestException('ID vị trí ứng tuyển không hợp lệ');
            }
            const cleanedData = {
                jobId,
                fullName: createApplicationDto.fullName?.trim(),
                email: createApplicationDto.email?.trim().toLowerCase(),
                phone: createApplicationDto.phone?.trim(),
                coverLetter: createApplicationDto.coverLetter?.trim(),
            };
            if (!cleanedData.fullName) {
                throw new common_1.BadRequestException('Vui lòng nhập họ và tên');
            }
            if (!cleanedData.email) {
                throw new common_1.BadRequestException('Vui lòng nhập email');
            }
            if (!cleanedData.phone) {
                throw new common_1.BadRequestException('Vui lòng nhập số điện thoại');
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(cleanedData.email)) {
                throw new common_1.BadRequestException('Email không hợp lệ');
            }
            const phoneRegex = /^(\+84|84|0)[35789][0-9]{8}$/;
            if (!phoneRegex.test(cleanedData.phone)) {
                throw new common_1.BadRequestException('Số điện thoại không hợp lệ');
            }
            let cvFilePath = null;
            if (file) {
                try {
                    cvFilePath = await this.fileUploadService.saveCV(file);
                }
                catch (error) {
                    console.error('Error saving CV file:', error);
                    throw new common_1.InternalServerErrorException('Không thể lưu file CV. Vui lòng thử lại sau.');
                }
            }
            try {
                const result = await this.recruitmentService.createApplication({
                    ...cleanedData,
                    cvFile: cvFilePath
                });
                return result;
            }
            catch (error) {
                console.error('Error creating application:', error);
                if (error instanceof common_1.BadRequestException) {
                    throw error;
                }
                if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                    if (error.code === 'P2002') {
                        throw new common_1.ConflictException('Bạn đã ứng tuyển vị trí này rồi');
                    }
                    throw new common_1.BadRequestException('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
                }
                throw new common_1.InternalServerErrorException('Không thể tạo đơn ứng tuyển. Vui lòng thử lại sau.');
            }
        }
        catch (error) {
            if (file && file.path) {
                try {
                    await this.fileUploadService.deleteFile(file.path);
                }
                catch (deleteError) {
                    console.error('Error deleting CV file:', deleteError);
                }
            }
            throw error;
        }
    }
    async getApplication(id) {
        return this.recruitmentService.getApplication(id);
    }
    async updateApplicationStatus(id, updateStatusDto) {
        return this.recruitmentService.updateApplicationStatus(id, updateStatusDto.status);
    }
    async downloadCV(id, res) {
        const application = await this.recruitmentService.getApplication(id);
        if (!application.cvFile) {
            throw new common_1.NotFoundException('CV file not found');
        }
        const filePath = await this.fileUploadService.getCVPath(application.cvFile);
        if (!filePath) {
            throw new common_1.NotFoundException('CV file not found');
        }
        return res.sendFile(filePath);
    }
    async deleteApplication(id) {
        return this.recruitmentService.deleteApplication(id);
    }
};
exports.RecruitmentController = RecruitmentController;
__decorate([
    (0, common_1.Get)('jobs'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all jobs' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecruitmentController.prototype, "getAllJobs", null);
__decorate([
    (0, common_1.Get)('jobs/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get job by id' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecruitmentController.prototype, "getJobById", null);
__decorate([
    (0, common_1.Post)('jobs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(prisma_1.Role.ADMIN, prisma_1.Role.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new job' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [job_dto_1.CreateJobDto]),
    __metadata("design:returntype", Promise)
], RecruitmentController.prototype, "createJob", null);
__decorate([
    (0, common_1.Put)('jobs/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(prisma_1.Role.ADMIN, prisma_1.Role.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Update a job' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, job_dto_1.UpdateJobDto]),
    __metadata("design:returntype", Promise)
], RecruitmentController.prototype, "updateJob", null);
__decorate([
    (0, common_1.Delete)('jobs/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(prisma_1.Role.ADMIN, prisma_1.Role.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a job' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecruitmentController.prototype, "deleteJob", null);
__decorate([
    (0, common_1.Get)('applications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(prisma_1.Role.ADMIN, prisma_1.Role.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Get all applications' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecruitmentController.prototype, "getAllApplications", null);
__decorate([
    (0, common_1.Get)('jobs/:id/applications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(prisma_1.Role.ADMIN, prisma_1.Role.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Get applications for a job' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, application_dto_1.ApplicationQueryDto]),
    __metadata("design:returntype", Promise)
], RecruitmentController.prototype, "getJobApplications", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(prisma_1.Role.ADMIN, prisma_1.Role.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Get recruitment statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecruitmentController.prototype, "getStats", null);
__decorate([
    (0, common_1.Post)('applications'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('cvFile', {
        limits: {
            fileSize: 5 * 1024 * 1024,
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
            }
            else {
                cb(new common_1.BadRequestException('Chỉ chấp nhận file PDF hoặc Word'), false);
            }
        }
    })),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo đơn ứng tuyển mới' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Đơn ứng tuyển đã được tạo thành công' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dữ liệu không hợp lệ' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Không tìm thấy vị trí tuyển dụng' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Bạn đã ứng tuyển vị trí này rồi' }),
    (0, swagger_1.ApiBody)({
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
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [application_dto_1.CreateApplicationDto, Object]),
    __metadata("design:returntype", Promise)
], RecruitmentController.prototype, "createApplication", null);
__decorate([
    (0, common_1.Get)('applications/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(prisma_1.Role.ADMIN, prisma_1.Role.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Get application by id' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RecruitmentController.prototype, "getApplication", null);
__decorate([
    (0, common_1.Put)('applications/:id/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(prisma_1.Role.ADMIN, prisma_1.Role.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Update application status' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, application_dto_1.UpdateApplicationStatusDto]),
    __metadata("design:returntype", Promise)
], RecruitmentController.prototype, "updateApplicationStatus", null);
__decorate([
    (0, common_1.Get)('applications/:id/cv'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(prisma_1.Role.ADMIN, prisma_1.Role.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Download CV file' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], RecruitmentController.prototype, "downloadCV", null);
__decorate([
    (0, common_1.Delete)('applications/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(prisma_1.Role.ADMIN, prisma_1.Role.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Delete application' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RecruitmentController.prototype, "deleteApplication", null);
exports.RecruitmentController = RecruitmentController = __decorate([
    (0, swagger_1.ApiTags)('recruitment'),
    (0, common_1.Controller)('recruitment'),
    __metadata("design:paramtypes", [recruitment_service_1.RecruitmentService,
        file_upload_service_1.FileUploadService])
], RecruitmentController);
//# sourceMappingURL=recruitment.controller.js.map