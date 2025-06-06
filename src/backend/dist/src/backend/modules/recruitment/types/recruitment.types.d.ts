import { Job as PrismaJob, Application as PrismaApplication } from '@prisma/client';
import { JobType, JobStatus, ApplicationStatus } from '@prisma/client';
export type Job = PrismaJob;
export type Application = PrismaApplication & {
    job?: Job;
};
export { JobType, JobStatus, ApplicationStatus };
