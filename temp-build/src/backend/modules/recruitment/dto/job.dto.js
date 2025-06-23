"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.UpdateJobDto = exports.CreateJobDto = exports.JobStatusValues = exports.JobTypeValues = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
exports.JobTypeValues = {
    fulltime: 'fulltime',
    parttime: 'parttime',
    contract: 'contract',
    internship: 'internship'
};
exports.JobStatusValues = {
    active: 'active',
    closed: 'closed',
    draft: 'draft'
};
var CreateJobDto = function () {
    var _a;
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _department_decorators;
    var _department_initializers = [];
    var _department_extraInitializers = [];
    var _location_decorators;
    var _location_initializers = [];
    var _location_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _requirements_decorators;
    var _requirements_initializers = [];
    var _requirements_extraInitializers = [];
    var _benefits_decorators;
    var _benefits_initializers = [];
    var _benefits_extraInitializers = [];
    var _salary_decorators;
    var _salary_initializers = [];
    var _salary_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateJobDto() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.department = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _department_initializers, void 0));
                this.location = (__runInitializers(this, _department_extraInitializers), __runInitializers(this, _location_initializers, void 0));
                this.type = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.description = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.requirements = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _requirements_initializers, void 0));
                this.benefits = (__runInitializers(this, _requirements_extraInitializers), __runInitializers(this, _benefits_initializers, void 0));
                this.salary = (__runInitializers(this, _benefits_extraInitializers), __runInitializers(this, _salary_initializers, void 0));
                this.status = (__runInitializers(this, _salary_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                __runInitializers(this, _status_extraInitializers);
            }
            return CreateJobDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _department_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _location_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _type_decorators = [(0, swagger_1.ApiProperty)({ enum: exports.JobTypeValues, description: 'Type of employment', example: exports.JobTypeValues.fulltime }), (0, class_validator_1.IsEnum)(exports.JobTypeValues)];
            _description_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _requirements_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _benefits_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _salary_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _status_decorators = [(0, swagger_1.ApiProperty)({ enum: exports.JobStatusValues, description: 'Job posting status', example: exports.JobStatusValues.active }), (0, class_validator_1.IsEnum)(exports.JobStatusValues)];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _department_decorators, { kind: "field", name: "department", static: false, private: false, access: { has: function (obj) { return "department" in obj; }, get: function (obj) { return obj.department; }, set: function (obj, value) { obj.department = value; } }, metadata: _metadata }, _department_initializers, _department_extraInitializers);
            __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: function (obj) { return "location" in obj; }, get: function (obj) { return obj.location; }, set: function (obj, value) { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _requirements_decorators, { kind: "field", name: "requirements", static: false, private: false, access: { has: function (obj) { return "requirements" in obj; }, get: function (obj) { return obj.requirements; }, set: function (obj, value) { obj.requirements = value; } }, metadata: _metadata }, _requirements_initializers, _requirements_extraInitializers);
            __esDecorate(null, null, _benefits_decorators, { kind: "field", name: "benefits", static: false, private: false, access: { has: function (obj) { return "benefits" in obj; }, get: function (obj) { return obj.benefits; }, set: function (obj, value) { obj.benefits = value; } }, metadata: _metadata }, _benefits_initializers, _benefits_extraInitializers);
            __esDecorate(null, null, _salary_decorators, { kind: "field", name: "salary", static: false, private: false, access: { has: function (obj) { return "salary" in obj; }, get: function (obj) { return obj.salary; }, set: function (obj, value) { obj.salary = value; } }, metadata: _metadata }, _salary_initializers, _salary_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateJobDto = CreateJobDto;
var UpdateJobDto = /** @class */ (function (_super) {
    __extends(UpdateJobDto, _super);
    function UpdateJobDto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UpdateJobDto;
}(CreateJobDto));
exports.UpdateJobDto = UpdateJobDto;
