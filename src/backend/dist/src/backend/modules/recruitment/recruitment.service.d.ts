import { PrismaService } from '../../prisma/prisma.service';
import { CreateJobDto, UpdateJobDto } from './dto/job.dto';
import { CreateApplicationDto, ApplicationQueryDto } from './dto/application.dto';
import { Job, Application, ApplicationStatus } from '@prisma/client';
import { FileUploadService } from '../file-upload/file-upload.service';
import { Application as ApplicationInterface } from './interfaces/application.interface';
export declare class RecruitmentService {
    private readonly prisma;
    private readonly fileUploadService;
    constructor(prisma: PrismaService, fileUploadService: FileUploadService);
    private mapPrismaJobToJob;
    private transformJobData;
    getAllJobs(): Promise<Job[]>;
    getJobById(id: number): Promise<Job>;
    private validateAndConvertJobType;
    private validateAndConvertJobStatus;
    createJob(createJobDto: CreateJobDto): Promise<Job>;
    updateJob(id: number, updateJobDto: UpdateJobDto): Promise<Job>;
    deleteJob(id: number): Promise<Job>;
    getAllApplications(): Promise<Application[]>;
    createApplication(createApplicationDto: CreateApplicationDto & {
        cvFile?: string;
    }): Promise<ApplicationInterface>;
    getJobApplications(jobId: number, query: ApplicationQueryDto): Promise<Application[]>;
    getApplication(id: number): Promise<Application>;
    updateApplicationStatus(id: number, status: ApplicationStatus): Promise<Application>;
    getStats(): Promise<{
        totalApplications: number;
        totalJobs: number;
        activeJobs: number;
        statusCounts: {
            pending: number;
            reviewed: number;
            interviewed: number;
            accepted: number;
            rejected: number;
        };
    }>;
    deleteApplication(id: number): Promise<Application>;
    private mapPrismaApplicationToApplication;
}
