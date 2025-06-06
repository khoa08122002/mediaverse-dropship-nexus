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
exports.ContactService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ContactService = class ContactService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    mapPrismaContactToContact(prismaContact) {
        return {
            ...prismaContact,
            createdAt: new Date(prismaContact.createdAt),
            updatedAt: new Date(prismaContact.updatedAt)
        };
    }
    async findAll() {
        const contacts = await this.prisma.contact.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        return contacts.map(this.mapPrismaContactToContact);
    }
    async findOne(id) {
        const contact = await this.prisma.contact.findUnique({
            where: { id }
        });
        if (!contact) {
            throw new common_1.NotFoundException(`Contact with ID ${id} not found`);
        }
        return this.mapPrismaContactToContact(contact);
    }
    async create(data) {
        const contact = await this.prisma.contact.create({
            data: {
                ...data,
                status: client_1.ContactStatus.NEW,
                priority: client_1.ContactPriority.MEDIUM
            }
        });
        return this.mapPrismaContactToContact(contact);
    }
    async update(id, data) {
        await this.findOne(id);
        const updateData = {};
        if (data.status !== undefined) {
            const validStatuses = Object.values(client_1.ContactStatus);
            if (!validStatuses.includes(data.status)) {
                throw new Error(`Invalid status value: ${data.status}. Valid values are: ${validStatuses.join(', ')}`);
            }
            updateData.status = data.status;
        }
        if (data.priority !== undefined) {
            const validPriorities = Object.values(client_1.ContactPriority);
            if (!validPriorities.includes(data.priority)) {
                throw new Error(`Invalid priority value: ${data.priority}. Valid values are: ${validPriorities.join(', ')}`);
            }
            updateData.priority = data.priority;
        }
        if (data.name)
            updateData.name = data.name;
        if (data.email)
            updateData.email = data.email;
        if (data.phone)
            updateData.phone = data.phone;
        if (data.company)
            updateData.company = data.company;
        if (data.service)
            updateData.service = data.service;
        if (data.budget)
            updateData.budget = data.budget;
        if (data.subject)
            updateData.subject = data.subject;
        if (data.message)
            updateData.message = data.message;
        const contact = await this.prisma.contact.update({
            where: { id },
            data: updateData,
        });
        return this.mapPrismaContactToContact(contact);
    }
    async remove(id) {
        await this.findOne(id);
        const contact = await this.prisma.contact.delete({
            where: { id }
        });
        return this.mapPrismaContactToContact(contact);
    }
    async reply(id, message) {
        const contact = await this.findOne(id);
        return this.update(id, { status: client_1.ContactStatus.REPLIED });
    }
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContactService);
//# sourceMappingURL=contact.service.js.map