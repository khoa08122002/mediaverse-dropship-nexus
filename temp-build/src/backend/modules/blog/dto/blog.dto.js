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
exports.UpdateBlogDto = exports.CreateBlogDto = exports.BlogImageDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var BlogImageDto = function () {
    var _a;
    var _url_decorators;
    var _url_initializers = [];
    var _url_extraInitializers = [];
    var _alt_decorators;
    var _alt_initializers = [];
    var _alt_extraInitializers = [];
    return _a = /** @class */ (function () {
            function BlogImageDto() {
                this.url = __runInitializers(this, _url_initializers, void 0);
                this.alt = (__runInitializers(this, _url_extraInitializers), __runInitializers(this, _alt_initializers, void 0));
                __runInitializers(this, _alt_extraInitializers);
            }
            return BlogImageDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _url_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _alt_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _url_decorators, { kind: "field", name: "url", static: false, private: false, access: { has: function (obj) { return "url" in obj; }, get: function (obj) { return obj.url; }, set: function (obj, value) { obj.url = value; } }, metadata: _metadata }, _url_initializers, _url_extraInitializers);
            __esDecorate(null, null, _alt_decorators, { kind: "field", name: "alt", static: false, private: false, access: { has: function (obj) { return "alt" in obj; }, get: function (obj) { return obj.alt; }, set: function (obj, value) { obj.alt = value; } }, metadata: _metadata }, _alt_initializers, _alt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.BlogImageDto = BlogImageDto;
var CreateBlogDto = function () {
    var _a;
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _content_decorators;
    var _content_initializers = [];
    var _content_extraInitializers = [];
    var _excerpt_decorators;
    var _excerpt_initializers = [];
    var _excerpt_extraInitializers = [];
    var _featuredImage_decorators;
    var _featuredImage_initializers = [];
    var _featuredImage_extraInitializers = [];
    var _category_decorators;
    var _category_initializers = [];
    var _category_extraInitializers = [];
    var _tags_decorators;
    var _tags_initializers = [];
    var _tags_extraInitializers = [];
    var _readTime_decorators;
    var _readTime_initializers = [];
    var _readTime_extraInitializers = [];
    var _isFeatured_decorators;
    var _isFeatured_initializers = [];
    var _isFeatured_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateBlogDto() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.content = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _content_initializers, void 0));
                this.excerpt = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _excerpt_initializers, void 0));
                this.featuredImage = (__runInitializers(this, _excerpt_extraInitializers), __runInitializers(this, _featuredImage_initializers, void 0));
                this.category = (__runInitializers(this, _featuredImage_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.tags = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
                this.readTime = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _readTime_initializers, void 0));
                this.isFeatured = (__runInitializers(this, _readTime_extraInitializers), __runInitializers(this, _isFeatured_initializers, void 0));
                this.status = (__runInitializers(this, _isFeatured_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                __runInitializers(this, _status_extraInitializers);
            }
            return CreateBlogDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _content_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _excerpt_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _featuredImage_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(function () { return BlogImageDto; })];
            _category_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _tags_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsArray)()];
            _readTime_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _isFeatured_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _status_decorators = [(0, swagger_1.ApiProperty)({ enum: ['draft', 'published'] }), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: function (obj) { return "content" in obj; }, get: function (obj) { return obj.content; }, set: function (obj, value) { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
            __esDecorate(null, null, _excerpt_decorators, { kind: "field", name: "excerpt", static: false, private: false, access: { has: function (obj) { return "excerpt" in obj; }, get: function (obj) { return obj.excerpt; }, set: function (obj, value) { obj.excerpt = value; } }, metadata: _metadata }, _excerpt_initializers, _excerpt_extraInitializers);
            __esDecorate(null, null, _featuredImage_decorators, { kind: "field", name: "featuredImage", static: false, private: false, access: { has: function (obj) { return "featuredImage" in obj; }, get: function (obj) { return obj.featuredImage; }, set: function (obj, value) { obj.featuredImage = value; } }, metadata: _metadata }, _featuredImage_initializers, _featuredImage_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: function (obj) { return "category" in obj; }, get: function (obj) { return obj.category; }, set: function (obj, value) { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: function (obj) { return "tags" in obj; }, get: function (obj) { return obj.tags; }, set: function (obj, value) { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            __esDecorate(null, null, _readTime_decorators, { kind: "field", name: "readTime", static: false, private: false, access: { has: function (obj) { return "readTime" in obj; }, get: function (obj) { return obj.readTime; }, set: function (obj, value) { obj.readTime = value; } }, metadata: _metadata }, _readTime_initializers, _readTime_extraInitializers);
            __esDecorate(null, null, _isFeatured_decorators, { kind: "field", name: "isFeatured", static: false, private: false, access: { has: function (obj) { return "isFeatured" in obj; }, get: function (obj) { return obj.isFeatured; }, set: function (obj, value) { obj.isFeatured = value; } }, metadata: _metadata }, _isFeatured_initializers, _isFeatured_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateBlogDto = CreateBlogDto;
var UpdateBlogDto = function () {
    var _a;
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _content_decorators;
    var _content_initializers = [];
    var _content_extraInitializers = [];
    var _excerpt_decorators;
    var _excerpt_initializers = [];
    var _excerpt_extraInitializers = [];
    var _featuredImage_decorators;
    var _featuredImage_initializers = [];
    var _featuredImage_extraInitializers = [];
    var _category_decorators;
    var _category_initializers = [];
    var _category_extraInitializers = [];
    var _tags_decorators;
    var _tags_initializers = [];
    var _tags_extraInitializers = [];
    var _readTime_decorators;
    var _readTime_initializers = [];
    var _readTime_extraInitializers = [];
    var _isFeatured_decorators;
    var _isFeatured_initializers = [];
    var _isFeatured_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateBlogDto() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.content = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _content_initializers, void 0));
                this.excerpt = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _excerpt_initializers, void 0));
                this.featuredImage = (__runInitializers(this, _excerpt_extraInitializers), __runInitializers(this, _featuredImage_initializers, void 0));
                this.category = (__runInitializers(this, _featuredImage_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.tags = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
                this.readTime = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _readTime_initializers, void 0));
                this.isFeatured = (__runInitializers(this, _readTime_extraInitializers), __runInitializers(this, _isFeatured_initializers, void 0));
                this.status = (__runInitializers(this, _isFeatured_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                __runInitializers(this, _status_extraInitializers);
            }
            return UpdateBlogDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _content_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _excerpt_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _featuredImage_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(function () { return BlogImageDto; })];
            _category_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _tags_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)()];
            _readTime_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _isFeatured_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _status_decorators = [(0, swagger_1.ApiProperty)({ enum: ['draft', 'published'] }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: function (obj) { return "content" in obj; }, get: function (obj) { return obj.content; }, set: function (obj, value) { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
            __esDecorate(null, null, _excerpt_decorators, { kind: "field", name: "excerpt", static: false, private: false, access: { has: function (obj) { return "excerpt" in obj; }, get: function (obj) { return obj.excerpt; }, set: function (obj, value) { obj.excerpt = value; } }, metadata: _metadata }, _excerpt_initializers, _excerpt_extraInitializers);
            __esDecorate(null, null, _featuredImage_decorators, { kind: "field", name: "featuredImage", static: false, private: false, access: { has: function (obj) { return "featuredImage" in obj; }, get: function (obj) { return obj.featuredImage; }, set: function (obj, value) { obj.featuredImage = value; } }, metadata: _metadata }, _featuredImage_initializers, _featuredImage_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: function (obj) { return "category" in obj; }, get: function (obj) { return obj.category; }, set: function (obj, value) { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: function (obj) { return "tags" in obj; }, get: function (obj) { return obj.tags; }, set: function (obj, value) { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            __esDecorate(null, null, _readTime_decorators, { kind: "field", name: "readTime", static: false, private: false, access: { has: function (obj) { return "readTime" in obj; }, get: function (obj) { return obj.readTime; }, set: function (obj, value) { obj.readTime = value; } }, metadata: _metadata }, _readTime_initializers, _readTime_extraInitializers);
            __esDecorate(null, null, _isFeatured_decorators, { kind: "field", name: "isFeatured", static: false, private: false, access: { has: function (obj) { return "isFeatured" in obj; }, get: function (obj) { return obj.isFeatured; }, set: function (obj, value) { obj.isFeatured = value; } }, metadata: _metadata }, _isFeatured_initializers, _isFeatured_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateBlogDto = UpdateBlogDto;
