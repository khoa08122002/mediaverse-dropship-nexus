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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationDto = exports.ApplicationQueryDto = exports.UpdateApplicationStatusDto = exports.CreateApplicationDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var client_1 = require("@prisma/client");
var class_transformer_1 = require("class-transformer");
var CreateApplicationDto = function () {
    var _a;
    var _fullName_decorators;
    var _fullName_initializers = [];
    var _fullName_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _phone_decorators;
    var _phone_initializers = [];
    var _phone_extraInitializers = [];
    var _coverLetter_decorators;
    var _coverLetter_initializers = [];
    var _coverLetter_extraInitializers = [];
    var _cvFile_decorators;
    var _cvFile_initializers = [];
    var _cvFile_extraInitializers = [];
    var _jobId_decorators;
    var _jobId_initializers = [];
    var _jobId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateApplicationDto() {
                this.fullName = __runInitializers(this, _fullName_initializers, void 0);
                this.email = (__runInitializers(this, _fullName_extraInitializers), __runInitializers(this, _email_initializers, void 0));
                this.phone = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
                this.coverLetter = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _coverLetter_initializers, void 0));
                this.cvFile = (__runInitializers(this, _coverLetter_extraInitializers), __runInitializers(this, _cvFile_initializers, void 0));
                this.jobId = (__runInitializers(this, _cvFile_extraInitializers), __runInitializers(this, _jobId_initializers, void 0));
                __runInitializers(this, _jobId_extraInitializers);
            }
            return CreateApplicationDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _fullName_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _email_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsEmail)(), (0, class_validator_1.IsNotEmpty)()];
            _phone_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _coverLetter_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _cvFile_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _jobId_decorators = [(0, swagger_1.ApiProperty)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _fullName_decorators, { kind: "field", name: "fullName", static: false, private: false, access: { has: function (obj) { return "fullName" in obj; }, get: function (obj) { return obj.fullName; }, set: function (obj, value) { obj.fullName = value; } }, metadata: _metadata }, _fullName_initializers, _fullName_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: function (obj) { return "phone" in obj; }, get: function (obj) { return obj.phone; }, set: function (obj, value) { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
            __esDecorate(null, null, _coverLetter_decorators, { kind: "field", name: "coverLetter", static: false, private: false, access: { has: function (obj) { return "coverLetter" in obj; }, get: function (obj) { return obj.coverLetter; }, set: function (obj, value) { obj.coverLetter = value; } }, metadata: _metadata }, _coverLetter_initializers, _coverLetter_extraInitializers);
            __esDecorate(null, null, _cvFile_decorators, { kind: "field", name: "cvFile", static: false, private: false, access: { has: function (obj) { return "cvFile" in obj; }, get: function (obj) { return obj.cvFile; }, set: function (obj, value) { obj.cvFile = value; } }, metadata: _metadata }, _cvFile_initializers, _cvFile_extraInitializers);
            __esDecorate(null, null, _jobId_decorators, { kind: "field", name: "jobId", static: false, private: false, access: { has: function (obj) { return "jobId" in obj; }, get: function (obj) { return obj.jobId; }, set: function (obj, value) { obj.jobId = value; } }, metadata: _metadata }, _jobId_initializers, _jobId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateApplicationDto = CreateApplicationDto;
var UpdateApplicationStatusDto = function () {
    var _a;
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateApplicationStatusDto() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                __runInitializers(this, _status_extraInitializers);
            }
            return UpdateApplicationStatusDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, swagger_1.ApiProperty)({ enum: client_1.ApplicationStatus }), (0, class_validator_1.IsEnum)(client_1.ApplicationStatus)];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateApplicationStatusDto = UpdateApplicationStatusDto;
var ApplicationQueryDto = function () {
    var _a;
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _search_decorators;
    var _search_initializers = [];
    var _search_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ApplicationQueryDto() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.search = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _search_initializers, void 0));
                __runInitializers(this, _search_extraInitializers);
            }
            return ApplicationQueryDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, swagger_1.ApiProperty)({ required: false, enum: client_1.ApplicationStatus }), (0, class_validator_1.IsEnum)(client_1.ApplicationStatus), (0, class_validator_1.IsOptional)()];
            _search_decorators = [(0, swagger_1.ApiProperty)({ description: 'Search query', required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _search_decorators, { kind: "field", name: "search", static: false, private: false, access: { has: function (obj) { return "search" in obj; }, get: function (obj) { return obj.search; }, set: function (obj, value) { obj.search = value; } }, metadata: _metadata }, _search_initializers, _search_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ApplicationQueryDto = ApplicationQueryDto;
var ApplicationDto = function () {
    var _a;
    var _fullName_decorators;
    var _fullName_initializers = [];
    var _fullName_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _phone_decorators;
    var _phone_initializers = [];
    var _phone_extraInitializers = [];
    var _jobId_decorators;
    var _jobId_initializers = [];
    var _jobId_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ApplicationDto() {
                this.fullName = __runInitializers(this, _fullName_initializers, void 0);
                this.email = (__runInitializers(this, _fullName_extraInitializers), __runInitializers(this, _email_initializers, void 0));
                this.phone = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
                this.jobId = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _jobId_initializers, void 0));
                this.status = (__runInitializers(this, _jobId_extraInitializers), __runInitializers(this, _status_initializers, client_1.ApplicationStatus.pending));
                __runInitializers(this, _status_extraInitializers);
            }
            return ApplicationDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _fullName_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _email_decorators = [(0, class_validator_1.IsEmail)(), (0, class_validator_1.IsNotEmpty)()];
            _phone_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _jobId_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsNotEmpty)()];
            _status_decorators = [(0, class_validator_1.IsEnum)(client_1.ApplicationStatus)];
            __esDecorate(null, null, _fullName_decorators, { kind: "field", name: "fullName", static: false, private: false, access: { has: function (obj) { return "fullName" in obj; }, get: function (obj) { return obj.fullName; }, set: function (obj, value) { obj.fullName = value; } }, metadata: _metadata }, _fullName_initializers, _fullName_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: function (obj) { return "phone" in obj; }, get: function (obj) { return obj.phone; }, set: function (obj, value) { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
            __esDecorate(null, null, _jobId_decorators, { kind: "field", name: "jobId", static: false, private: false, access: { has: function (obj) { return "jobId" in obj; }, get: function (obj) { return obj.jobId; }, set: function (obj, value) { obj.jobId = value; } }, metadata: _metadata }, _jobId_initializers, _jobId_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ApplicationDto = ApplicationDto;
