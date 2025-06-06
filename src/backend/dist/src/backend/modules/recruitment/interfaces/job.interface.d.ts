import { JobStatus, JobType } from '@prisma/client';
export interface Job {
    id: number;
    title: string;
    department: string;
    location: string;
    type: JobType;
    description: string;
    requirements: string;
    benefits: string;
    salary: string;
    status: JobStatus;
    createdAt: Date;
    updatedAt: Date;
}
