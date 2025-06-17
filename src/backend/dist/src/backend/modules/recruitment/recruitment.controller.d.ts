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
    deleteJob(id: string): Promise<Job>;
    createApplication(createApplicationDto: CreateApplicationDto, file?: Express.Multer.File): Promise<Application>;
    getAllApplications(): Promise<Application[]>;
    getJobApplications(id: string, query: ApplicationQueryDto): Promise<Application[]>;
    getStats(): Promise<any>;
    getApplication(id: string): Promise<Application>;
    updateApplicationStatus(id: string, updateStatusDto: UpdateApplicationStatusDto): Promise<Application>;
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
