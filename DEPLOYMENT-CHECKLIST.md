# ✅ VPS Deployment Checklist

Quick checklist để deploy PHG Corporation lên VPS

## 🔧 Pre-deployment (Chuẩn bị)

### Domain & VPS Setup
- [ ] Có domain name (ví dụ: `yourdomain.com`)
- [ ] DNS A record trỏ về VPS IP
- [ ] VPS với Ubuntu 20.04+ (min 2GB RAM, 20GB storage)
- [ ] SSH access vào VPS

### Local Preparation  
- [ ] Code đã commit và push lên Git repository
- [ ] Test local containers chạy OK (`docker-compose up -d`)
- [ ] Có thông tin SSL email

## 🚀 Deployment Steps

### Step 1: VPS Access & User Setup
```bash
ssh root@YOUR_VPS_IP
adduser deploy
usermod -aG sudo deploy  
su - deploy
```
- [ ] SSH vào VPS thành công
- [ ] Tạo non-root user
- [ ] Switch sang deploy user

### Step 2: Upload Code
**Option A: Git Clone**
```bash
cd /home/deploy
git clone YOUR_REPO_URL
cd your-repo-name
```

**Option B: SCP Upload**
```bash
scp -r /local/project deploy@VPS_IP:/home/deploy/
```
- [ ] Code đã upload lên VPS
- [ ] Đã vào thư mục project

### Step 3: Environment Configuration
```bash
cp env.production.template .env
nano .env
```

**Thay đổi MANDATORY trong .env:**
- [ ] `DOMAIN=yourdomain.com`
- [ ] `CORS_ORIGIN=https://yourdomain.com`  
- [ ] `POSTGRES_PASSWORD=strong_password_here`
- [ ] `JWT_SECRET=64_character_random_string`
- [ ] `REDIS_PASSWORD=redis_password_here`
- [ ] `SSL_EMAIL=your-email@domain.com`

**Generate JWT Secret:**
```bash
openssl rand -base64 48
```
- [ ] JWT Secret generated và copied vào .env

### Step 4: Nginx Configuration
```bash
sed -i 's/your-domain.com/yourdomain.com/g' nginx/nginx.conf
```
- [ ] Nginx config updated với domain thật

### Step 5: Run Deployment
```bash
chmod +x deploy-vps.sh
chmod +x update-app.sh
./deploy-vps.sh
```
- [ ] Scripts có permission execute
- [ ] Deployment script chạy thành công
- [ ] Containers đang running

## ✅ Post-deployment Verification

### Health Checks
- [ ] Containers running: `docker-compose -f docker-compose.prod.yml ps`
- [ ] API health: `curl https://yourdomain.com/api/health`
- [ ] Frontend accessible: `https://yourdomain.com`
- [ ] SSL certificate valid: Check browser green lock

### Test Login
- [ ] Admin login: `admin@phg.com` / `admin123`
- [ ] HR login: `hr@phg.com` / `hr123`
- [ ] User login: `user@phg.com` / `user123`

### Backup System
- [ ] Backup script created: `./backup-db.sh`
- [ ] Cron job setup for daily backups
- [ ] Test backup: `./backup-db.sh`

## 🔒 Security Verification

- [ ] Firewall enabled (ports 22, 80, 443)
- [ ] SSL certificate installed và valid
- [ ] Strong passwords sử dụng
- [ ] Non-root deployment user
- [ ] Database không accessible from outside

## 📊 Monitoring Setup

- [ ] Log monitoring: `docker-compose -f docker-compose.prod.yml logs -f`
- [ ] Resource monitoring: `htop`, `df -h`
- [ ] Health endpoint: `https://yourdomain.com/api/health`

## 🚨 Troubleshooting Commands

Nếu có vấn đề:

```bash
# Check container status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs app
docker-compose -f docker-compose.prod.yml logs postgres

# Restart containers
docker-compose -f docker-compose.prod.yml restart

# Full restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d

# Check nginx
sudo systemctl status nginx
sudo nginx -t

# Check SSL
sudo certbot certificates
curl -I https://yourdomain.com
```

## 🔄 Future Updates

Để update application:
```bash
git pull origin main
./update-app.sh
```

## 📞 Emergency Contacts

- [ ] Save VPS IP address
- [ ] Save domain registrar info  
- [ ] Save SSH key location
- [ ] Document admin credentials

---

## ✅ Final Confirmation

**Deployment successful when:**
- [ ] Website accessible at `https://yourdomain.com`
- [ ] API responds at `https://yourdomain.com/api/health`
- [ ] Can login with admin account
- [ ] SSL certificate shows green lock
- [ ] All containers running healthy

**URLs to bookmark:**
- Frontend: `https://yourdomain.com`
- API Health: `https://yourdomain.com/api/health`
- SSH: `deploy@YOUR_VPS_IP`

🎉 **Deployment Complete!** 🎉 