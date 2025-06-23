export type JobTypeLowercase = 'fulltime' | 'parttime' | 'contract' | 'internship';
export type JobStatusLowercase = 'active' | 'closed' | 'draft';
export declare const JobTypeValues: {
    readonly fulltime: "fulltime";
    readonly parttime: "parttime";
    readonly contract: "contract";
    readonly internship: "internship";
};
export declare const JobStatusValues: {
    readonly active: "active";
    readonly closed: "closed";
    readonly draft: "draft";
};
export declare class CreateJobDto {
    title: string;
    department: string;
    location: string;
    type: JobTypeLowercase;
    description: string;
    requirements: string;
    benefits?: string;
    salary?: string;
    status: JobStatusLowercase;
}
export declare class UpdateJobDto extends CreateJobDto {
}
