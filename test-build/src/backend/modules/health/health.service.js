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
var HealthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let HealthService = HealthService_1 = class HealthService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(HealthService_1.name);
    }
    async check() {
        try {
            this.logger.log('Starting health check...');
            const appStatus = {
                status: 'ok',
                timestamp: new Date().toISOString(),
                service: 'mediaverse-dropship-nexus-api',
                env: process.env.NODE_ENV || 'development'
            };
            let dbStatus = 'unknown';
            try {
                await this.prisma.$queryRaw `SELECT 1`;
                dbStatus = 'connected';
                this.logger.log('Database health check passed');
            }
            catch (error) {
                dbStatus = 'disconnected';
                this.logger.warn(`Database health check failed: ${error.message}`);
            }
            return {
                ...appStatus,
                checks: {
                    database: dbStatus
                }
            };
        }
        catch (error) {
            this.logger.error(`Health check failed: ${error.message}`);
            return {
                status: 'ok',
                timestamp: new Date().toISOString(),
                service: 'mediaverse-dropship-nexus-api',
                env: process.env.NODE_ENV || 'development',
                checks: {
                    database: 'error'
                }
            };
        }
    }
};
exports.HealthService = HealthService;
exports.HealthService = HealthService = HealthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HealthService);
//# sourceMappingURL=health.service.js.map