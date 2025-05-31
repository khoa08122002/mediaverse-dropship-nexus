"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminGuard = void 0;
const common_1 = require("@nestjs/common");
const types_1 = require("../prisma/types");
let AdminGuard = class AdminGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        console.log('AdminGuard - User:', user);
        if (!user) {
            console.log('AdminGuard - No user found in request');
            throw new common_1.UnauthorizedException('User not found in request');
        }
        if (!user.role) {
            console.log('AdminGuard - No role found for user');
            throw new common_1.UnauthorizedException('No role found for user');
        }
        const hasAdminRole = user.role === types_1.Role.ADMIN;
        console.log('AdminGuard - Is Admin:', hasAdminRole, 'Role:', user.role);
        if (!hasAdminRole) {
            throw new common_1.UnauthorizedException('Requires admin role');
        }
        return true;
    }
};
exports.AdminGuard = AdminGuard;
exports.AdminGuard = AdminGuard = __decorate([
    (0, common_1.Injectable)()
], AdminGuard);
//# sourceMappingURL=admin.guard.js.map