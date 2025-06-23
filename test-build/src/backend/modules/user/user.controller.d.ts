import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
export declare enum Role {
    ADMIN = "ADMIN",
    USER = "USER"
}
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
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
    getProfile(req: any): Promise<{
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
    changePassword(req: any, changePasswordDto: {
        currentPassword: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
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
    create(createUserDto: CreateUserDto): Promise<{
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
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
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
    remove(id: string): Promise<{
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
    adminChangePassword(id: string, newPassword: string): Promise<{
        message: string;
    }>;
    search(query: string): Promise<{
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
}
