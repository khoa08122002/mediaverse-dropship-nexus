# Docker Deployment Guide / Hướng dẫn Deploy với Docker

## 🇻🇳 Tiếng Việt

### Yêu cầu hệ thống
- Docker Engine 20.x+
- Docker Compose 2.x+
- RAM: Tối thiểu 2GB, khuyến nghị 4GB+
- Disk: Tối thiểu 10GB trống

### Cách deploy nhanh

1. **Chuẩn bị môi trường:**
```bash
# Sao chép file cấu hình
cp docker-env.example .env

# Chỉnh sửa cấu hình trong .env
nano .env
```

2. **Chạy script deploy tự động:**
```bash
chmod +x deploy-docker.sh
./deploy-docker.sh
```

3. **Hoặc deploy thủ công:**
```bash
# Build image
docker-compose build

# Chạy migration database
docker-compose run --rm app npx prisma migrate deploy

# Khởi động ứng dụng
docker-compose up -d
```

### Cấu hình quan trọng

Chỉnh sửa file `.env`:

```env
# JWT Secret - PHẢI THAY ĐỔI trong production
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# Domain frontend (để CORS hoạt động)
CORS_ORIGIN=https://yourdomain.com

# Database (PostgreSQL - production ready)
DATABASE_URL=postgresql://phg_user:your-strong-password@postgres:5432/phg_corporation
POSTGRES_DB=phg_corporation
POSTGRES_USER=phg_user
POSTGRES_PASSWORD=your-strong-password
```

### Quản lý ứng dụng

```bash
# Xem logs
docker-compose logs -f

# Dừng ứng dụng
docker-compose down

# Khởi động lại
docker-compose restart

# Cập nhật code mới
docker-compose down
docker-compose build
docker-compose up -d

# Backup PostgreSQL database
docker-compose exec postgres pg_dump -U phg_user phg_corporation > backup-$(date +%Y%m%d).sql
```

### Chuyển từ PostgreSQL về SQLite (không khuyến nghị cho production)

1. **Comment PostgreSQL và uncomment SQLite trong prisma/schema.prisma:**
```prisma
// datasource db {
//   provider = "postgresql"
//   url      = env("DATABASE_URL")
// }

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

2. **Cập nhật .env:**
```env
DATABASE_URL=file:./dev.db
```

3. **Comment PostgreSQL service trong docker-compose.yml và deploy lại:**
```bash
docker-compose down
docker-compose build
docker-compose up -d
```

---

## 🇺🇸 English

### System Requirements
- Docker Engine 20.x+
- Docker Compose 2.x+
- RAM: Minimum 2GB, recommended 4GB+
- Disk: Minimum 10GB free space

### Quick Deployment

1. **Prepare environment:**
```bash
# Copy configuration file
cp docker-env.example .env

# Edit configuration in .env
nano .env
```

2. **Run automatic deployment script:**
```bash
chmod +x deploy-docker.sh
./deploy-docker.sh
```

3. **Or deploy manually:**
```bash
# Build image
docker-compose build

# Run database migrations
docker-compose run --rm app npx prisma migrate deploy

# Start application
docker-compose up -d
```

### Important Configuration

Edit `.env` file:

```env
# JWT Secret - MUST CHANGE in production
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# Frontend domain (for CORS)
CORS_ORIGIN=https://yourdomain.com

# Database (PostgreSQL - production ready)
DATABASE_URL=postgresql://phg_user:your-strong-password@postgres:5432/phg_corporation
POSTGRES_DB=phg_corporation
POSTGRES_USER=phg_user
POSTGRES_PASSWORD=your-strong-password
```

### Application Management

```bash
# View logs
docker-compose logs -f

# Stop application
docker-compose down

# Restart
docker-compose restart

# Update with new code
docker-compose down
docker-compose build
docker-compose up -d

# Backup PostgreSQL database
docker-compose exec postgres pg_dump -U phg_user phg_corporation > backup-$(date +%Y%m%d).sql
```

### Switch from PostgreSQL to SQLite (not recommended for production)

1. **Comment PostgreSQL and uncomment SQLite in prisma/schema.prisma:**
```prisma
// datasource db {
//   provider = "postgresql"
//   url      = env("DATABASE_URL")
// }

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

2. **Update .env:**
```env
DATABASE_URL=file:./dev.db
```

3. **Comment PostgreSQL service in docker-compose.yml and redeploy:**
```bash
docker-compose down
docker-compose build
docker-compose up -d
```

## 🚀 Production Deployment Tips

### Security
- Change default JWT_SECRET
- Use strong database passwords
- Configure proper CORS origins
- Use HTTPS in production
- Regular security updates

### Performance
- Use PostgreSQL for production
- Add Redis for caching
- Configure proper resource limits
- Monitor container health

### Backup Strategy
- Regular database backups
- Volume backups for uploads
- Environment configuration backups

### Monitoring
- Use health checks
- Monitor container logs
- Set up alerting for failures

## 🆘 Troubleshooting

### Common Issues

1. **Port already in use:**
```bash
# Check what's using port 3002
netstat -tulpn | grep 3002
# Kill the process or change port in docker-compose.yml
```

2. **Permission denied:**
```bash
# Fix file permissions
chmod +x deploy-docker.sh
sudo chown -R $USER:$USER .
```

3. **Database connection failed:**
```bash
# Check database status
docker-compose logs postgres
# Reset database
docker-compose down -v
docker-compose up -d
```

4. **Out of disk space:**
```bash
# Clean unused Docker resources
docker system prune -a
```

## 📞 Support

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra logs: `docker-compose logs`
2. Xem health check: `curl http://localhost:3002/api/health`
3. Tạo issue với thông tin chi tiết

If you encounter issues, please:
1. Check logs: `docker-compose logs`
2. Verify health check: `curl http://localhost:3002/api/health`
3. Create an issue with detailed information 