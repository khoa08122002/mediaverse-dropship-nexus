import { ApplicationStatus } from '@prisma/client';
import { Job } from './job.interface';

export interface Application {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  coverLetter: string;
  cvFile: string;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
  jobId: number;
  job?: Job;
} 