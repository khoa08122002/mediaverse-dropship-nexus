"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecruitmentController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var roles_guard_1 = require("../auth/guards/roles.guard");
var roles_decorator_1 = require("../auth/decorators/roles.decorator");
var prisma_1 = require("../prisma");
var client_1 = require("@prisma/client");
var public_decorator_1 = require("../auth/decorators/public.decorator");
var RecruitmentController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('recruitment'), (0, common_1.Controller)('recruitment')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getAllJobs_decorators;
    var _getJobById_decorators;
    var _createJob_decorators;
    var _updateJob_decorators;
    var _deleteJob_decorators;
    var _createApplication_decorators;
    var _getAllApplications_decorators;
    var _getJobApplications_decorators;
    var _getStats_decorators;
    var _getApplication_decorators;
    var _updateApplicationStatus_decorators;
    var _downloadCV_decorators;
    var _deleteApplication_decorators;
    var RecruitmentController = _classThis = /** @class */ (function () {
        function RecruitmentController_1(recruitmentService, fileUploadService) {
            this.recruitmentService = (__runInitializers(this, _instanceExtraInitializers), recruitmentService);
            this.fileUploadService = fileUploadService;
        }
        RecruitmentController_1.prototype.getAllJobs = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.recruitmentService.getAllJobs()];
                });
            });
        };
        RecruitmentController_1.prototype.getJobById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.recruitmentService.getJobById(Number(id))];
                });
            });
        };
        RecruitmentController_1.prototype.createJob = function (createJobDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.recruitmentService.createJob(createJobDto)];
                });
            });
        };
        RecruitmentController_1.prototype.updateJob = function (id, updateJobDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.recruitmentService.updateJob(Number(id), updateJobDto)];
                });
            });
        };
        RecruitmentController_1.prototype.deleteJob = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.recruitmentService.deleteJob(Number(id))];
                });
            });
        };
        RecruitmentController_1.prototype.createApplication = function (createApplicationDto, file) {
            return __awaiter(this, void 0, void 0, function () {
                var jobId, cleanedData, emailRegex, phoneRegex, cvFilePath, error_1, result, error_2, error_3, deleteError_1;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _e.trys.push([0, 8, , 13]);
                            console.log('Received application data:', createApplicationDto);
                            console.log('Received file:', file);
                            jobId = typeof createApplicationDto.jobId === 'string'
                                ? parseInt(createApplicationDto.jobId, 10)
                                : createApplicationDto.jobId;
                            if (isNaN(jobId)) {
                                throw new common_1.BadRequestException('ID vị trí ứng tuyển không hợp lệ');
                            }
                            cleanedData = {
                                jobId: jobId,
                                fullName: (_a = createApplicationDto.fullName) === null || _a === void 0 ? void 0 : _a.trim(),
                                email: (_b = createApplicationDto.email) === null || _b === void 0 ? void 0 : _b.trim().toLowerCase(),
                                phone: (_c = createApplicationDto.phone) === null || _c === void 0 ? void 0 : _c.trim(),
                                coverLetter: (_d = createApplicationDto.coverLetter) === null || _d === void 0 ? void 0 : _d.trim(),
                            };
                            // Validate required fields
                            if (!cleanedData.fullName) {
                                throw new common_1.BadRequestException('Vui lòng nhập họ và tên');
                            }
                            if (!cleanedData.email) {
                                throw new common_1.BadRequestException('Vui lòng nhập email');
                            }
                            if (!cleanedData.phone) {
                                throw new common_1.BadRequestException('Vui lòng nhập số điện thoại');
                            }
                            emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            if (!emailRegex.test(cleanedData.email)) {
                                throw new common_1.BadRequestException('Email không hợp lệ');
                            }
                            phoneRegex = /^(\+84|84|0)[35789][0-9]{8}$/;
                            if (!phoneRegex.test(cleanedData.phone)) {
                                throw new common_1.BadRequestException('Số điện thoại không hợp lệ');
                            }
                            cvFilePath = null;
                            if (!file) return [3 /*break*/, 4];
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.fileUploadService.saveCV(file)];
                        case 2:
                            cvFilePath = _e.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _e.sent();
                            console.error('Error saving CV file:', error_1);
                            throw new common_1.InternalServerErrorException('Không thể lưu file CV. Vui lòng thử lại sau.');
                        case 4:
                            _e.trys.push([4, 6, , 7]);
                            return [4 /*yield*/, this.recruitmentService.createApplication(__assign(__assign({}, cleanedData), { cvFile: cvFilePath }))];
                        case 5:
                            result = _e.sent();
                            return [2 /*return*/, result];
                        case 6:
                            error_2 = _e.sent();
                            console.error('Error creating application:', error_2);
                            if (error_2 instanceof common_1.BadRequestException) {
                                throw error_2;
                            }
                            if (error_2 instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                                if (error_2.code === 'P2002') {
                                    throw new common_1.ConflictException('Bạn đã ứng tuyển vị trí này rồi');
                                }
                                throw new common_1.BadRequestException('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
                            }
                            throw new common_1.InternalServerErrorException('Không thể tạo đơn ứng tuyển. Vui lòng thử lại sau.');
                        case 7: return [3 /*break*/, 13];
                        case 8:
                            error_3 = _e.sent();
                            if (!(file && file.path)) return [3 /*break*/, 12];
                            _e.label = 9;
                        case 9:
                            _e.trys.push([9, 11, , 12]);
                            return [4 /*yield*/, this.fileUploadService.deleteFile(file.path)];
                        case 10:
                            _e.sent();
                            return [3 /*break*/, 12];
                        case 11:
                            deleteError_1 = _e.sent();
                            console.error('Error deleting CV file:', deleteError_1);
                            return [3 /*break*/, 12];
                        case 12: throw error_3;
                        case 13: return [2 /*return*/];
                    }
                });
            });
        };
        RecruitmentController_1.prototype.getAllApplications = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.recruitmentService.getAllApplications()];
                });
            });
        };
        RecruitmentController_1.prototype.getJobApplications = function (id, query) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.recruitmentService.getJobApplications(Number(id), query)];
                });
            });
        };
        RecruitmentController_1.prototype.getStats = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.recruitmentService.getStats()];
                });
            });
        };
        RecruitmentController_1.prototype.getApplication = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.recruitmentService.getApplication(Number(id))];
                });
            });
        };
        RecruitmentController_1.prototype.updateApplicationStatus = function (id, updateStatusDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.recruitmentService.updateApplicationStatus(Number(id), updateStatusDto.status)];
                });
            });
        };
        RecruitmentController_1.prototype.downloadCV = function (id, res) {
            return __awaiter(this, void 0, void 0, function () {
                var applicationId, application, filePath;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            applicationId = Number(id);
                            if (isNaN(applicationId)) {
                                throw new common_1.BadRequestException('ID không hợp lệ');
                            }
                            return [4 /*yield*/, this.recruitmentService.getApplication(applicationId)];
                        case 1:
                            application = _a.sent();
                            if (!application.cvFile) {
                                throw new common_1.NotFoundException('CV không tồn tại');
                            }
                            return [4 /*yield*/, this.fileUploadService.getCVPath(application.cvFile)];
                        case 2:
                            filePath = _a.sent();
                            if (!filePath) {
                                throw new common_1.NotFoundException('File CV không tồn tại trên hệ thống');
                            }
                            return [2 /*return*/, res.sendFile(filePath)];
                    }
                });
            });
        };
        RecruitmentController_1.prototype.deleteApplication = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.recruitmentService.deleteApplication(id)];
                });
            });
        };
        return RecruitmentController_1;
    }());
    __setFunctionName(_classThis, "RecruitmentController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getAllJobs_decorators = [(0, public_decorator_1.Public)(), (0, common_1.Get)('jobs'), (0, swagger_1.ApiOperation)({ summary: 'Get all jobs' })];
        _getJobById_decorators = [(0, public_decorator_1.Public)(), (0, common_1.Get)('jobs/:id'), (0, swagger_1.ApiOperation)({ summary: 'Get job by id' })];
        _createJob_decorators = [(0, common_1.Post)('jobs'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)(prisma_1.Role.ADMIN, prisma_1.Role.HR), (0, swagger_1.ApiOperation)({ summary: 'Create a new job' })];
        _updateJob_decorators = [(0, common_1.Put)('jobs/:id'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)(prisma_1.Role.ADMIN, prisma_1.Role.HR), (0, swagger_1.ApiOperation)({ summary: 'Update a job' })];
        _deleteJob_decorators = [(0, common_1.Delete)('jobs/:id'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)(prisma_1.Role.ADMIN, prisma_1.Role.HR), (0, swagger_1.ApiOperation)({ summary: 'Delete a job' })];
        _createApplication_decorators = [(0, public_decorator_1.Public)(), (0, common_1.Post)('applications'), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('cvFile', {
                limits: {
                    fileSize: 5 * 1024 * 1024, // 5MB
                },
                fileFilter: function (req, file, cb) {
                    if (!file) {
                        cb(null, true);
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
                        cb(new common_1.BadRequestException('Chỉ chấp nhận file PDF hoặc Word'), false);
                    }
                }
            })), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiOperation)({ summary: 'Tạo đơn ứng tuyển mới' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Đơn ứng tuyển đã được tạo thành công' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Dữ liệu không hợp lệ' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Không tìm thấy vị trí tuyển dụng' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Bạn đã ứng tuyển vị trí này rồi' }), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    required: ['fullName', 'email', 'phone', 'jobId'],
                    properties: {
                        jobId: {
                            type: 'number',
                            description: 'ID của vị trí ứng tuyển'
                        },
                        fullName: {
                            type: 'string',
                            description: 'Họ và tên người ứng tuyển'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Email liên hệ'
                        },
                        phone: {
                            type: 'string',
                            description: 'Số điện thoại liên hệ'
                        },
                        coverLetter: {
                            type: 'string',
                            description: 'Thư xin việc (không bắt buộc)'
                        },
                        cvFile: {
                            type: 'string',
                            format: 'binary',
                            description: 'File CV (PDF hoặc Word, tối đa 5MB)'
                        }
                    }
                }
            })];
        _getAllApplications_decorators = [(0, common_1.Get)('applications'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)(prisma_1.Role.ADMIN, prisma_1.Role.HR), (0, swagger_1.ApiOperation)({ summary: 'Get all applications' })];
        _getJobApplications_decorators = [(0, common_1.Get)('jobs/:id/applications'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)(prisma_1.Role.ADMIN, prisma_1.Role.HR), (0, swagger_1.ApiOperation)({ summary: 'Get applications for a job' })];
        _getStats_decorators = [(0, common_1.Get)('stats'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)(prisma_1.Role.ADMIN, prisma_1.Role.HR), (0, swagger_1.ApiOperation)({ summary: 'Get recruitment statistics' })];
        _getApplication_decorators = [(0, common_1.Get)('applications/:id'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)(prisma_1.Role.ADMIN, prisma_1.Role.HR), (0, swagger_1.ApiOperation)({ summary: 'Get application by id' })];
        _updateApplicationStatus_decorators = [(0, common_1.Put)('applications/:id/status'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)(prisma_1.Role.ADMIN, prisma_1.Role.HR), (0, swagger_1.ApiOperation)({ summary: 'Update application status' })];
        _downloadCV_decorators = [(0, common_1.Get)('applications/:id/cv'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)(prisma_1.Role.ADMIN, prisma_1.Role.HR), (0, swagger_1.ApiOperation)({ summary: 'Download CV của ứng viên' })];
        _deleteApplication_decorators = [(0, common_1.Delete)('applications/:id'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)(prisma_1.Role.ADMIN, prisma_1.Role.HR), (0, swagger_1.ApiOperation)({ summary: 'Delete application' })];
        __esDecorate(_classThis, null, _getAllJobs_decorators, { kind: "method", name: "getAllJobs", static: false, private: false, access: { has: function (obj) { return "getAllJobs" in obj; }, get: function (obj) { return obj.getAllJobs; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getJobById_decorators, { kind: "method", name: "getJobById", static: false, private: false, access: { has: function (obj) { return "getJobById" in obj; }, get: function (obj) { return obj.getJobById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createJob_decorators, { kind: "method", name: "createJob", static: false, private: false, access: { has: function (obj) { return "createJob" in obj; }, get: function (obj) { return obj.createJob; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateJob_decorators, { kind: "method", name: "updateJob", static: false, private: false, access: { has: function (obj) { return "updateJob" in obj; }, get: function (obj) { return obj.updateJob; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteJob_decorators, { kind: "method", name: "deleteJob", static: false, private: false, access: { has: function (obj) { return "deleteJob" in obj; }, get: function (obj) { return obj.deleteJob; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createApplication_decorators, { kind: "method", name: "createApplication", static: false, private: false, access: { has: function (obj) { return "createApplication" in obj; }, get: function (obj) { return obj.createApplication; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAllApplications_decorators, { kind: "method", name: "getAllApplications", static: false, private: false, access: { has: function (obj) { return "getAllApplications" in obj; }, get: function (obj) { return obj.getAllApplications; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getJobApplications_decorators, { kind: "method", name: "getJobApplications", static: false, private: false, access: { has: function (obj) { return "getJobApplications" in obj; }, get: function (obj) { return obj.getJobApplications; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getStats_decorators, { kind: "method", name: "getStats", static: false, private: false, access: { has: function (obj) { return "getStats" in obj; }, get: function (obj) { return obj.getStats; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getApplication_decorators, { kind: "method", name: "getApplication", static: false, private: false, access: { has: function (obj) { return "getApplication" in obj; }, get: function (obj) { return obj.getApplication; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateApplicationStatus_decorators, { kind: "method", name: "updateApplicationStatus", static: false, private: false, access: { has: function (obj) { return "updateApplicationStatus" in obj; }, get: function (obj) { return obj.updateApplicationStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _downloadCV_decorators, { kind: "method", name: "downloadCV", static: false, private: false, access: { has: function (obj) { return "downloadCV" in obj; }, get: function (obj) { return obj.downloadCV; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteApplication_decorators, { kind: "method", name: "deleteApplication", static: false, private: false, access: { has: function (obj) { return "deleteApplication" in obj; }, get: function (obj) { return obj.deleteApplication; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RecruitmentController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RecruitmentController = _classThis;
}();
exports.RecruitmentController = RecruitmentController;
