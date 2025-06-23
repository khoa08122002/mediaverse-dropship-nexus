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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ContactController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const prisma_1 = require("../prisma");
const contact_service_1 = require("./contact.service");
const swagger_1 = require("@nestjs/swagger");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let ContactController = ContactController_1 = class ContactController {
    constructor(contactService) {
        this.contactService = contactService;
        this.logger = new common_1.Logger(ContactController_1.name);
    }
    async findAll() {
        try {
            this.logger.debug('Finding all contacts');
            return await this.contactService.findAll();
        }
        catch (error) {
            this.logger.error('Error finding all contacts:', error);
            const err = error;
            throw new common_1.HttpException(err.message || 'Internal server error', err.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        try {
            return await this.contactService.findOne(id);
        }
        catch (error) {
            this.logger.error(`Error finding contact with id ${id}:`, error);
            const err = error;
            throw new common_1.HttpException(err.message || 'Internal server error', err.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async create(data) {
        try {
            return await this.contactService.create(data);
        }
        catch (error) {
            this.logger.error('Error creating contact:', error);
            const err = error;
            throw new common_1.HttpException(err.message || 'Internal server error', err.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, data) {
        try {
            return await this.contactService.update(id, data);
        }
        catch (error) {
            this.logger.error(`Error updating contact with id ${id}:`, error);
            const err = error;
            throw new common_1.HttpException(err.message || 'Internal server error', err.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async remove(id) {
        try {
            return await this.contactService.remove(id);
        }
        catch (error) {
            this.logger.error(`Error deleting contact with id ${id}:`, error);
            const err = error;
            throw new common_1.HttpException(err.message || 'Internal server error', err.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async reply(id, message) {
        try {
            return await this.contactService.reply(id, message);
        }
        catch (error) {
            this.logger.error(`Error replying to contact with id ${id}:`, error);
            const err = error;
            throw new common_1.HttpException(err.message || 'Internal server error', err.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ContactController = ContactController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get all contacts' }),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get a contact by id' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "findOne", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new contact' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update a contact' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a contact' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/reply'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(prisma_1.Role.ADMIN, prisma_1.Role.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Reply to a contact' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('message')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "reply", null);
exports.ContactController = ContactController = ContactController_1 = __decorate([
    (0, swagger_1.ApiTags)('contacts'),
    (0, common_1.Controller)('contacts'),
    __metadata("design:paramtypes", [contact_service_1.ContactService])
], ContactController);
//# sourceMappingURL=contact.controller.js.map