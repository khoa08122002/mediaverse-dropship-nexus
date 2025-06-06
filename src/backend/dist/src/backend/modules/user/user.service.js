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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const prisma_1 = require("../prisma");
const bcrypt = require("bcrypt");
let UserService = class UserService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                status: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                password: true,
                fullName: true,
                role: true,
                status: true,
                createdAt: true,
                updatedAt: true
            }
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
                fullName: true,
                role: true,
                status: true
            }
        });
    }
    async create(data) {
        const existingUser = await this.findByEmail(data.email);
        if (existingUser) {
            throw new common_1.ConflictException('Email đã tồn tại');
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return this.prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                fullName: data.fullName,
                role: data.role || prisma_1.Role.USER,
                status: data.status || prisma_1.Status.ACTIVE
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                status: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }
    async update(id, data) {
        const user = await this.findOne(id);
        if (data.email && data.email !== user.email) {
            const existingUser = await this.findByEmail(data.email);
            if (existingUser) {
                throw new common_1.ConflictException('Email đã tồn tại');
            }
        }
        const updateData = {};
        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }
        if (data.email)
            updateData.email = data.email;
        if (data.fullName)
            updateData.fullName = data.fullName;
        if (data.role)
            updateData.role = data.role;
        if (data.status)
            updateData.status = data.status;
        return this.prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                status: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }
    async remove(id) {
        const user = await this.findOne(id);
        return this.prisma.user.delete({ where: { id } });
    }
    async updateLastLogin(id) {
        return this.prisma.user.update({
            where: { id },
            data: {
                lastLogin: new Date()
            }
        });
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                password: true,
                status: true
            }
        });
        if (!user) {
            throw new common_1.NotFoundException('Người dùng không tồn tại');
        }
        if (user.status === prisma_1.Status.INACTIVE) {
            throw new common_1.UnauthorizedException('Tài khoản đã bị vô hiệu hóa');
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('Mật khẩu hiện tại không đúng');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
                updatedAt: new Date()
            }
        });
        return { message: 'Đổi mật khẩu thành công' };
    }
    async search(query) {
        return this.prisma.user.findMany({
            where: {
                OR: [
                    { email: { contains: query, mode: 'insensitive' } },
                    { fullName: { contains: query, mode: 'insensitive' } }
                ]
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                status: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map