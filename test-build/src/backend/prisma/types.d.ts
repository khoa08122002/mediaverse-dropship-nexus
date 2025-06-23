import { PrismaClient } from '@prisma/client';
export declare enum Role {
    ADMIN = "ADMIN",
    HR = "HR",
    USER = "USER"
}
export declare enum Status {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}
export { PrismaClient };
