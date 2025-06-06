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
const user_service_1 = require("../user/user.service");
const bcrypt = require("bcrypt");
const prisma_1 = require("../prisma");
let AuthService = class AuthService {
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        console.log('Validating user with email:', email);
        if (!email) {
            throw new common_1.UnauthorizedException('Email is required');
        }
        const user = await this.userService.findByEmail(email);
        console.log('Found user:', user);
        if (!user) {
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không đúng');
        }
        if (user.status === prisma_1.Status.INACTIVE) {
            throw new common_1.UnauthorizedException('Tài khoản đã bị vô hiệu hóa');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không đúng');
        }
        return user;
    }
    async login(user) {
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role,
            status: user.status,
            fullName: user.fullName
        };
        await this.userService.updateLastLogin(user.id);
        const access_token = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET || 'mediaverse-secret-key-2024',
            expiresIn: '15m'
        });
        const refresh_token = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET || 'mediaverse-refresh-secret-2024',
            expiresIn: '7d'
        });
        return {
            access_token,
            refresh_token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                status: user.status
            }
        };
    }
    async refreshToken(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET || 'mediaverse-refresh-secret-2024'
            });
            const user = await this.userService.findOne(payload.sub);
            if (!user) {
                throw new common_1.UnauthorizedException('Người dùng không tồn tại');
            }
            if (user.status !== 'ACTIVE') {
                throw new common_1.UnauthorizedException('Tài khoản đã bị vô hiệu hóa');
            }
            const newPayload = { email: user.email, sub: user.id, role: user.role };
            const access_token = this.jwtService.sign(newPayload, {
                secret: process.env.JWT_SECRET || 'mediaverse-secret-key-2024',
                expiresIn: '15m'
            });
            const refresh_token = this.jwtService.sign(newPayload, {
                secret: process.env.JWT_REFRESH_SECRET || 'mediaverse-refresh-secret-2024',
                expiresIn: '7d'
            });
            return {
                access_token,
                refresh_token,
                user: {
                    id: user.id,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role,
                    status: user.status
                }
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
        }
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.userService.findOne(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('Người dùng không tồn tại');
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Mật khẩu hiện tại không đúng');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.userService.update(userId, { password: hashedPassword });
        return { message: 'Đổi mật khẩu thành công' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map