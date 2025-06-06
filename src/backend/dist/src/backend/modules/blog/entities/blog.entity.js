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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = void 0;
const swagger_1 = require("@nestjs/swagger");
const blog_image_entity_1 = require("./blog-image.entity");
class Blog {
}
exports.Blog = Blog;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID của bài viết' }),
    __metadata("design:type", String)
], Blog.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tiêu đề bài viết' }),
    __metadata("design:type", String)
], Blog.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Slug của bài viết' }),
    __metadata("design:type", String)
], Blog.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nội dung bài viết' }),
    __metadata("design:type", String)
], Blog.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tóm tắt bài viết' }),
    __metadata("design:type", String)
], Blog.prototype, "excerpt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ảnh đại diện bài viết', type: blog_image_entity_1.BlogImage }),
    __metadata("design:type", blog_image_entity_1.BlogImage)
], Blog.prototype, "featuredImage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Danh mục bài viết' }),
    __metadata("design:type", String)
], Blog.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Các thẻ tag của bài viết', type: [String] }),
    __metadata("design:type", Array)
], Blog.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Thời gian đọc ước tính', required: false }),
    __metadata("design:type", String)
], Blog.prototype, "readTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Số lượt xem' }),
    __metadata("design:type", Number)
], Blog.prototype, "views", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Bài viết có được đề xuất không' }),
    __metadata("design:type", Boolean)
], Blog.prototype, "isFeatured", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID của tác giả' }),
    __metadata("design:type", String)
], Blog.prototype, "authorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ngày tạo bài viết' }),
    __metadata("design:type", Date)
], Blog.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ngày cập nhật bài viết' }),
    __metadata("design:type", Date)
], Blog.prototype, "updatedAt", void 0);
//# sourceMappingURL=blog.entity.js.map