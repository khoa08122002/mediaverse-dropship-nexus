# Debug Login Issue - Step by Step Guide

## Vấn đề hiện tại
- Lỗi 500 khi đăng nhập với admin@phg.com
- API endpoint: `POST https://phg2.vercel.app/api/backend/auth/login`

## Các bước khắc phục đã thực hiện

### 1. Sửa lỗi Request Body Parsing
- **Vấn đề**: Vercel không tự động parse request body
- **Giải pháp**: Thêm function `parseBody()` để xử lý JSON từ request stream

### 2. Sửa lỗi Field Name Mismatch
- **Vấn đề**: Prisma schema có field `name` nhưng code dùng `fullName`
- **Giải pháp**: Cập nhật Contact endpoint để support cả hai field

### 3. Thêm Debugging Logs
- Thêm detailed logging cho login process
- Debug database connection status
- Log environment variables

### 4. Tạo Test Database Endpoint
- Endpoint: `/api/test-db`
- Kiểm tra database connection
- Tự động tạo admin user nếu chưa có

## Kiểm tra ngay bây giờ

### Bước 1: Test Database Connection
Truy cập: `https://phg2.vercel.app/api/test-db`

**Kết quả mong đợi:**
```json
{
  "status": "success",
  "message": "Database test completed",
  "data": {
    "connected": true,
    "adminExists": true,
    "adminCreated": false,
    "counts": {
      "users": 1,
      "jobs": 0,
      "blogs": 0,
      "contacts": 0
    },
    "environment": {
      "nodeEnv": "production",
      "hasDbUrl": true,
      "hasJwtSecret": true
    }
  }
}
```

### Bước 2: Kiểm tra Health Check
Truy cập: `https://phg2.vercel.app/api/backend/health`

**Kết quả mong đợi:**
```json
{
  "status": "ok",
  "message": "PHG Corporation API Backend - DATABASE ONLY",
  "database": {
    "status": "connected",
    "hasUrl": true,
    "prismaClient": true
  }
}
```

### Bước 3: Test Login API
**URL**: `https://phg2.vercel.app/api/backend/auth/login`
**Method**: POST
**Body**:
```json
{
  "email": "admin@phg.com",
  "password": "admin123"
}
```

**Kết quả mong đợi:**
```json
{
  "accessToken": "jwt_token_here",
  "refreshToken": "refresh_token_here",
  "user": {
    "id": "user_id",
    "email": "admin@phg.com",
    "fullName": "Admin User",
    "role": "ADMIN"
  }
}
```

## Nếu vẫn còn lỗi

### 1. Kiểm tra Environment Variables trên Vercel
Đảm bảo các biến môi trường sau được thiết lập:
- `DATABASE_URL`: Connection string to PostgreSQL
- `JWT_SECRET`: Secret key for JWT signing
- `NODE_ENV`: production

### 2. Kiểm tra Database Migration
Chạy lệnh:
```bash
npx prisma migrate deploy
```

### 3. Kiểm tra Logs trên Vercel
- Vào Vercel Dashboard > Functions > Logs
- Xem chi tiết lỗi trong real-time logs

### 4. Kiểm tra Prisma Schema
Đảm bảo User model có đúng fields:
```prisma
model User {
  id        String    @id @default(uuid())
  email     String    @unique
  password  String
  fullName  String
  role      Role      @default(USER)
  status    Status    @default(ACTIVE)
  // ... other fields
}
```

## Thông tin Debug mới được thêm

### Login Process Debugging
- `[DEBUG] Login attempt started`
- `[DEBUG] Login data: { email, hasPassword }`
- `[DEBUG] Attempting to find user by email`
- `[DEBUG] User found: true/false`
- `[DEBUG] Comparing password`
- `[DEBUG] Password match: true/false`
- `[DEBUG] Creating JWT token`
- `[DEBUG] Login successful`

### Environment Debugging
- Database connection status
- Environment variables presence
- Request headers logging
- Request body parsing logging

## Liên hệ nếu cần hỗ trợ
Nếu sau khi thực hiện các bước trên vẫn có lỗi, hãy:
1. Chụp screenshot kết quả test từ `/api/test-db`
2. Copy logs chi tiết từ Vercel Dashboard
3. Gửi thông tin để được hỗ trợ thêm 