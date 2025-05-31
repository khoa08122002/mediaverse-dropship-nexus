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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../modules/auth/guards/jwt-auth.guard");
const admin_guard_1 = require("../guards/admin.guard");
const blog_service_1 = require("../modules/blog/blog.service");
const blog_dto_1 = require("../modules/user/dto/blog.dto");
const swagger_1 = require("@nestjs/swagger");
let BlogController = class BlogController {
    constructor(blogService) {
        this.blogService = blogService;
    }
    async getAllBlogs() {
        return this.blogService.findAll();
    }
    async getFeaturedBlog() {
        return this.blogService.findFeatured();
    }
    async searchBlogs(query) {
        return this.blogService.search(query);
    }
    async getPopularTags() {
        return this.blogService.getPopularTags();
    }
    async getBlogsByTag(tag) {
        return this.blogService.findByTag(tag);
    }
    async getBlogsByCategory(category) {
        return this.blogService.findByCategory(category);
    }
    async getBlogById(id) {
        return this.blogService.findById(id);
    }
    async getBlogBySlug(slug) {
        return this.blogService.findBySlug(slug);
    }
    async createBlog(createBlogDto, req) {
        return this.blogService.create(createBlogDto, req.user.id);
    }
    async updateBlog(id, updateBlogDto) {
        return this.blogService.update(id, updateBlogDto);
    }
    async deleteBlog(id) {
        return this.blogService.delete(id);
    }
    async incrementViews(id) {
        return this.blogService.incrementViews(id);
    }
};
exports.BlogController = BlogController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách tất cả bài viết' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Danh sách bài viết' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getAllBlogs", null);
__decorate([
    (0, common_1.Get)('featured'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy bài viết nổi bật' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bài viết nổi bật' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getFeaturedBlog", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Tìm kiếm bài viết' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Danh sách bài viết tìm thấy' }),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "searchBlogs", null);
__decorate([
    (0, common_1.Get)('tags/popular'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách tags phổ biến' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Danh sách tags' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getPopularTags", null);
__decorate([
    (0, common_1.Get)('tags/:tag'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy bài viết theo tag' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Danh sách bài viết' }),
    __param(0, (0, common_1.Param)('tag')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getBlogsByTag", null);
__decorate([
    (0, common_1.Get)('category/:category'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy bài viết theo danh mục' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Danh sách bài viết' }),
    __param(0, (0, common_1.Param)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getBlogsByCategory", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy chi tiết bài viết theo ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Chi tiết bài viết' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Không tìm thấy bài viết' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getBlogById", null);
__decorate([
    (0, common_1.Get)('slug/:slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy chi tiết bài viết theo slug' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Chi tiết bài viết' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Không tìm thấy bài viết' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getBlogBySlug", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo bài viết mới' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Bài viết đã được tạo' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Không có quyền truy cập' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [blog_dto_1.CreateBlogDto, Object]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "createBlog", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật bài viết' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bài viết đã được cập nhật' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Không có quyền truy cập' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Không tìm thấy bài viết' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, blog_dto_1.UpdateBlogDto]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "updateBlog", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa bài viết' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bài viết đã được xóa' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Không có quyền truy cập' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Không tìm thấy bài viết' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "deleteBlog", null);
__decorate([
    (0, common_1.Post)(':id/views'),
    (0, swagger_1.ApiOperation)({ summary: 'Tăng lượt xem bài viết' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Đã tăng lượt xem' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Không tìm thấy bài viết' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "incrementViews", null);
exports.BlogController = BlogController = __decorate([
    (0, swagger_1.ApiTags)('Blogs'),
    (0, common_1.Controller)('blogs'),
    __metadata("design:paramtypes", [blog_service_1.BlogService])
], BlogController);
//# sourceMappingURL=blog.controller.js.map