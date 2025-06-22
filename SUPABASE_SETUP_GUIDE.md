# 🚀 Hướng dẫn kết nối Supabase với Mediaverse Dropship Nexus

## Tổng quan

Dự án này hiện đang sử dụng PostgreSQL với Prisma ORM. Để deploy lên Vercel, bạn cần chuyển từ database local (pgAdmin4) sang cloud database (Supabase).

## Bước 1: Tạo dự án Supabase

1. **Truy cập Supabase:**
   - Đi tới [supabase.com](https://supabase.com)
   - Đăng nhập hoặc tạo tài khoản mới

2. **Tạo dự án mới:**
   - Click "New Project" 
   - Chọn Organization (hoặc tạo mới)
   - Điền thông tin dự án:
     - **Name**: `mediaverse-dropship-nexus`
     - **Database Password**: Tạo mật khẩu mạnh (lưu lại!)
     - **Region**: Chọn `Southeast Asia (Singapore)` cho tốc độ tối ưu
   - Click "Create new project"

3. **Chờ khởi tạo:**
   - Quá trình setup mất 1-2 phút
   - Supabase sẽ tạo PostgreSQL database cho bạn

## Bước 2: Lấy Connection String

1. **Truy cập Database Settings:**
   - Vào **Settings** → **Database** 
   - Scroll xuống phần **Connection string**

2. **Copy URI:**
   - Chọn tab **URI** 
   - Copy connection string (dạng: `postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres`)
   - **Lưu ý**: Thay `[YOUR-PASSWORD]` bằng password bạn đã tạo

## Bước 3: Cấu hình Environment Variables

### Cho Development (Local):

```bash
# Chạy script setup
npm run setup:supabase
```

Script sẽ tạo file `.env` với template. Cập nhật các giá trị:

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres"

# JWT Secret (Tạo random string mạnh)
JWT_SECRET="your-super-secret-jwt-key-change-this-to-something-secure"

# Application Configuration  
NODE_ENV="development"
PORT=3000
```

### Cho Production (Vercel):

1. **Truy cập Vercel Dashboard:**
   - Đi tới [vercel.com/dashboard](https://vercel.com/dashboard)
   - Chọn project của bạn

2. **Thêm Environment Variables:**
   - Vào **Settings** → **Environment Variables**
   - Thêm các biến sau:

   | Name | Value |
   |------|--------|
   | `DATABASE_URL` | `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres` |
   | `JWT_SECRET` | `your-secure-jwt-secret-key` |
   | `NODE_ENV` | `production` |

## Bước 4: Migrate Database Schema

1. **Test kết nối:**
   ```bash
   npm run test:supabase
   ```

2. **Deploy schema:**
   ```bash
   npm run prisma:deploy
   ```

3. **Seed dữ liệu (optional):**
   ```bash
   npm run prisma:seed
   ```

## Bước 5: Kiểm tra và Deploy

1. **Validate môi trường:**
   ```bash
   npm run validate:env
   ```

2. **Test database:**
   ```bash
   npm run test:db
   ```

3. **Deploy lên Vercel:**
   - Push code lên Git
   - Vercel sẽ auto deploy
   - Check deployment logs

## Scripts hữu ích

| Script | Mô tả |
|--------|--------|
| `npm run setup:supabase` | Hướng dẫn setup và tạo .env |
| `npm run test:supabase` | Test kết nối Supabase |
| `npm run prisma:studio` | Mở Prisma Studio để xem data |
| `npm run db:push` | Push schema changes (dev only) |
| `npm run db:reset` | Reset database (careful!) |

## Troubleshooting

### ❌ Connection Failed

**Nguyên nhân thường gặp:**
- Password sai hoặc chứa ký tự đặc biệt
- URL format không đúng
- Supabase project chưa active

**Giải pháp:**
1. Check password trong Supabase dashboard
2. Ensure URL format: `postgresql://postgres:password@host:5432/postgres`
3. URL encode special characters in password
4. Add connection pooling: `?pgbouncer=true`

### ⚠️ Migration Issues

**Nếu có lỗi migration:**
```bash
# Reset và migrate lại
npm run db:reset
npm run prisma:deploy
npm run prisma:seed
```

### 🐌 Slow Connections

**Cải thiện tốc độ:**
1. Enable connection pooling: thêm `?pgbouncer=true` vào DATABASE_URL
2. Chọn region gần nhất khi tạo project
3. Sử dụng Supabase edge functions cho production

## Best Practices

### 🔒 Security

1. **Row Level Security (RLS):**
   - Enable RLS trong Supabase dashboard
   - Tạo policies cho từng table

2. **Environment Variables:**
   - Không commit .env vào Git
   - Dùng strong JWT secret
   - Rotate database password định kỳ

### 📊 Monitoring

1. **Supabase Dashboard:**
   - Monitor database usage
   - Check query performance
   - Set up alerts

2. **Prisma Studio:**
   ```bash
   npm run prisma:studio
   ```

### 🚀 Production Optimization

1. **Connection Pooling:**
   ```env
   DATABASE_URL="postgresql://postgres:password@host:5432/postgres?pgbouncer=true"
   ```

2. **Database Indexes:**
   - Review và optimize indexes
   - Monitor slow queries

## Migration từ pgAdmin4

Nếu bạn đã có data trong pgAdmin4:

1. **Export data:**
   ```bash
   pg_dump -h localhost -U postgres -d your_db > backup.sql
   ```

2. **Import vào Supabase:**
   - Dùng Supabase SQL Editor
   - Hoặc psql command line với Supabase URL

3. **Verify data:**
   ```bash
   npm run test:supabase
   npm run prisma:studio
   ```

## Hỗ trợ

- 📚 [Supabase Documentation](https://supabase.com/docs)
- 📚 [Prisma Documentation](https://www.prisma.io/docs)
- 🐛 Nếu gặp issue, check deployment logs trên Vercel
- 💬 Supabase Community Support

---

**🎉 Chúc mừng! Bạn đã hoàn thành việc setup Supabase cho dự án.** 