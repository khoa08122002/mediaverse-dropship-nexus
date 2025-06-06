import { ApplicationStatus } from '@prisma/client';
export interface Application {
    id: number;
    jobId: number;
    fullName: string;
    email: string;
    phone: string;
    coverLetter?: string;
    cvFile?: string;
    status: ApplicationStatus;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateApplicationDto {
    jobId: number;
    fullName: string;
    email: string;
    phone: string;
    coverLetter?: string;
    cvFile?: string;
}
export declare class UpdateApplicationStatusDto {
    status: ApplicationStatus;
}
