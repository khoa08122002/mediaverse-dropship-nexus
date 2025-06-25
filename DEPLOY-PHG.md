# 🚀 PHG Corporation Deployment Guide

## Thông tin đã cấu hình sẵn
- **Domain:** phgcorporation.com
- **SSL Email:** letrandangkhoadl@gmail.com
- **Repository:** https://github.com/khoa08122002/mediaverse-dropship-nexus.git

## ⚡ Quick Deploy (Khuyến nghị)

### Bước 1: Chuẩn bị VPS
- VPS Ubuntu 20.04/22.04 mới
- RAM tối thiểu: 2GB
- Dung lượng: 20GB+
- Truy cập root

### Bước 2: Cấu hình DNS
Trỏ domain `phgcorporation.com` về IP của VPS:
```
A    phgcorporation.com     -> [VPS_IP]
A    www.phgcorporation.com -> [VPS_IP]
```

### Bước 3: Deploy ứng dụng
SSH vào VPS và chạy lệnh:

```bash
curl -sSL https://raw.githubusercontent.com/khoa08122002/mediaverse-dropship-nexus/main/quick-deploy-phg.sh | sudo bash
```

**Hoặc download và chạy:**
```bash
wget https://raw.githubusercontent.com/khoa08122002/mediaverse-dropship-nexus/main/quick-deploy-phg.sh
sudo bash quick-deploy-phg.sh
```

### Thời gian deploy: ~10-15 phút

## 🔧 Các bước chi tiết

Script sẽ tự động:

1. **Setup VPS** - Cài đặt Docker, Nginx, Node.js
2. **Tạo user deploy** - User riêng cho quản lý ứng dụng  
3. **Cấu hình bảo mật** - Firewall, Fail2ban, Swap
4. **Deploy ứng dụng** - Clone code, build, cấu hình
5. **Setup SSL** - Let's Encrypt certificates tự động
6. **Khởi động services** - Database, Redis, API, Frontend

## 📱 Kết quả sau khi deploy

- **Website:** https://phgcorporation.com
- **API Health:** https://phgcorporation.com/api/health
- **Admin Panel:** https://phgcorporation.com/admin

### 🔑 Tài khoản đăng nhập
- **Admin:** admin@phg.com / admin123
- **HR:** hr@phg.com / hr123  
- **User:** user@phg.com / user123

## 🛠️ Quản lý sau deploy

SSH vào server với user `deploy`:
```bash
ssh deploy@[VPS_IP]
cd /home/deploy/app
```

### Các lệnh quản lý:
```bash
# Xem logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart services
docker-compose -f docker-compose.prod.yml restart

# Update ứng dụng
./update-app.sh

# Xem status containers
docker-compose -f docker-compose.prod.yml ps
```

## 🔍 Troubleshooting

### Kiểm tra services
```bash
# Kiểm tra containers
docker ps

# Kiểm tra Nginx
sudo systemctl status nginx

# Kiểm tra SSL certificates
sudo certbot certificates
```

### Logs quan trọng
```bash
# Application logs
docker-compose -f docker-compose.prod.yml logs app

# Database logs  
docker-compose -f docker-compose.prod.yml logs postgres

# Nginx logs
sudo tail -f /var/log/nginx/error.log
```

## 📞 Hỗ trợ

Nếu có vấn đề trong quá trình deploy:

1. Kiểm tra DNS đã trỏ đúng chưa
2. Chắc chắn VPS có đủ RAM (2GB+)
3. Kiểm tra firewall không block port 80, 443
4. Xem logs để debug

---

## 🌟 Các lệnh deploy khác

### Deploy thủ công (nếu cần):
```bash
# Setup VPS trước
curl -sSL https://raw.githubusercontent.com/khoa08122002/mediaverse-dropship-nexus/main/vps-setup.sh | sudo bash

# Sau đó deploy app
git clone https://github.com/khoa08122002/mediaverse-dropship-nexus.git
cd mediaverse-dropship-nexus
./deploy-vps.sh
```

### Update ứng dụng:
```bash
cd /home/deploy/app
./update-app.sh
```

---

**🎉 Chúc mừng! Ứng dụng PHG Corporation đã sẵn sàng tại https://phgcorporation.com** 