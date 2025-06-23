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
exports.UpdateBlogDto = exports.CreateBlogDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const blog_image_dto_1 = require("./blog-image.dto");
const swagger_1 = require("@nestjs/swagger");
class CreateBlogDto {
}
exports.CreateBlogDto = CreateBlogDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tiêu đề bài viết' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nội dung bài viết' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tóm tắt bài viết' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "excerpt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ảnh đại diện bài viết' }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => blog_image_dto_1.BlogImageDto),
    __metadata("design:type", blog_image_dto_1.BlogImageDto)
], CreateBlogDto.prototype, "featuredImage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Danh mục bài viết' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Các thẻ tag của bài viết', type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateBlogDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Thời gian đọc ước tính', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "readTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Bài viết có được đề xuất không', required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateBlogDto.prototype, "isFeatured", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Trạng thái bài viết', enum: ['draft', 'published'] }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBlogDto.prototype, "status", void 0);
class UpdateBlogDto {
}
exports.UpdateBlogDto = UpdateBlogDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tiêu đề bài viết', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBlogDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nội dung bài viết', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBlogDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tóm tắt bài viết', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBlogDto.prototype, "excerpt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ảnh đại diện bài viết', required: false }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => blog_image_dto_1.BlogImageDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", blog_image_dto_1.BlogImageDto)
], UpdateBlogDto.prototype, "featuredImage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Danh mục bài viết', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBlogDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Các thẻ tag của bài viết', type: [String], required: false }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateBlogDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Thời gian đọc ước tính', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBlogDto.prototype, "readTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Bài viết có được đề xuất không', required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateBlogDto.prototype, "isFeatured", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Trạng thái bài viết', enum: ['draft', 'published'], required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBlogDto.prototype, "status", void 0);
//# sourceMappingURL=blog.dto.js.map