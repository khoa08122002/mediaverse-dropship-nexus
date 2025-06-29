# 🚀 Quick VPS Setup Guide cho VPS mới tinh

## 📋 Yêu cầu
- VPS Ubuntu 20.04+ (min 2GB RAM, 20GB storage)
- Domain name đã trỏ DNS về VPS IP
- SSH root access
- Git repository với code đã push

## 🎯 Có 2 cách deployment:

### 🟢 Cách 1: All-in-One Deployment (Đơn giản nhất)
Chỉ 1 lệnh duy nhất để setup hoàn toàn từ VPS mới tinh:

```bash
ssh root@YOUR_VPS_IP
curl -sSL https://raw.githubusercontent.com/khoa08122002/mediaverse-dropship-nexus/main/fresh-vps-deploy.sh | bash
```

**Hoặc manual:**
```bash
wget https://raw.githubusercontent.com/khoa08122002/mediaverse-dropship-nexus/main/fresh-vps-deploy.sh
chmod +x fresh-vps-deploy.sh
sudo bash fresh-vps-deploy.sh
```

Script sẽ hỏi:
- Domain name
- Email cho SSL certificate  
- Git repository URL

Script sẽ tự động:
- ✅ Setup VPS (Git, Docker, Node.js, Nginx)
- ✅ Create user deploy với security
- ✅ Clone code và configure environment
- ✅ Generate SSL certificates
- ✅ Deploy application với database

### 🟡 Cách 2: Step-by-Step (Chi tiết hơn)

## Bước 1: SSH vào VPS mới
```bash
ssh root@YOUR_VPS_IP
```

## Bước 2: Setup VPS Dependencies (Git, Docker, Node.js, Nginx)
```bash
# Download hoặc copy paste nội dung vps-setup.sh
curl -O https://raw.githubusercontent.com/khoa08122002/mediaverse-dropship-nexus/main/vps-setup.sh

# Hoặc manual copy
nano vps-setup.sh
# Paste nội dung từ vps-setup.sh

# Cho phép execute và chạy
chmod +x vps-setup.sh
sudo bash vps-setup.sh
```

**Script này sẽ cài đặt:**
- ✅ Git, Node.js LTS, Docker, Nginx
- ✅ Security tools (UFW firewall, Fail2ban)
- ✅ User deploy với Docker permissions
- ✅ System optimization (swap file)

## Bước 2b: Verify VPS Setup
```bash
# Check installed tools
git --version
node --version
docker --version
nginx -v
```

## Bước 3: Switch sang user deploy
```bash
su - deploy
cd /home/deploy
```

## Bước 4: Upload application code
```bash
# Option A: Git clone (khuyến nghị)
git clone https://github.com/khoa08122002/mediaverse-dropship-nexus.git
cd your-repo

# Option B: SCP từ local machine (chạy từ local)
# scp -r /local/project deploy@VPS_IP:/home/deploy/
```

## Bước 5: Configure environment
```bash
# Copy template và edit
cp env.production.template .env
nano .env

# PHẢI thay đổi:
# - DOMAIN=phgcorporation.com
# - POSTGRES_PASSWORD=strong_password
# - JWT_SECRET=64_character_random_string
# - SSL_EMAIL=your-email@domain.com
```

## Bước 6: Generate JWT Secret
```bash
openssl rand -base64 48
```

## Bước 7: Update nginx config
```bash
sed -i 
'
s/your-domain.com/phgcorporation.com/g
'
 nginx/nginx.conf
```

## Bước 8: Deploy application
```bash
chmod +x deploy-vps.sh
./deploy-vps.sh
```

## Bước 9: Verify deployment
```bash
# Check containers
docker-compose -f docker-compose.prod.yml ps

# Test API
curl https://phgcorporation.com/api/health

# Test website
curl https://phgcorporation.com
```

## Login Credentials
- Admin: admin@phg.com / admin123
- HR: hr@phg.com / hr123
- User: user@phg.com / user123

 Deployment Complete!
