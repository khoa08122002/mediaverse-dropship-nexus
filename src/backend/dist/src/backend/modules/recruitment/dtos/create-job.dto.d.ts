import { JobType, JobStatus } from '@prisma/client';
export declare class CreateJobDto {
    title: string;
    department: string;
    location: string;
    type: JobType;
    description: string;
    requirements: string;
    benefits?: string;
    salary?: string;
    status: JobStatus;
}
