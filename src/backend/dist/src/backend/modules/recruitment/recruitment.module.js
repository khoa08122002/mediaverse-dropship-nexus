"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecruitmentModule = void 0;
const common_1 = require("@nestjs/common");
const recruitment_controller_1 = require("./recruitment.controller");
const recruitment_service_1 = require("./recruitment.service");
const file_upload_module_1 = require("../file-upload/file-upload.module");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const prisma_module_1 = require("../../prisma/prisma.module");
let RecruitmentModule = class RecruitmentModule {
};
exports.RecruitmentModule = RecruitmentModule;
exports.RecruitmentModule = RecruitmentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            file_upload_module_1.FileUploadModule,
            platform_express_1.MulterModule.register({
                storage: (0, multer_1.diskStorage)({
                    destination: (req, file, cb) => {
                        cb(null, (0, path_1.join)(process.cwd(), 'uploads', 'cv'));
                    },
                    filename: (req, file, cb) => {
                        const timestamp = Date.now();
                        const randomStr = Math.random().toString(36).substring(7);
                        const ext = (0, path_1.extname)(file.originalname);
                        cb(null, `${timestamp}-${randomStr}${ext}`);
                    },
                }),
                limits: {
                    fileSize: 5 * 1024 * 1024,
                },
                fileFilter: (req, file, cb) => {
                    if (!file) {
                        cb(null, false);
                        return;
                    }
                    const allowedTypes = [
                        'application/pdf',
                        'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    ];
                    if (allowedTypes.includes(file.mimetype)) {
                        cb(null, true);
                    }
                    else {
                        cb(new Error('Chỉ chấp nhận file PDF hoặc Word'), false);
                    }
                },
            }),
        ],
        controllers: [recruitment_controller_1.RecruitmentController],
        providers: [recruitment_service_1.RecruitmentService],
        exports: [recruitment_service_1.RecruitmentService]
    })
], RecruitmentModule);
//# sourceMappingURL=recruitment.module.js.map