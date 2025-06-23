"use strict";
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
exports.BlogController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var roles_guard_1 = require("../auth/guards/roles.guard");
var roles_decorator_1 = require("../auth/decorators/roles.decorator");
var prisma_1 = require("../prisma");
var swagger_1 = require("@nestjs/swagger");
var public_decorator_1 = require("../auth/decorators/public.decorator");
var BlogController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('blogs'), (0, common_1.Controller)('blogs'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _findAll_decorators;
    var _getFeatured_decorators;
    var _findById_decorators;
    var _findBySlug_decorators;
    var _search_decorators;
    var _getPopularTags_decorators;
    var _getByTag_decorators;
    var _getByCategory_decorators;
    var _create_decorators;
    var _update_decorators;
    var _delete_decorators;
    var _incrementViews_decorators;
    var BlogController = _classThis = /** @class */ (function () {
        function BlogController_1(blogService) {
            this.blogService = (__runInitializers(this, _instanceExtraInitializers), blogService);
        }
        BlogController_1.prototype.findAll = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.blogService.findAll()];
                });
            });
        };
        BlogController_1.prototype.getFeatured = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.blogService.getFeatured()];
                });
            });
        };
        BlogController_1.prototype.findById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.blogService.findOne(id)];
                });
            });
        };
        BlogController_1.prototype.findBySlug = function (slug) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.blogService.findBySlug(slug)];
                });
            });
        };
        BlogController_1.prototype.search = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.blogService.search(query)];
                });
            });
        };
        BlogController_1.prototype.getPopularTags = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.blogService.getPopularTags()];
                });
            });
        };
        BlogController_1.prototype.getByTag = function (tag) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.blogService.getByTag(tag)];
                });
            });
        };
        BlogController_1.prototype.getByCategory = function (category) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.blogService.getByCategory(category)];
                });
            });
        };
        BlogController_1.prototype.create = function (createBlogDto, req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.blogService.create(createBlogDto, req.user.id)];
                });
            });
        };
        BlogController_1.prototype.update = function (id, updateBlogDto, req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.blogService.update(id, updateBlogDto, req.user)];
                });
            });
        };
        BlogController_1.prototype.delete = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.blogService.delete(id)];
                });
            });
        };
        BlogController_1.prototype.incrementViews = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.blogService.incrementViews(id)];
                });
            });
        };
        return BlogController_1;
    }());
    __setFunctionName(_classThis, "BlogController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _findAll_decorators = [(0, public_decorator_1.Public)(), (0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'Get all blogs' })];
        _getFeatured_decorators = [(0, public_decorator_1.Public)(), (0, common_1.Get)('featured'), (0, swagger_1.ApiOperation)({ summary: 'Get featured blogs' })];
        _findById_decorators = [(0, public_decorator_1.Public)(), (0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get a blog by id' })];
        _findBySlug_decorators = [(0, public_decorator_1.Public)(), (0, common_1.Get)('slug/:slug')];
        _search_decorators = [(0, public_decorator_1.Public)(), (0, common_1.Get)('search'), (0, swagger_1.ApiOperation)({ summary: 'Search for blogs' })];
        _getPopularTags_decorators = [(0, public_decorator_1.Public)(), (0, common_1.Get)('tags/popular'), (0, swagger_1.ApiOperation)({ summary: 'Get popular tags' })];
        _getByTag_decorators = [(0, public_decorator_1.Public)(), (0, common_1.Get)('tags/:tag'), (0, swagger_1.ApiOperation)({ summary: 'Get blogs by tag' })];
        _getByCategory_decorators = [(0, public_decorator_1.Public)(), (0, common_1.Get)('category/:category'), (0, swagger_1.ApiOperation)({ summary: 'Get blogs by category' })];
        _create_decorators = [(0, common_1.Post)(), (0, roles_decorator_1.Roles)(prisma_1.Role.ADMIN, prisma_1.Role.USER), (0, swagger_1.ApiOperation)({ summary: 'Create a new blog' })];
        _update_decorators = [(0, common_1.Put)(':id'), (0, roles_decorator_1.Roles)(prisma_1.Role.ADMIN, prisma_1.Role.USER), (0, swagger_1.ApiOperation)({ summary: 'Update a blog' })];
        _delete_decorators = [(0, common_1.Delete)(':id'), (0, roles_decorator_1.Roles)(prisma_1.Role.ADMIN, prisma_1.Role.USER), (0, swagger_1.ApiOperation)({ summary: 'Delete a blog' })];
        _incrementViews_decorators = [(0, public_decorator_1.Public)(), (0, common_1.Post)(':id/views'), (0, swagger_1.ApiOperation)({ summary: 'Increment views for a blog' })];
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getFeatured_decorators, { kind: "method", name: "getFeatured", static: false, private: false, access: { has: function (obj) { return "getFeatured" in obj; }, get: function (obj) { return obj.getFeatured; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findById_decorators, { kind: "method", name: "findById", static: false, private: false, access: { has: function (obj) { return "findById" in obj; }, get: function (obj) { return obj.findById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findBySlug_decorators, { kind: "method", name: "findBySlug", static: false, private: false, access: { has: function (obj) { return "findBySlug" in obj; }, get: function (obj) { return obj.findBySlug; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _search_decorators, { kind: "method", name: "search", static: false, private: false, access: { has: function (obj) { return "search" in obj; }, get: function (obj) { return obj.search; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPopularTags_decorators, { kind: "method", name: "getPopularTags", static: false, private: false, access: { has: function (obj) { return "getPopularTags" in obj; }, get: function (obj) { return obj.getPopularTags; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getByTag_decorators, { kind: "method", name: "getByTag", static: false, private: false, access: { has: function (obj) { return "getByTag" in obj; }, get: function (obj) { return obj.getByTag; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getByCategory_decorators, { kind: "method", name: "getByCategory", static: false, private: false, access: { has: function (obj) { return "getByCategory" in obj; }, get: function (obj) { return obj.getByCategory; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: function (obj) { return "update" in obj; }, get: function (obj) { return obj.update; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _delete_decorators, { kind: "method", name: "delete", static: false, private: false, access: { has: function (obj) { return "delete" in obj; }, get: function (obj) { return obj.delete; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _incrementViews_decorators, { kind: "method", name: "incrementViews", static: false, private: false, access: { has: function (obj) { return "incrementViews" in obj; }, get: function (obj) { return obj.incrementViews; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BlogController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BlogController = _classThis;
}();
exports.BlogController = BlogController;
