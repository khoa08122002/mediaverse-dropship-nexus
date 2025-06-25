import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { JobType, JobStatus } from '@prisma/client';

export type JobTypeLowercase = 'fulltime' | 'parttime' | 'contract' | 'internship';
export type JobStatusLowercase = 'active' | 'closed' | 'draft';

export const JobTypeValues = {
  fulltime: 'fulltime',
  parttime: 'parttime',
  contract: 'contract',
  internship: 'internship'
} as const;

export const JobStatusValues = {
  active: 'active',
  closed: 'closed',
  draft: 'draft'
} as const;

export class CreateJobDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  department: string;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty({ enum: Object.values(JobTypeValues), description: 'Type of employment', example: JobTypeValues.fulltime })
  @IsEnum(Object.values(JobTypeValues))
  type: JobTypeLowercase;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  requirements: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  benefits?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  salary?: string;

  @ApiProperty({ enum: Object.values(JobStatusValues), description: 'Job posting status', example: JobStatusValues.active })
  @IsEnum(Object.values(JobStatusValues))
  status: JobStatusLowercase;
}

export class UpdateJobDto extends CreateJobDto {} 