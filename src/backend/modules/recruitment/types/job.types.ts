export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: JobType;
  description: string;
  requirements: string;
  benefits: string;
  salary: string;
  status: JobStatus;
  postedDate: Date;
  updatedDate?: Date;
}

export enum JobType {
  FULLTIME = 'FULLTIME',
  PARTTIME = 'PARTTIME',
  CONTRACT = 'CONTRACT',
  INTERNSHIP = 'INTERNSHIP'
}

export enum JobStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  DRAFT = 'DRAFT'
}

export class CreateJobDto {
  title: string;
  department: string;
  location: string;
  type: JobType;
  description: string;
  requirements: string;
  benefits: string;
  salary: string;
  status?: JobStatus;
}

export class UpdateJobDto {
  title?: string;
  department?: string;
  location?: string;
  type?: JobType;
  description?: string;
  requirements?: string;
  benefits?: string;
  salary?: string;
  status?: JobStatus;
} 