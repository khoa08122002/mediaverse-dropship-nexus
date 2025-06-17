import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<{
        id: string;
        fullName: string;
        email: string;
        status: import(".prisma/client").$Enums.Status;
        createdAt: Date;
        updatedAt: Date;
        role: import(".prisma/client").$Enums.Role;
        lastLogin: Date | null;
    }>;
    login(loginDto: {
        email: string;
        password: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            fullName: string;
            role: import(".prisma/client").$Enums.Role;
            status: import(".prisma/client").$Enums.Status;
        };
    }>;
    refresh(refreshDto: {
        refreshToken: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            fullName: string;
            role: import(".prisma/client").$Enums.Role;
            status: "ACTIVE";
        };
    }>;
    changePassword(changePasswordDto: {
        userId: number;
        currentPassword: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
}
