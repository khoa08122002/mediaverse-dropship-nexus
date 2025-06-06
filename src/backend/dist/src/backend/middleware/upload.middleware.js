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
exports.UploadMiddleware = void 0;
const common_1 = require("@nestjs/common");
const multer = require("multer");
const path_1 = require("path");
let UploadMiddleware = class UploadMiddleware {
    constructor() {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, (0, path_1.join)(process.cwd(), 'uploads', 'cv'));
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
                cb(null, `${uniqueSuffix}-${file.originalname}`);
            }
        });
        const fileFilter = (req, file, cb) => {
            if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
                return cb(null, false);
            }
            cb(null, true);
        };
        this.upload = multer({
            storage,
            fileFilter,
            limits: {
                fileSize: 5 * 1024 * 1024
            }
        }).single('file');
    }
    use(req, res, next) {
        this.upload(req, res, (err) => {
            if (err) {
                return res.status(400).json({
                    message: 'File upload error',
                    error: err.message
                });
            }
            next();
        });
    }
};
exports.UploadMiddleware = UploadMiddleware;
exports.UploadMiddleware = UploadMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UploadMiddleware);
//# sourceMappingURL=upload.middleware.js.map