import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role, Status } from '../../prisma';

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

  @ApiProperty({ description: 'Vai trò của người dùng', enum: Role, default: Role.USER })
  @IsEnum(Role)
  @IsOptional()
  role?: Role = Role.USER;

  @ApiProperty({ description: 'Trạng thái người dùng', enum: Status, default: Status.ACTIVE })
  @IsEnum(Status)
  @IsOptional()
  status?: Status = Status.ACTIVE;
} 