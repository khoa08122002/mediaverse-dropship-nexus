import { IsString, IsNotEmpty, IsEmail, IsPhoneNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApplicationDto {
  @ApiProperty({ description: 'Full name of the applicant', example: 'Nguyen Van A' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ description: 'Email address', example: 'example@email.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Phone number in E.164 format', example: '+84912345678' })
  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'Cover letter content', required: false, example: 'I am writing to express my interest...' })
  @IsString()
  @IsOptional()
  coverLetter?: string;

  @ApiProperty({ description: 'ID of the job being applied for', example: 1 })
  @IsNotEmpty()
  jobId: number;
} 