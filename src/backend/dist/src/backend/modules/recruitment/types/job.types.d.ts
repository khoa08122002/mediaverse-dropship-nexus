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
export declare enum JobType {
    FULLTIME = "FULLTIME",
    PARTTIME = "PARTTIME",
    CONTRACT = "CONTRACT",
    INTERNSHIP = "INTERNSHIP"
}
export declare enum JobStatus {
    ACTIVE = "ACTIVE",
    CLOSED = "CLOSED",
    DRAFT = "DRAFT"
}
export declare class CreateJobDto {
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
export declare class UpdateJobDto {
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
