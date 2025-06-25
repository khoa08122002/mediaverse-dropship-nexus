# Fix Vite Configuration for PHG Corporation

## Problem
Website showing: "Blocked request. This host ("phgcorporation.com") is not allowed"

## Solution
Update `vite.config.ts` to allow the production domain.

## Steps to Fix

### 1. SSH to server
```bash
ssh root@198.38.91.102
cd /home/deploy/app
```

### 2. Edit vite.config.ts
```bash
nano vite.config.ts
```

Find this section:
```typescript
    server: {
      port: 3000,
      proxy: {
```

Replace it with:
```typescript
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: [
        'localhost',
        '127.0.0.1',
        'phgcorporation.com',
        '.phgcorporation.com'
      ],
      proxy: {
```

### 3. Rebuild and restart frontend
```bash
sudo -u deploy docker compose -f docker-compose.prod.yml build frontend
sudo -u deploy docker compose -f docker-compose.prod.yml up -d frontend
```

### 4. Check status
```bash
sudo -u deploy docker compose -f docker-compose.prod.yml ps
```

### 5. Test website
```bash
curl -s https://phgcorporation.com
```

## Expected Result
Website should now be accessible at https://phgcorporation.com without the host blocking error. 