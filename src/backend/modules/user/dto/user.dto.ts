import { IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role, Status } from '../../../prisma/types';

export class CreateUserDto {
  @ApiProperty({ description: 'Email của người dùng' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Mật khẩu của người dùng' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'Họ tên đầy đủ của người dùng' })
  @IsString()
  fullName: string;

  @ApiProperty({ description: 'Vai trò của người dùng', enum: Role, default: Role.VIEWER })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiProperty({ description: 'Trạng thái người dùng', enum: Status, default: Status.ACTIVE })
  @IsEnum(Status)
  @IsOptional()
  status?: Status = Status.ACTIVE;
}

export class UpdateUserDto {
  @ApiProperty({ description: 'Email của người dùng', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Mật khẩu của người dùng', required: false })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ description: 'Họ tên đầy đủ của người dùng', required: false })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiProperty({ description: 'Vai trò của người dùng', enum: Role, required: false })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiProperty({ description: 'Trạng thái người dùng', enum: Status, required: false })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;
} 