export * from '../../../../prisma/prisma.service';
export * from '../../../../prisma/prisma.module';
export * from '../../../../prisma/types';

export enum Role {
  ADMIN = 'ADMIN',
  HR = 'HR',
  USER = 'USER'
}

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
} 