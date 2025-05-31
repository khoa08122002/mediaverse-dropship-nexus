import { IsEmail, IsString, IsEnum, IsOptional } from 'class-validator';
import { Role, Status } from '../../../prisma/types';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  fullName: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role = Role.VIEWER;

  @IsEnum(Status)
  @IsOptional()
  status?: Status = Status.ACTIVE;
} 