import { RecruitmentService } from './recruitment.service';
import { FileUploadService } from '../file-upload/file-upload.service';
import { CreateJobDto, UpdateJobDto } from './dto/job.dto';
import { CreateApplicationDto, UpdateApplicationStatusDto, ApplicationQueryDto } from './dto/application.dto';
import { Response } from 'express';
import { Job, Application } from './types/recruitment.types';
export declare class RecruitmentController {
    private readonly recruitmentService;
    private readonly fileUploadService;
    constructor(recruitmentService: RecruitmentService, fileUploadService: FileUploadService);
    getAllJobs(): Promise<Job[]>;
    getJobById(id: string): Promise<Job>;
    createJob(createJobDto: CreateJobDto): Promise<Job>;
    updateJob(id: string, updateJobDto: UpdateJobDto): Promise<Job>;
    deleteJob(id: string): Promise<void>;
    getAllApplications(): Promise<Application[]>;
    getJobApplications(id: string, query: ApplicationQueryDto): Promise<Application[]>;
    getStats(): Promise<any>;
    createApplication(createApplicationDto: CreateApplicationDto, file?: Express.Multer.File): Promise<Application>;
    getApplication(id: number): Promise<Application>;
    updateApplicationStatus(id: number, updateStatusDto: UpdateApplicationStatusDto): Promise<Application>;
    downloadCV(id: number, res: Response): Promise<void>;
    deleteApplication(id: number): Promise<{
        id: number;
        fullName: string;
        email: string;
        phone: string;
        coverLetter: string | null;
        cvFile: string | null;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        createdAt: Date;
        updatedAt: Date;
        jobId: number;
    }>;
}
