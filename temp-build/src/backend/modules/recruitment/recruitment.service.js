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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecruitmentService = void 0;
var common_1 = require("@nestjs/common");
var job_dto_1 = require("./dto/job.dto");
var client_1 = require("@prisma/client");
var RecruitmentService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var RecruitmentService = _classThis = /** @class */ (function () {
        function RecruitmentService_1(prisma, fileUploadService) {
            this.prisma = prisma;
            this.fileUploadService = fileUploadService;
        }
        RecruitmentService_1.prototype.mapPrismaJobToJob = function (job) {
            return {
                id: job.id,
                title: job.title,
                department: job.department,
                location: job.location,
                type: job.type,
                description: job.description,
                requirements: job.requirements,
                benefits: job.benefits || '',
                salary: job.salary || '',
                status: job.status,
                createdAt: job.createdAt,
                updatedAt: job.updatedAt
            };
        };
        RecruitmentService_1.prototype.transformJobData = function (jobDto) {
            var transformedData = {};
            // Copy basic string fields
            transformedData.title = jobDto.title;
            transformedData.department = jobDto.department;
            transformedData.location = jobDto.location;
            transformedData.description = jobDto.description;
            transformedData.requirements = jobDto.requirements;
            if (jobDto.benefits)
                transformedData.benefits = jobDto.benefits;
            if (jobDto.salary)
                transformedData.salary = jobDto.salary;
            // Handle job type
            if (jobDto.type) {
                console.log('Input job type:', jobDto.type);
                if (!Object.keys(job_dto_1.JobTypeValues).includes(jobDto.type)) {
                    console.error('Invalid job type:', jobDto.type);
                    console.error('Available types:', Object.keys(job_dto_1.JobTypeValues));
                    throw new common_1.BadRequestException("Invalid job type: ".concat(jobDto.type, ". Must be one of: ").concat(Object.keys(job_dto_1.JobTypeValues).join(', ')));
                }
                transformedData.type = jobDto.type.toUpperCase();
            }
            else {
                transformedData.type = 'fulltime'; // Default value
            }
            // Handle job status
            if (jobDto.status) {
                console.log('Input job status:', jobDto.status);
                if (!Object.keys(job_dto_1.JobStatusValues).includes(jobDto.status)) {
                    console.error('Invalid job status:', jobDto.status);
                    console.error('Available statuses:', Object.keys(job_dto_1.JobStatusValues));
                    throw new common_1.BadRequestException("Invalid job status: ".concat(jobDto.status, ". Must be one of: ").concat(Object.keys(job_dto_1.JobStatusValues).join(', ')));
                }
                transformedData.status = jobDto.status.toUpperCase();
            }
            else {
                transformedData.status = 'active'; // Default value
            }
            return transformedData;
        };
        RecruitmentService_1.prototype.getAllJobs = function () {
            return __awaiter(this, void 0, void 0, function () {
                var jobs;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.job.findMany({
                                orderBy: { createdAt: 'desc' }
                            })];
                        case 1:
                            jobs = _a.sent();
                            return [2 /*return*/, jobs.map(function (job) { return _this.mapPrismaJobToJob(job); })];
                    }
                });
            });
        };
        RecruitmentService_1.prototype.getJobById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var job;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.job.findUnique({
                                where: { id: id }
                            })];
                        case 1:
                            job = _a.sent();
                            if (!job) {
                                throw new common_1.NotFoundException("Job with ID ".concat(id, " not found"));
                            }
                            return [2 /*return*/, this.mapPrismaJobToJob(job)];
                    }
                });
            });
        };
        RecruitmentService_1.prototype.validateAndConvertJobType = function (type) {
            var convertedType = job_dto_1.JobTypeValues[type.toLowerCase()];
            if (!convertedType) {
                throw new common_1.BadRequestException("Invalid job type: ".concat(type, ". Must be one of: ").concat(Object.keys(job_dto_1.JobTypeValues).join(', ')));
            }
            return convertedType;
        };
        RecruitmentService_1.prototype.validateAndConvertJobStatus = function (status) {
            var convertedStatus = job_dto_1.JobStatusValues[status.toLowerCase()];
            if (!convertedStatus) {
                throw new common_1.BadRequestException("Invalid job status: ".concat(status, ". Must be one of: ").concat(Object.keys(job_dto_1.JobStatusValues).join(', ')));
            }
            return convertedStatus;
        };
        RecruitmentService_1.prototype.createJob = function (createJobDto) {
            return __awaiter(this, void 0, void 0, function () {
                var jobData, job, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            console.log('Creating job with data:', createJobDto);
                            jobData = {
                                title: createJobDto.title,
                                department: createJobDto.department,
                                location: createJobDto.location,
                                description: createJobDto.description,
                                requirements: createJobDto.requirements,
                                benefits: createJobDto.benefits || '',
                                salary: createJobDto.salary || 'Negotiable',
                                type: createJobDto.type,
                                status: createJobDto.status
                            };
                            console.log('Transformed job data:', jobData);
                            return [4 /*yield*/, this.prisma.job.create({
                                    data: jobData
                                })];
                        case 1:
                            job = _a.sent();
                            console.log('Created job:', job);
                            return [2 /*return*/, this.mapPrismaJobToJob(job)];
                        case 2:
                            error_1 = _a.sent();
                            console.error('Error details:', error_1);
                            if (error_1 instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                                console.error('Prisma error code:', error_1.code);
                                console.error('Prisma error message:', error_1.message);
                                throw new common_1.BadRequestException('Invalid job data. Please check your input.');
                            }
                            throw new common_1.InternalServerErrorException('Could not create job. Please try again.');
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        RecruitmentService_1.prototype.updateJob = function (id, updateJobDto) {
            return __awaiter(this, void 0, void 0, function () {
                var jobData, job, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getJobById(id)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            jobData = __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, (updateJobDto.title && { title: updateJobDto.title })), (updateJobDto.department && { department: updateJobDto.department })), (updateJobDto.location && { location: updateJobDto.location })), (updateJobDto.description && { description: updateJobDto.description })), (updateJobDto.requirements && { requirements: updateJobDto.requirements })), (updateJobDto.benefits !== undefined && { benefits: updateJobDto.benefits })), (updateJobDto.salary !== undefined && { salary: updateJobDto.salary })), (updateJobDto.type && { type: updateJobDto.type.toUpperCase() })), (updateJobDto.status && { status: updateJobDto.status.toUpperCase() }));
                            return [4 /*yield*/, this.prisma.job.update({
                                    where: { id: id },
                                    data: jobData
                                })];
                        case 3:
                            job = _a.sent();
                            return [2 /*return*/, this.mapPrismaJobToJob(job)];
                        case 4:
                            error_2 = _a.sent();
                            if (error_2 instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                                throw new common_1.BadRequestException('Invalid job data. Please check your input.');
                            }
                            throw new common_1.InternalServerErrorException('Could not update job. Please try again.');
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        RecruitmentService_1.prototype.deleteJob = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var job;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getJobById(id)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.prisma.job.delete({
                                    where: { id: id }
                                })];
                        case 2:
                            job = _a.sent();
                            return [2 /*return*/, this.mapPrismaJobToJob(job)];
                    }
                });
            });
        };
        RecruitmentService_1.prototype.getAllApplications = function () {
            return __awaiter(this, void 0, void 0, function () {
                var applications;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.application.findMany({
                                include: {
                                    job: true
                                },
                                orderBy: { createdAt: 'desc' }
                            })];
                        case 1:
                            applications = _a.sent();
                            return [2 /*return*/, applications.map(function (app) { return _this.mapPrismaApplicationToApplication(app); })];
                    }
                });
            });
        };
        RecruitmentService_1.prototype.createApplication = function (createApplicationDto) {
            return __awaiter(this, void 0, void 0, function () {
                var jobId, applicationData, job, cleanedData, application, error_3, error_4;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            jobId = createApplicationDto.jobId, applicationData = __rest(createApplicationDto, ["jobId"]);
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 7, , 8]);
                            console.log('Creating application with data:', createApplicationDto);
                            return [4 /*yield*/, this.getJobById(jobId)];
                        case 2:
                            job = _e.sent();
                            console.log('Found job:', job);
                            cleanedData = {
                                fullName: ((_a = applicationData.fullName) === null || _a === void 0 ? void 0 : _a.trim()) || '',
                                email: ((_b = applicationData.email) === null || _b === void 0 ? void 0 : _b.trim().toLowerCase()) || '',
                                phone: ((_c = applicationData.phone) === null || _c === void 0 ? void 0 : _c.trim()) || '',
                                coverLetter: ((_d = applicationData.coverLetter) === null || _d === void 0 ? void 0 : _d.trim()) || null,
                                cvFile: applicationData.cvFile || null,
                                job: {
                                    connect: {
                                        id: jobId
                                    }
                                },
                                status: 'pending'
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
                            console.log('Cleaned application data:', cleanedData);
                            _e.label = 3;
                        case 3:
                            _e.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, this.prisma.application.create({
                                    data: cleanedData,
                                    include: {
                                        job: true
                                    }
                                })];
                        case 4:
                            application = _e.sent();
                            console.log('Created application:', application);
                            return [2 /*return*/, this.mapPrismaApplicationToApplication(application)];
                        case 5:
                            error_3 = _e.sent();
                            console.error('Error creating application in Prisma:', error_3);
                            if (error_3 instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                                if (error_3.code === 'P2002') {
                                    throw new common_1.ConflictException('Bạn đã ứng tuyển vị trí này rồi');
                                }
                                console.error('Prisma error code:', error_3.code);
                                console.error('Prisma error message:', error_3.message);
                                throw new common_1.BadRequestException('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
                            }
                            if (error_3 instanceof client_1.Prisma.PrismaClientValidationError) {
                                console.error('Prisma validation error:', error_3.message);
                                throw new common_1.BadRequestException('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
                            }
                            throw new common_1.BadRequestException('Không thể tạo đơn ứng tuyển');
                        case 6: return [3 /*break*/, 8];
                        case 7:
                            error_4 = _e.sent();
                            console.error('Error in createApplication:', error_4);
                            if (error_4 instanceof common_1.BadRequestException || error_4 instanceof common_1.ConflictException) {
                                throw error_4;
                            }
                            throw new common_1.BadRequestException('Không thể tạo đơn ứng tuyển');
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        RecruitmentService_1.prototype.getJobApplications = function (jobId, query) {
            return __awaiter(this, void 0, void 0, function () {
                var where, applications;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getJobById(jobId)];
                        case 1:
                            _a.sent();
                            where = __assign({ jobId: jobId }, (query.status && { status: query.status }));
                            return [4 /*yield*/, this.prisma.application.findMany({
                                    where: where,
                                    include: {
                                        job: true
                                    },
                                    orderBy: { createdAt: 'desc' }
                                })];
                        case 2:
                            applications = _a.sent();
                            return [2 /*return*/, applications.map(function (app) { return _this.mapPrismaApplicationToApplication(app); })];
                    }
                });
            });
        };
        RecruitmentService_1.prototype.getApplication = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var application;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.application.findUnique({
                                where: {
                                    id: id
                                },
                                include: {
                                    job: true
                                }
                            })];
                        case 1:
                            application = _a.sent();
                            if (!application) {
                                throw new common_1.NotFoundException("Kh\u00F4ng t\u00ECm th\u1EA5y \u0111\u01A1n \u1EE9ng tuy\u1EC3n v\u1EDBi ID ".concat(id));
                            }
                            return [2 /*return*/, this.mapPrismaApplicationToApplication(application)];
                    }
                });
            });
        };
        RecruitmentService_1.prototype.updateApplicationStatus = function (id, status) {
            return __awaiter(this, void 0, void 0, function () {
                var application;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.application.update({
                                where: { id: id },
                                data: { status: status },
                                include: {
                                    job: true
                                }
                            })];
                        case 1:
                            application = _a.sent();
                            return [2 /*return*/, this.mapPrismaApplicationToApplication(application)];
                    }
                });
            });
        };
        RecruitmentService_1.prototype.getStats = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, totalApplications, applicationsByStatus, _b, totalJobs, activeJobs, statusCounts, error_5;
                var _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 8, , 9]);
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.application.count(),
                                    this.prisma.application.groupBy({
                                        by: ['status'],
                                        _count: true,
                                    }),
                                ])];
                        case 1:
                            _a = _d.sent(), totalApplications = _a[0], applicationsByStatus = _a[1];
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.job.count(),
                                    this.prisma.job.count({
                                        where: { status: 'active' },
                                    }),
                                ])];
                        case 2:
                            _b = _d.sent(), totalJobs = _b[0], activeJobs = _b[1];
                            _c = {};
                            return [4 /*yield*/, this.prisma.application.count({
                                    where: { status: 'pending' }
                                })];
                        case 3:
                            _c.pending = _d.sent();
                            return [4 /*yield*/, this.prisma.application.count({
                                    where: { status: 'reviewed' }
                                })];
                        case 4:
                            _c.reviewed = _d.sent();
                            return [4 /*yield*/, this.prisma.application.count({
                                    where: { status: 'interviewed' }
                                })];
                        case 5:
                            _c.interviewed = _d.sent();
                            return [4 /*yield*/, this.prisma.application.count({
                                    where: { status: 'accepted' }
                                })];
                        case 6:
                            _c.accepted = _d.sent();
                            return [4 /*yield*/, this.prisma.application.count({
                                    where: { status: 'rejected' }
                                })];
                        case 7:
                            statusCounts = (_c.rejected = _d.sent(),
                                _c);
                            return [2 /*return*/, {
                                    totalApplications: totalApplications,
                                    totalJobs: totalJobs,
                                    activeJobs: activeJobs,
                                    statusCounts: statusCounts
                                }];
                        case 8:
                            error_5 = _d.sent();
                            console.error('Error in getStats:', error_5);
                            throw new common_1.InternalServerErrorException('Failed to get recruitment stats');
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
        RecruitmentService_1.prototype.deleteApplication = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var application;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.application.delete({
                                where: { id: id },
                                include: {
                                    job: true
                                }
                            })];
                        case 1:
                            application = _a.sent();
                            return [2 /*return*/, this.mapPrismaApplicationToApplication(application)];
                    }
                });
            });
        };
        RecruitmentService_1.prototype.mapPrismaApplicationToApplication = function (prismaApplication) {
            return {
                id: prismaApplication.id,
                fullName: prismaApplication.fullName,
                email: prismaApplication.email,
                phone: prismaApplication.phone,
                coverLetter: prismaApplication.coverLetter || null,
                cvFile: prismaApplication.cvFile || null,
                status: prismaApplication.status || 'pending',
                createdAt: prismaApplication.createdAt,
                updatedAt: prismaApplication.updatedAt,
                jobId: prismaApplication.jobId,
                job: prismaApplication.job ? this.mapPrismaJobToJob(prismaApplication.job) : undefined
            };
        };
        return RecruitmentService_1;
    }());
    __setFunctionName(_classThis, "RecruitmentService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RecruitmentService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RecruitmentService = _classThis;
}();
exports.RecruitmentService = RecruitmentService;
