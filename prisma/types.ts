import { PrismaClient } from '@prisma/client';

export enum Role {
  ADMIN = 'ADMIN',
  HR = 'HR',
  USER = 'USER'
}

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export { PrismaClient }; 