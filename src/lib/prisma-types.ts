import type { Job as PrismaJob, Application as PrismaApplication } from '@prisma/client';

export const ApplicationStatus = {
  PENDING: 'pending',
  REVIEWING: 'reviewed',
  INTERVIEWING: 'interviewed',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected'
} as const;

export type ApplicationStatusType = (typeof ApplicationStatus)[keyof typeof ApplicationStatus];

export const JobType = {
  FULL_TIME: 'FULL_TIME',
  PART_TIME: 'PART_TIME',
  CONTRACT: 'CONTRACT',
  INTERNSHIP: 'INTERNSHIP'
} as const;

export type JobTypeValue = (typeof JobType)[keyof typeof JobType];

export const JobStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  CLOSED: 'CLOSED'
} as const;

export type JobStatusValue = (typeof JobStatus)[keyof typeof JobStatus];

export type Job = PrismaJob;

export interface Application extends Omit<PrismaApplication, 'status'> {
  status: ApplicationStatusType;
  job?: Job;
} 