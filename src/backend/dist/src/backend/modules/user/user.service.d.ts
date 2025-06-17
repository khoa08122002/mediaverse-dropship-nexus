import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        fullName: string;
        email: string;
        status: import(".prisma/client").$Enums.Status;
        createdAt: Date;
        updatedAt: Date;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        lastLogin: Date | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        fullName: string;
        email: string;
        status: import(".prisma/client").$Enums.Status;
        createdAt: Date;
        updatedAt: Date;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        lastLogin: Date | null;
    }>;
    findByEmail(email: string): Promise<{
        id: string;
        fullName: string;
        email: string;
        status: import(".prisma/client").$Enums.Status;
        createdAt: Date;
        updatedAt: Date;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        lastLogin: Date | null;
    }>;
    create(data: CreateUserDto): Promise<{
        id: string;
        fullName: string;
        email: string;
        status: import(".prisma/client").$Enums.Status;
        createdAt: Date;
        updatedAt: Date;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        lastLogin: Date | null;
    }>;
    update(id: string, data: UpdateUserDto): Promise<{
        id: string;
        fullName: string;
        email: string;
        status: import(".prisma/client").$Enums.Status;
        createdAt: Date;
        updatedAt: Date;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        lastLogin: Date | null;
    }>;
    updatePassword(id: string, hashedPassword: string): Promise<{
        id: string;
        fullName: string;
        email: string;
        status: import(".prisma/client").$Enums.Status;
        createdAt: Date;
        updatedAt: Date;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        lastLogin: Date | null;
    }>;
    updateLastLogin(id: string): Promise<{
        id: string;
        fullName: string;
        email: string;
        status: import(".prisma/client").$Enums.Status;
        createdAt: Date;
        updatedAt: Date;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        lastLogin: Date | null;
    }>;
    delete(id: string): Promise<{
        id: string;
        fullName: string;
        email: string;
        status: import(".prisma/client").$Enums.Status;
        createdAt: Date;
        updatedAt: Date;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        lastLogin: Date | null;
    }>;
    searchUsers(query: string): Promise<{
        id: string;
        fullName: string;
        email: string;
        status: import(".prisma/client").$Enums.Status;
        createdAt: Date;
        updatedAt: Date;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        lastLogin: Date | null;
    }[]>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
}
