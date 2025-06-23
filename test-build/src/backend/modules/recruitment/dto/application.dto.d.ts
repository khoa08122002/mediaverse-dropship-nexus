import { ApplicationStatus } from '@prisma/client';
export declare class CreateApplicationDto {
    fullName: string;
    email: string;
    phone: string;
    coverLetter?: string;
    cvFile?: string;
    jobId: number;
}
export declare class UpdateApplicationStatusDto {
    status: ApplicationStatus;
}
export declare class ApplicationQueryDto {
    status?: ApplicationStatus;
    search?: string;
}
export declare class ApplicationDto {
    fullName: string;
    email: string;
    phone: string;
    jobId: number;
    status: ApplicationStatus;
}
