import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { Status, Role } from '../../../prisma/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'mediaverse-secret-key-2024',
    });
  }

  async validate(payload: any) {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Token không hợp lệ');
    }

    // Kiểm tra user có tồn tại và active không
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        fullName: true
      }
    });

    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }

    if (user.status === Status.INACTIVE) {
      throw new UnauthorizedException('Tài khoản đã bị vô hiệu hóa');
    }

    // Ensure role is in correct format
    const role = user.role as Role;
    if (!Object.values(Role).includes(role)) {
      throw new UnauthorizedException('Vai trò không hợp lệ');
    }

    return {
      id: user.id,
      email: user.email,
      role: role,
      status: user.status,
      fullName: user.fullName
    };
  }
}