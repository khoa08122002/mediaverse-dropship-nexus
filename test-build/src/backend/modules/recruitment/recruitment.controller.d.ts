import { RecruitmentService } from './recruitment.service';
import { FileUploadService } from '../file-upload/file-upload.service';
import type { CreateJobDto, UpdateJobDto } from './dto/job.dto';
import type { CreateApplicationDto, UpdateApplicationStatusDto, ApplicationQueryDto } from './dto/application.dto';
import type { Response } from 'express';
import type { Job, Application } from './types/recruitment.types';
export declare class RecruitmentController {
    private readonly recruitmentService;
    private readonly fileUploadService;
    constructor(recruitmentService: RecruitmentService, fileUploadService: FileUploadService);
    getAllJobs(): Promise<Job[]>;
    getJobById(id: string): Promise<Job>;
    createJob(createJobDto: CreateJobDto): Promise<Job>;
    updateJob(id: string, updateJobDto: UpdateJobDto): Promise<Job>;
    deleteJob(id: string): Promise<Job>;
    createApplication(createApplicationDto: CreateApplicationDto, file?: Express.Multer.File): Promise<Application>;
    getAllApplications(): Promise<Application[]>;
    getJobApplications(id: string, query: ApplicationQueryDto): Promise<Application[]>;
    getStats(): Promise<any>;
    getApplication(id: string): Promise<Application>;
    updateApplicationStatus(id: string, updateStatusDto: UpdateApplicationStatusDto): Promise<Application>;
    downloadCV(id: string, res: Response): Promise<void>;
    deleteApplication(id: number): Promise<{
        email: string;
        fullName: string;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        coverLetter: string | null;
        cvFile: string | null;
        jobId: number;
    }>;
}
