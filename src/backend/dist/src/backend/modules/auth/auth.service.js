"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        if (user.status !== 'ACTIVE') {
            throw new common_1.UnauthorizedException('Account is inactive');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const { password: _, ...result } = user;
        return result;
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role
        };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '1h',
            secret: process.env.JWT_SECRET || 'your-secret-key',
        });
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: '7d',
            secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
        });
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                status: user.status,
            },
        };
    }
    async refresh(refreshDto) {
        try {
            const decoded = this.jwtService.verify(refreshDto.refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
            });
            const user = await this.prisma.user.findUnique({
                where: { id: decoded.sub },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            if (user.status !== 'ACTIVE') {
                throw new common_1.UnauthorizedException('Account is inactive');
            }
            const payload = {
                sub: user.id,
                email: user.email,
                role: user.role,
            };
            const accessToken = this.jwtService.sign(payload, {
                expiresIn: '1h',
                secret: process.env.JWT_SECRET || 'your-secret-key',
            });
            const newRefreshToken = this.jwtService.sign(payload, {
                expiresIn: '7d',
                secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
            });
            return {
                accessToken,
                refreshToken: newRefreshToken,
                user: {
                    id: user.id,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role,
                    status: user.status,
                },
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async changePassword(changePasswordDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: changePasswordDto.userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const isPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Current password is incorrect');
        }
        const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
        await this.prisma.user.update({
            where: { id: changePasswordDto.userId },
            data: { password: hashedPassword },
        });
        return { message: 'Password changed successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map