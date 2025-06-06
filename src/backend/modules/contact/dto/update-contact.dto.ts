import { IsString, IsOptional, IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateContactDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  company?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  service?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  budget?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  subject?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({ required: false, enum: ['NEW', 'PROCESSING', 'REPLIED', 'COMPLETED', 'REJECTED'] })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ required: false, enum: ['HIGH', 'MEDIUM', 'LOW'] })
  @IsString()
  @IsOptional()
  priority?: string;
} 