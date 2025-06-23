import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        email: string;
        password: string;
        fullName: string;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.Status;
        id: string;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        email: string;
        password: string;
        fullName: string;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.Status;
        id: string;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByEmail(email: string): Promise<{
        email: string;
        password: string;
        fullName: string;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.Status;
        id: string;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(data: CreateUserDto): Promise<{
        email: string;
        password: string;
        fullName: string;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.Status;
        id: string;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: UpdateUserDto): Promise<{
        email: string;
        password: string;
        fullName: string;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.Status;
        id: string;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updatePassword(id: string, hashedPassword: string): Promise<{
        email: string;
        password: string;
        fullName: string;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.Status;
        id: string;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateLastLogin(id: string): Promise<{
        email: string;
        password: string;
        fullName: string;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.Status;
        id: string;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(id: string): Promise<{
        email: string;
        password: string;
        fullName: string;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.Status;
        id: string;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    searchUsers(query: string): Promise<{
        email: string;
        password: string;
        fullName: string;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.Status;
        id: string;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
}
