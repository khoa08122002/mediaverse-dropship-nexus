"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecruitmentModule = void 0;
var common_1 = require("@nestjs/common");
var recruitment_controller_1 = require("./recruitment.controller");
var recruitment_service_1 = require("./recruitment.service");
var file_upload_module_1 = require("../file-upload/file-upload.module");
var platform_express_1 = require("@nestjs/platform-express");
var multer_1 = require("multer");
var path_1 = require("path");
var prisma_module_1 = require("../../prisma/prisma.module");
var RecruitmentModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                prisma_module_1.PrismaModule,
                file_upload_module_1.FileUploadModule,
                platform_express_1.MulterModule.register({
                    storage: (0, multer_1.diskStorage)({
                        destination: function (req, file, cb) {
                            cb(null, (0, path_1.join)(process.cwd(), 'uploads', 'cv'));
                        },
                        filename: function (req, file, cb) {
                            var timestamp = Date.now();
                            var randomStr = Math.random().toString(36).substring(7);
                            var ext = (0, path_1.extname)(file.originalname);
                            cb(null, "".concat(timestamp, "-").concat(randomStr).concat(ext));
                        },
                    }),
                    limits: {
                        fileSize: 5 * 1024 * 1024, // 5MB
                    },
                    fileFilter: function (req, file, cb) {
                        if (!file) {
                            cb(null, false);
                            return;
                        }
                        var allowedTypes = [
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
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var RecruitmentModule = _classThis = /** @class */ (function () {
        function RecruitmentModule_1() {
        }
        return RecruitmentModule_1;
    }());
    __setFunctionName(_classThis, "RecruitmentModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RecruitmentModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RecruitmentModule = _classThis;
}();
exports.RecruitmentModule = RecruitmentModule;
