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
exports.FileUploadModule = void 0;
var common_1 = require("@nestjs/common");
var file_upload_service_1 = require("./file-upload.service");
var platform_express_1 = require("@nestjs/platform-express");
var multer_1 = require("multer");
var path_1 = require("path");
var common_2 = require("@nestjs/common");
var FileUploadModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                platform_express_1.MulterModule.register({
                    storage: (0, multer_1.diskStorage)({
                        destination: './uploads',
                        filename: function (req, file, cb) {
                            // Generate unique filename
                            var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                            cb(null, file.fieldname + '-' + uniqueSuffix + (0, path_1.extname)(file.originalname));
                        },
                    }),
                    limits: {
                        fileSize: 5 * 1024 * 1024, // 5MB
                    },
                    fileFilter: function (req, file, cb) {
                        var allowedTypes = [
                            'application/pdf',
                            'application/msword',
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                        ];
                        if (!allowedTypes.includes(file.mimetype)) {
                            return cb(new common_2.BadRequestException('Chỉ chấp nhận file PDF, DOC hoặc DOCX'), false);
                        }
                        cb(null, true);
                    },
                }),
            ],
            providers: [file_upload_service_1.FileUploadService],
            exports: [file_upload_service_1.FileUploadService],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var FileUploadModule = _classThis = /** @class */ (function () {
        function FileUploadModule_1() {
        }
        return FileUploadModule_1;
    }());
    __setFunctionName(_classThis, "FileUploadModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FileUploadModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FileUploadModule = _classThis;
}();
exports.FileUploadModule = FileUploadModule;
