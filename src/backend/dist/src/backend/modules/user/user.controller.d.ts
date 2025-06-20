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
    getProfile(req: any): Promise<{
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
    changePassword(req: any, changePasswordDto: {
        currentPassword: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
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
    create(createUserDto: CreateUserDto): Promise<{
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
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
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
    remove(id: string): Promise<any>;
    adminChangePassword(id: string, newPassword: string): Promise<{
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
    search(query: string): Promise<any>;
}
