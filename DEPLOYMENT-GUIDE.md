# 🚀 Production Deployment Guide

Hướng dẫn chi tiết để deploy PHG Corporation application lên VPS với Docker, Nginx, và SSL.

## 📋 Yêu cầu VPS

- **OS**: Ubuntu 20.04+ hoặc CentOS 8+
- **RAM**: Tối thiểu 2GB, khuyến nghị 4GB+
- **Storage**: Tối thiểu 20GB SSD
- **Network**: Public IP và domain name
- **Ports**: 22 (SSH), 80 (HTTP), 443 (HTTPS)

## 🎯 Chuẩn bị trước khi deploy

### 1. Domain và DNS Setup
- Đã có domain name (ví dụ: `yourdomain.com`)
- DNS A record trỏ về IP VPS:
  ```
  @ (root)    A    YOUR_VPS_IP
  www         A    YOUR_VPS_IP
  ```

### 2. VPS Access
```bash
# SSH vào VPS
ssh root@YOUR_VPS_IP

# Tạo user non-root (khuyến nghị)
adduser deploy
usermod -aG sudo deploy
su - deploy
```

## 🚀 Deployment Process

### Bước 1: Upload code lên VPS

**Option A: Git Clone (Khuyến nghị)**
```bash
cd /home/deploy
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

**Option B: Upload file**
```bash
# Từ local machine
scp -r /path/to/your/project deploy@YOUR_VPS_IP:/home/deploy/
```

### Bước 2: Cấu hình Environment

```bash
# Copy template và chỉnh sửa
cp env.production.template .env
nano .env
```

**Các giá trị PHẢI thay đổi trong .env:**
```env
# IMPORTANT: Thay đổi tất cả các giá trị sau
DOMAIN=yourdomain.com
CORS_ORIGIN=https://yourdomain.com
POSTGRES_PASSWORD=your_super_strong_password_here
JWT_SECRET=generate_random_64_character_string_here
REDIS_PASSWORD=your_redis_password_here
SSL_EMAIL=your-email@domain.com
```

**Tạo JWT Secret:**
```bash
# Tạo random string 64 ký tự
openssl rand -base64 48
```

### Bước 3: Update Nginx config

```bash
# Cập nhật domain trong nginx config
sed -i 's/your-domain.com/yourdomain.com/g' nginx/nginx.conf
```

### Bước 4: Chạy deployment script

```bash
# Cho phép execute script
chmod +x deploy-vps.sh
chmod +x update-app.sh

# Chạy deployment
./deploy-vps.sh
```

Script sẽ tự động:
- ✅ Cài đặt Docker, Docker Compose
- ✅ Setup SSL certificates với Let's Encrypt  
- ✅ Cấu hình Nginx reverse proxy
- ✅ Build và start containers
- ✅ Chạy database migrations
- ✅ Seed database với sample data
- ✅ Setup firewall và monitoring

## 🔧 Quản lý Production

### Container Management
```bash
# Xem status
docker-compose -f docker-compose.prod.yml ps

# Xem logs
docker-compose -f docker-compose.prod.yml logs -f app
docker-compose -f docker-compose.prod.yml logs -f postgres

# Restart services
docker-compose -f docker-compose.prod.yml restart

# Stop services
docker-compose -f docker-compose.prod.yml down

# Update application
./update-app.sh
```

### Database Management
```bash
# Backup database
./backup-db.sh

# Restore backup
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U $POSTGRES_USER $POSTGRES_DB < backup_file.sql

# Access database shell
docker-compose -f docker-compose.prod.yml exec postgres psql -U phg_user phg_corporation
```

### Monitoring Commands
```bash
# System resources
htop
df -h
free -h

# Docker stats
docker stats

# Nginx status
sudo systemctl status nginx

# SSL certificate status
sudo certbot certificates
```

## 🔒 Security Checklist

- ✅ Strong passwords cho database và Redis
- ✅ JWT secret random và secure
- ✅ SSL certificates configured
- ✅ Firewall enabled (UFW)
- ✅ Non-root user cho deployment
- ✅ Regular security updates
- ✅ Backup strategy implemented

## 📊 Backup Strategy

### Automatic Backups
- Database backup mỗi ngày lúc 2:00 AM
- Giữ backup 7 ngày gần nhất
- Backup được lưu trong `./backups/`

### Manual Backup
```bash
# Database backup
./backup-db.sh

# Full backup (including uploads)
tar -czf full_backup_$(date +%Y%m%d).tar.gz uploads/ backups/ .env

# Upload backup to remote storage (khuyến nghị)
# rsync, scp, hoặc cloud storage
```

## 🚨 Troubleshooting

### Common Issues

**1. Containers không start được:**
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Restart with fresh build
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

**2. SSL certificate issues:**
```bash
# Renew certificates
sudo certbot renew

# Test SSL
curl -I https://yourdomain.com
```

**3. Database connection issues:**
```bash
# Check PostgreSQL logs
docker-compose -f docker-compose.prod.yml logs postgres

# Reset database
docker-compose -f docker-compose.prod.yml down
docker volume rm $(docker volume ls -q | grep postgres)
docker-compose -f docker-compose.prod.yml up -d
```

**4. Out of disk space:**
```bash
# Clean Docker resources
docker system prune -a
docker volume prune

# Clean logs
sudo journalctl --vacuum-time=7d
```

### Health Checks
```bash
# API health
curl https://yourdomain.com/api/health

# Database health
docker-compose -f docker-compose.prod.yml exec postgres pg_isready

# All services
docker-compose -f docker-compose.prod.yml ps
```

## 🔄 Update Process

### Regular Updates
```bash
# Pull latest code
git pull origin main

# Run update script
./update-app.sh
```

### Emergency Rollback
```bash
# Stop current version
docker-compose -f docker-compose.prod.yml down

# Restore from backup
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U $POSTGRES_USER $POSTGRES_DB < backups/backup_file.sql

# Start previous version
git checkout previous_commit
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

## 📞 Support & Maintenance

### Regular Maintenance Tasks
- **Weekly**: Check disk space, update OS packages
- **Monthly**: Review security logs, update dependencies
- **Quarterly**: Security audit, performance review

### Monitoring Setup
```bash
# Setup basic monitoring
sudo apt install htop iotop nethogs

# Optional: Setup advanced monitoring
# - Prometheus + Grafana
# - ELK Stack
# - Uptime monitoring
```

### Contact Information
- **Emergency Contact**: your-email@domain.com
- **Documentation**: README.md, DEPLOYMENT-GUIDE.md
- **Support**: Create issue on GitHub repository

---

## 🎉 Kết luận

Sau khi hoàn thành các bước trên, ứng dụng sẽ chạy tại:
- **Frontend**: https://yourdomain.com
- **API**: https://yourdomain.com/api
- **Health Check**: https://yourdomain.com/api/health

**Login credentials (từ seed data):**
- Admin: `admin@phg.com` / `admin123`
- HR: `hr@phg.com` / `hr123`
- User: `user@phg.com` / `user123`

Chúc bạn deploy thành công! 🚀 