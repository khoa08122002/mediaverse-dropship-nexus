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
var PrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let PrismaService = PrismaService_1 = class PrismaService extends client_1.PrismaClient {
    constructor() {
        super({
            log: [
                { emit: 'event', level: 'query' },
                { emit: 'event', level: 'error' },
                { emit: 'event', level: 'info' },
                { emit: 'event', level: 'warn' },
            ],
        });
        this.logger = new common_1.Logger(PrismaService_1.name);
        this.isConnected = false;
        if (process.env.NODE_ENV !== 'production') {
            this.$on('query', (e) => {
                this.logger.debug(`Query: ${e.query}`);
                this.logger.debug(`Params: ${e.params}`);
                this.logger.debug(`Duration: ${e.duration}ms`);
            });
        }
        this.$on('error', (e) => {
            this.logger.error(`Database error: ${e.message}`);
        });
    }
    async onModuleInit() {
        try {
            this.logger.log('Attempting to connect to database...');
            await this.$connect();
            this.isConnected = true;
            this.logger.log('Successfully connected to database');
        }
        catch (error) {
            this.logger.error(`Failed to connect to database: ${error.message}`);
            this.logger.error(error.stack);
            throw error;
        }
    }
    async onModuleDestroy() {
        try {
            if (this.isConnected) {
                this.logger.log('Disconnecting from database...');
                await this.$disconnect();
                this.isConnected = false;
                this.logger.log('Successfully disconnected from database');
            }
        }
        catch (error) {
            this.logger.error(`Error disconnecting from database: ${error.message}`);
            throw error;
        }
    }
    async isHealthy() {
        try {
            await this.$queryRaw `SELECT 1`;
            return true;
        }
        catch (error) {
            this.logger.error(`Health check failed: ${error.message}`);
            return false;
        }
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map