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
exports.BlogService = void 0;
var common_1 = require("@nestjs/common");
var string_1 = require("../../../utils/string");
var BlogService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var BlogService = _classThis = /** @class */ (function () {
        function BlogService_1(prisma) {
            this.prisma = prisma;
        }
        BlogService_1.prototype.parseBlogFeaturedImage = function (blog) {
            if (!blog)
                return null;
            return __assign(__assign({}, blog), { featuredImage: blog.featuredImage ? JSON.parse(blog.featuredImage) : null });
        };
        BlogService_1.prototype.parseBlogsFeaturedImage = function (blogs) {
            var _this = this;
            return blogs.map(function (blog) { return _this.parseBlogFeaturedImage(blog); });
        };
        BlogService_1.prototype.findAll = function () {
            return __awaiter(this, void 0, void 0, function () {
                var blogs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.blog.findMany({
                                include: {
                                    author: {
                                        select: {
                                            id: true,
                                            fullName: true,
                                            email: true
                                        }
                                    }
                                }
                            })];
                        case 1:
                            blogs = _a.sent();
                            return [2 /*return*/, this.parseBlogsFeaturedImage(blogs)];
                    }
                });
            });
        };
        BlogService_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var blog;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.blog.findUnique({
                                where: { id: id },
                                include: {
                                    author: {
                                        select: {
                                            id: true,
                                            fullName: true,
                                            email: true
                                        }
                                    }
                                }
                            })];
                        case 1:
                            blog = _a.sent();
                            if (!blog) {
                                throw new common_1.NotFoundException('Blog not found');
                            }
                            return [2 /*return*/, this.parseBlogFeaturedImage(blog)];
                    }
                });
            });
        };
        BlogService_1.prototype.findBySlug = function (slug) {
            return __awaiter(this, void 0, void 0, function () {
                var blog;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.blog.findUnique({
                                where: { slug: slug },
                                include: {
                                    author: {
                                        select: {
                                            id: true,
                                            fullName: true,
                                            email: true
                                        }
                                    }
                                }
                            })];
                        case 1:
                            blog = _a.sent();
                            if (!blog) {
                                throw new common_1.NotFoundException('Blog not found');
                            }
                            return [2 /*return*/, this.parseBlogFeaturedImage(blog)];
                    }
                });
            });
        };
        BlogService_1.prototype.getFeatured = function () {
            return __awaiter(this, void 0, void 0, function () {
                var blogs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.blog.findMany({
                                where: {
                                    published: true,
                                    isFeatured: true
                                },
                                include: {
                                    author: {
                                        select: {
                                            id: true,
                                            fullName: true,
                                            email: true
                                        }
                                    }
                                }
                            })];
                        case 1:
                            blogs = _a.sent();
                            return [2 /*return*/, this.parseBlogsFeaturedImage(blogs)];
                    }
                });
            });
        };
        BlogService_1.prototype.getByTag = function (tag) {
            return __awaiter(this, void 0, void 0, function () {
                var blogs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.blog.findMany({
                                where: {
                                    tags: { has: tag }
                                },
                                include: {
                                    author: {
                                        select: {
                                            id: true,
                                            fullName: true,
                                            email: true
                                        }
                                    }
                                }
                            })];
                        case 1:
                            blogs = _a.sent();
                            return [2 /*return*/, this.parseBlogsFeaturedImage(blogs)];
                    }
                });
            });
        };
        BlogService_1.prototype.getByCategory = function (category) {
            return __awaiter(this, void 0, void 0, function () {
                var blogs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.blog.findMany({
                                where: { category: category },
                                include: {
                                    author: {
                                        select: {
                                            id: true,
                                            fullName: true,
                                            email: true
                                        }
                                    }
                                }
                            })];
                        case 1:
                            blogs = _a.sent();
                            return [2 /*return*/, this.parseBlogsFeaturedImage(blogs)];
                    }
                });
            });
        };
        BlogService_1.prototype.create = function (createBlogDto, authorId) {
            return __awaiter(this, void 0, void 0, function () {
                var slug, featuredImage, blogData, blog;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            slug = (0, string_1.slugify)(createBlogDto.title);
                            featuredImage = createBlogDto.featuredImage, blogData = __rest(createBlogDto, ["featuredImage"]);
                            return [4 /*yield*/, this.prisma.blog.create({
                                    data: __assign(__assign({}, blogData), { slug: slug, authorId: authorId, published: createBlogDto.status === 'published', featuredImage: featuredImage ? JSON.stringify(featuredImage) : null }),
                                    include: {
                                        author: {
                                            select: {
                                                id: true,
                                                fullName: true,
                                                email: true
                                            }
                                        }
                                    }
                                })];
                        case 1:
                            blog = _a.sent();
                            return [2 /*return*/, this.parseBlogFeaturedImage(blog)];
                    }
                });
            });
        };
        BlogService_1.prototype.update = function (id, updateBlogDto, user) {
            return __awaiter(this, void 0, void 0, function () {
                var blog, isFeatured, otherFields, slug, featuredImage, blogData, allowedFields, data, updatedBlog;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            blog = _a.sent();
                            // Kiểm tra quyền: chỉ ADMIN hoặc tác giả mới được cập nhật toàn bộ bài viết
                            if (user.role !== 'ADMIN' && blog.authorId !== user.id) {
                                isFeatured = updateBlogDto.isFeatured, otherFields = __rest(updateBlogDto, ["isFeatured"]);
                                if (Object.keys(otherFields).length > 0) {
                                    throw new common_1.ForbiddenException('Bạn không có quyền cập nhật các trường khác của bài viết này');
                                }
                            }
                            slug = blog.slug;
                            if (updateBlogDto.title) {
                                slug = (0, string_1.slugify)(updateBlogDto.title);
                            }
                            featuredImage = updateBlogDto.featuredImage, blogData = __rest(updateBlogDto, ["featuredImage"]);
                            allowedFields = __assign({ title: blogData.title, content: blogData.content, excerpt: blogData.excerpt, category: blogData.category, tags: blogData.tags, readTime: blogData.readTime, isFeatured: blogData.isFeatured, status: blogData.status, slug: slug, published: blogData.status === 'published' }, (featuredImage !== undefined && {
                                featuredImage: featuredImage ? JSON.stringify(featuredImage) : null
                            }));
                            data = Object.entries(allowedFields)
                                .filter(function (_a) {
                                var _ = _a[0], value = _a[1];
                                return value !== undefined;
                            })
                                .reduce(function (acc, _a) {
                                var _b;
                                var key = _a[0], value = _a[1];
                                return (__assign(__assign({}, acc), (_b = {}, _b[key] = value, _b)));
                            }, {});
                            return [4 /*yield*/, this.prisma.blog.update({
                                    where: { id: id },
                                    data: data,
                                    include: {
                                        author: {
                                            select: {
                                                id: true,
                                                fullName: true,
                                                email: true
                                            }
                                        }
                                    }
                                })];
                        case 2:
                            updatedBlog = _a.sent();
                            return [2 /*return*/, this.parseBlogFeaturedImage(updatedBlog)];
                    }
                });
            });
        };
        BlogService_1.prototype.delete = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, this.prisma.blog.delete({
                                    where: { id: id },
                                })];
                    }
                });
            });
        };
        BlogService_1.prototype.search = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var blogs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.blog.findMany({
                                where: {
                                    OR: [
                                        { title: { contains: query, mode: 'insensitive' } },
                                        { content: { contains: query, mode: 'insensitive' } },
                                        { tags: { has: query } }
                                    ]
                                },
                                include: {
                                    author: {
                                        select: {
                                            id: true,
                                            fullName: true,
                                            email: true
                                        }
                                    }
                                }
                            })];
                        case 1:
                            blogs = _a.sent();
                            return [2 /*return*/, this.parseBlogsFeaturedImage(blogs)];
                    }
                });
            });
        };
        BlogService_1.prototype.getPopularTags = function () {
            return __awaiter(this, void 0, void 0, function () {
                var blogs, tagCounts;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.blog.findMany({
                                select: {
                                    tags: true
                                }
                            })];
                        case 1:
                            blogs = _a.sent();
                            tagCounts = new Map();
                            blogs.forEach(function (blog) {
                                blog.tags.forEach(function (tag) {
                                    tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
                                });
                            });
                            return [2 /*return*/, Array.from(tagCounts.entries())
                                    .map(function (_a) {
                                    var tag = _a[0], count = _a[1];
                                    return ({ tag: tag, count: count });
                                })
                                    .sort(function (a, b) { return b.count - a.count; })
                                    .slice(0, 10)];
                    }
                });
            });
        };
        BlogService_1.prototype.incrementViews = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.blog.update({
                            where: { id: id },
                            data: {
                                views: { increment: 1 }
                            }
                        })];
                });
            });
        };
        BlogService_1.prototype.getFeaturedBlogs = function () {
            return __awaiter(this, void 0, void 0, function () {
                var blogs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.blog.findMany({
                                where: {
                                    published: true,
                                    isFeatured: true
                                },
                                orderBy: { createdAt: 'desc' },
                                take: 3,
                            })];
                        case 1:
                            blogs = _a.sent();
                            return [2 /*return*/, this.parseBlogsFeaturedImage(blogs)];
                    }
                });
            });
        };
        BlogService_1.prototype.findByTag = function (tag) {
            return __awaiter(this, void 0, void 0, function () {
                var blogs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.blog.findMany({
                                where: {
                                    tags: { has: tag }
                                }
                            })];
                        case 1:
                            blogs = _a.sent();
                            return [2 /*return*/, this.parseBlogsFeaturedImage(blogs)];
                    }
                });
            });
        };
        BlogService_1.prototype.findByCategory = function (category) {
            return __awaiter(this, void 0, void 0, function () {
                var blogs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.blog.findMany({
                                where: { category: category }
                            })];
                        case 1:
                            blogs = _a.sent();
                            return [2 /*return*/, this.parseBlogsFeaturedImage(blogs)];
                    }
                });
            });
        };
        return BlogService_1;
    }());
    __setFunctionName(_classThis, "BlogService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BlogService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BlogService = _classThis;
}();
exports.BlogService = BlogService;
