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
exports.FileUploadService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
let FileUploadService = class FileUploadService {
    constructor() {
        this.uploadDir = (0, path_1.join)(__dirname, '..', '..', 'uploads', 'cv');
        this.ensureUploadDir();
    }
    async ensureUploadDir() {
        try {
            await fs_1.promises.access(this.uploadDir);
        }
        catch {
            await fs_1.promises.mkdir(this.uploadDir, { recursive: true });
        }
    }
    async saveCV(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Only PDF, DOC, and DOCX files are allowed');
        }
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new common_1.BadRequestException('File size must be less than 5MB');
        }
        const timestamp = Date.now();
        const ext = file.originalname.split('.').pop();
        const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.${ext}`;
        const filepath = (0, path_1.join)(this.uploadDir, filename);
        try {
            await fs_1.promises.writeFile(filepath, file.buffer);
            return filename;
        }
        catch (error) {
            console.error('Error saving file:', error);
            throw new common_1.BadRequestException('Could not save file');
        }
    }
    async deleteCV(filename) {
        if (!filename)
            return;
        const filepath = (0, path_1.join)(this.uploadDir, filename);
        try {
            await fs_1.promises.unlink(filepath);
        }
        catch (error) {
            console.error('Error deleting file:', error);
        }
    }
    getCVPath(filename) {
        if (!filename)
            return null;
        const filepath = (0, path_1.join)(this.uploadDir, filename);
        try {
            fs_1.promises.access(filepath);
            return filepath;
        }
        catch (error) {
            console.error('Error accessing file:', error);
            return null;
        }
    }
    async fileExists(filename) {
        try {
            await fs_1.promises.access((0, path_1.join)(this.uploadDir, filename));
            return true;
        }
        catch {
            return false;
        }
    }
    async deleteFile(filepath) {
        try {
            await fs_1.promises.unlink(filepath);
        }
        catch (error) {
            console.error('Error deleting file:', error);
            throw error;
        }
    }
};
exports.FileUploadService = FileUploadService;
exports.FileUploadService = FileUploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FileUploadService);
//# sourceMappingURL=file-upload.service.js.map