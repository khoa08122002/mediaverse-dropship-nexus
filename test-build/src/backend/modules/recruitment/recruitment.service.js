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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecruitmentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const job_dto_1 = require("./dto/job.dto");
const client_1 = require("@prisma/client");
const file_upload_service_1 = require("../file-upload/file-upload.service");
let RecruitmentService = class RecruitmentService {
    constructor(prisma, fileUploadService) {
        this.prisma = prisma;
        this.fileUploadService = fileUploadService;
    }
    mapPrismaJobToJob(job) {
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
    transformJobData(jobDto) {
        const transformedData = {};
        transformedData.title = jobDto.title;
        transformedData.department = jobDto.department;
        transformedData.location = jobDto.location;
        transformedData.description = jobDto.description;
        transformedData.requirements = jobDto.requirements;
        if (jobDto.benefits)
            transformedData.benefits = jobDto.benefits;
        if (jobDto.salary)
            transformedData.salary = jobDto.salary;
        if (jobDto.type) {
            console.log('Input job type:', jobDto.type);
            if (!Object.keys(job_dto_1.JobTypeValues).includes(jobDto.type)) {
                console.error('Invalid job type:', jobDto.type);
                console.error('Available types:', Object.keys(job_dto_1.JobTypeValues));
                throw new common_1.BadRequestException(`Invalid job type: ${jobDto.type}. Must be one of: ${Object.keys(job_dto_1.JobTypeValues).join(', ')}`);
            }
            transformedData.type = jobDto.type.toUpperCase();
        }
        else {
            transformedData.type = 'fulltime';
        }
        if (jobDto.status) {
            console.log('Input job status:', jobDto.status);
            if (!Object.keys(job_dto_1.JobStatusValues).includes(jobDto.status)) {
                console.error('Invalid job status:', jobDto.status);
                console.error('Available statuses:', Object.keys(job_dto_1.JobStatusValues));
                throw new common_1.BadRequestException(`Invalid job status: ${jobDto.status}. Must be one of: ${Object.keys(job_dto_1.JobStatusValues).join(', ')}`);
            }
            transformedData.status = jobDto.status.toUpperCase();
        }
        else {
            transformedData.status = 'active';
        }
        return transformedData;
    }
    async getAllJobs() {
        const jobs = await this.prisma.job.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return jobs.map(job => this.mapPrismaJobToJob(job));
    }
    async getJobById(id) {
        const job = await this.prisma.job.findUnique({
            where: { id }
        });
        if (!job) {
            throw new common_1.NotFoundException(`Job with ID ${id} not found`);
        }
        return this.mapPrismaJobToJob(job);
    }
    validateAndConvertJobType(type) {
        const convertedType = job_dto_1.JobTypeValues[type.toLowerCase()];
        if (!convertedType) {
            throw new common_1.BadRequestException(`Invalid job type: ${type}. Must be one of: ${Object.keys(job_dto_1.JobTypeValues).join(', ')}`);
        }
        return convertedType;
    }
    validateAndConvertJobStatus(status) {
        const convertedStatus = job_dto_1.JobStatusValues[status.toLowerCase()];
        if (!convertedStatus) {
            throw new common_1.BadRequestException(`Invalid job status: ${status}. Must be one of: ${Object.keys(job_dto_1.JobStatusValues).join(', ')}`);
        }
        return convertedStatus;
    }
    async createJob(createJobDto) {
        try {
            console.log('Creating job with data:', createJobDto);
            const jobData = {
                title: createJobDto.title,
                department: createJobDto.department,
                location: createJobDto.location,
                description: createJobDto.description,
                requirements: createJobDto.requirements,
                benefits: createJobDto.benefits || '',
                salary: createJobDto.salary || 'Negotiable',
                type: createJobDto.type,
                status: createJobDto.status
            };
            console.log('Transformed job data:', jobData);
            const job = await this.prisma.job.create({
                data: jobData
            });
            console.log('Created job:', job);
            return this.mapPrismaJobToJob(job);
        }
        catch (error) {
            console.error('Error details:', error);
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                console.error('Prisma error code:', error.code);
                console.error('Prisma error message:', error.message);
                throw new common_1.BadRequestException('Invalid job data. Please check your input.');
            }
            throw new common_1.InternalServerErrorException('Could not create job. Please try again.');
        }
    }
    async updateJob(id, updateJobDto) {
        await this.getJobById(id);
        try {
            const jobData = {
                ...(updateJobDto.title && { title: updateJobDto.title }),
                ...(updateJobDto.department && { department: updateJobDto.department }),
                ...(updateJobDto.location && { location: updateJobDto.location }),
                ...(updateJobDto.description && { description: updateJobDto.description }),
                ...(updateJobDto.requirements && { requirements: updateJobDto.requirements }),
                ...(updateJobDto.benefits !== undefined && { benefits: updateJobDto.benefits }),
                ...(updateJobDto.salary !== undefined && { salary: updateJobDto.salary }),
                ...(updateJobDto.type && { type: updateJobDto.type.toUpperCase() }),
                ...(updateJobDto.status && { status: updateJobDto.status.toUpperCase() })
            };
            const job = await this.prisma.job.update({
                where: { id },
                data: jobData
            });
            return this.mapPrismaJobToJob(job);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                throw new common_1.BadRequestException('Invalid job data. Please check your input.');
            }
            throw new common_1.InternalServerErrorException('Could not update job. Please try again.');
        }
    }
    async deleteJob(id) {
        await this.getJobById(id);
        const job = await this.prisma.job.delete({
            where: { id }
        });
        return this.mapPrismaJobToJob(job);
    }
    async getAllApplications() {
        const applications = await this.prisma.application.findMany({
            include: {
                job: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return applications.map(app => this.mapPrismaApplicationToApplication(app));
    }
    async createApplication(createApplicationDto) {
        const { jobId, ...applicationData } = createApplicationDto;
        try {
            console.log('Creating application with data:', createApplicationDto);
            const job = await this.getJobById(jobId);
            console.log('Found job:', job);
            const cleanedData = {
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
                status: 'pending'
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
            console.log('Cleaned application data:', cleanedData);
            try {
                const application = await this.prisma.application.create({
                    data: cleanedData,
                    include: {
                        job: true
                    }
                });
                console.log('Created application:', application);
                return this.mapPrismaApplicationToApplication(application);
            }
            catch (error) {
                console.error('Error creating application in Prisma:', error);
                if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                    if (error.code === 'P2002') {
                        throw new common_1.ConflictException('Bạn đã ứng tuyển vị trí này rồi');
                    }
                    console.error('Prisma error code:', error.code);
                    console.error('Prisma error message:', error.message);
                    throw new common_1.BadRequestException('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
                }
                if (error instanceof client_1.Prisma.PrismaClientValidationError) {
                    console.error('Prisma validation error:', error.message);
                    throw new common_1.BadRequestException('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
                }
                throw new common_1.BadRequestException('Không thể tạo đơn ứng tuyển');
            }
        }
        catch (error) {
            console.error('Error in createApplication:', error);
            if (error instanceof common_1.BadRequestException || error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.BadRequestException('Không thể tạo đơn ứng tuyển');
        }
    }
    async getJobApplications(jobId, query) {
        await this.getJobById(jobId);
        const where = {
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
    async getApplication(id) {
        const application = await this.prisma.application.findUnique({
            where: {
                id: id
            },
            include: {
                job: true
            }
        });
        if (!application) {
            throw new common_1.NotFoundException(`Không tìm thấy đơn ứng tuyển với ID ${id}`);
        }
        return this.mapPrismaApplicationToApplication(application);
    }
    async updateApplicationStatus(id, status) {
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
                    where: { status: 'active' },
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
        }
        catch (error) {
            console.error('Error in getStats:', error);
            throw new common_1.InternalServerErrorException('Failed to get recruitment stats');
        }
    }
    async deleteApplication(id) {
        const application = await this.prisma.application.delete({
            where: { id },
            include: {
                job: true
            }
        });
        return this.mapPrismaApplicationToApplication(application);
    }
    mapPrismaApplicationToApplication(prismaApplication) {
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
};
exports.RecruitmentService = RecruitmentService;
exports.RecruitmentService = RecruitmentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        file_upload_service_1.FileUploadService])
], RecruitmentService);
//# sourceMappingURL=recruitment.service.js.map