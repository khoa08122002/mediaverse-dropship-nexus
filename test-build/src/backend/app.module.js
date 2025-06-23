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
var AppController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const user_module_1 = require("./modules/user/user.module");
const auth_module_1 = require("./modules/auth/auth.module");
const blog_module_1 = require("./modules/blog/blog.module");
const contact_module_1 = require("./modules/contact/contact.module");
const recruitment_module_1 = require("./modules/recruitment/recruitment.module");
const file_upload_module_1 = require("./modules/file-upload/file-upload.module");
const health_module_1 = require("./modules/health/health.module");
const public_decorator_1 = require("./modules/auth/decorators/public.decorator");
let AppController = AppController_1 = class AppController {
    constructor() {
        this.logger = new common_1.Logger(AppController_1.name);
    }
    health() {
        this.logger.log('Simple health check requested');
        return { status: 'ok' };
    }
    ready() {
        this.logger.log('Readiness check requested');
        return { status: 'ready' };
    }
};
exports.AppController = AppController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "health", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('ready'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "ready", null);
exports.AppController = AppController = AppController_1 = __decorate([
    (0, common_1.Controller)()
], AppController);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                cache: true,
                envFilePath: ['.env', '.env.production'],
                expandVariables: true,
                validate: (config) => {
                    const required = ['JWT_SECRET'];
                    const missing = required.filter(key => !config[key]);
                    if (missing.length > 0) {
                        console.warn(`Missing environment variables: ${missing.join(', ')}`);
                    }
                    return config;
                },
            }),
            prisma_module_1.PrismaModule,
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            blog_module_1.BlogModule,
            contact_module_1.ContactModule,
            recruitment_module_1.RecruitmentModule,
            file_upload_module_1.FileUploadModule,
            health_module_1.HealthModule,
        ],
        controllers: [AppController],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map