import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { JobType, JobStatus } from '@prisma/client';

export class CreateJobDto {
  @ApiProperty({ description: 'Job title', example: 'Frontend Developer' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Department name', example: 'Engineering' })
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty({ description: 'Job location', example: 'TP.HCM' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ enum: JobType, description: 'Type of employment', example: JobType.fulltime })
  @IsEnum(JobType)
  @IsNotEmpty()
  type: JobType;

  @ApiProperty({ description: 'Job description', example: 'We are looking for a Frontend Developer...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Job requirements', example: '- 2+ years of React experience\n- Strong TypeScript skills' })
  @IsString()
  @IsNotEmpty()
  requirements: string;

  @ApiProperty({ description: 'Benefits offered', example: '- Competitive salary\n- Health insurance' })
  @IsString()
  @IsOptional()
  benefits?: string;

  @ApiProperty({ description: 'Salary range', example: '15-25 triệu VNĐ' })
  @IsString()
  @IsOptional()
  salary?: string;

  @ApiProperty({ enum: JobStatus, description: 'Job posting status', example: JobStatus.active })
  @IsEnum(JobStatus)
  @IsNotEmpty()
  status: JobStatus;
} 