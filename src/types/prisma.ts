// Types exported from @prisma/client for frontend use
export type Job = {
  id: number;
  title: string;
  department: string;
  description: string;
  requirements: string;
  type: JobType;
  status: JobStatus;
  location: string;
  benefits: string | null;
  salary: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Application = {
  id: number;
  jobId: number;
  fullName: string;
  email: string;
  phone: string;
  cv: string;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
};

export enum JobType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERNSHIP = 'INTERNSHIP'
}

export enum JobStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  DRAFT = 'DRAFT'
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  REVIEWING = 'REVIEWING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
} 