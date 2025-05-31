import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Role } from '../prisma/types';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('AdminGuard - User:', user); // Debug log

    if (!user) {
      console.log('AdminGuard - No user found in request');
      throw new UnauthorizedException('User not found in request');
    }

    if (!user.role) {
      console.log('AdminGuard - No role found for user');
      throw new UnauthorizedException('No role found for user');
    }

    const hasAdminRole = user.role === Role.ADMIN;
    console.log('AdminGuard - Is Admin:', hasAdminRole, 'Role:', user.role);

    if (!hasAdminRole) {
      throw new UnauthorizedException('Requires admin role');
    }

    return true;
  }
} 