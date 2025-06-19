# Vercel Backend Testing Guide

## Deployment Architecture

Để giải quyết vấn đề backend không hoạt động trên Vercel, chúng ta đã tạo nhiều approaches:

## 🚀 Available Endpoints

### 1. Simple Health Check
```bash
# Test basic functionality
curl https://your-vercel-domain.vercel.app/api/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2025-06-19T...",
  "service": "mediaverse-dropship-nexus-vercel",
  "environment": "production",
  "platform": "vercel-serverless"
}
```

### 2. Test Endpoint
```bash
# Test serverless function
curl https://your-vercel-domain.vercel.app/api/test

# Expected response:
{
  "status": "ok",
  "message": "Vercel serverless function is working",
  "timestamp": "2025-06-19T...",
  "method": "GET",
  "url": "/api/test"
}
```

### 3. Express.js Backend (Alternative)
```bash
# Test Express version
curl https://your-vercel-domain.vercel.app/api/express/health
curl https://your-vercel-domain.vercel.app/api/express/test

# Expected response:
{
  "status": "ok",
  "service": "mediaverse-dropship-nexus-express",
  "platform": "vercel-express"
}
```

### 4. Full NestJS App
```bash
# Test full NestJS application
curl https://your-vercel-domain.vercel.app/api/health

# This should route to the NestJS app if working properly
```

## 🔧 Debugging Steps

### Step 1: Check Basic Function
```bash
curl https://your-domain.vercel.app/api/test
```
✅ If this works → Vercel serverless functions are working

### Step 2: Check Express Alternative
```bash
curl https://your-domain.vercel.app/api/express/health
```
✅ If this works → Express wrapper is working

### Step 3: Check NestJS App
```bash
curl https://your-domain.vercel.app/api/health
```
✅ If this works → Full NestJS app is working

## 📊 Vercel Function Logs

To debug issues:

1. Go to Vercel Dashboard
2. Select your project
3. Go to "Functions" tab
4. Click on any function to see logs
5. Look for error messages or timeouts

## 🔄 Common Issues & Solutions

### Issue 1: Function Timeout
- **Symptom**: 504 Gateway Timeout
- **Solution**: Increase `maxDuration` in `vercel.json`

### Issue 2: Cold Start Problems
- **Symptom**: First request fails, subsequent work
- **Solution**: Use function warming or accept cold starts

### Issue 3: Database Connection Issues
- **Symptom**: 500 errors in NestJS endpoints
- **Solution**: Use connection pooling or stateless approaches

### Issue 4: Memory Issues
- **Symptom**: Out of memory errors
- **Solution**: Increase memory allocation in `vercel.json`

## 🎯 Recommended Approach

1. **Start Simple**: Use `/api/test` and `/api/health` for basic functionality
2. **Express Alternative**: Use `/api/express/*` for more complex logic without NestJS overhead
3. **Full NestJS**: Only use `/api/*` (main app) if you need full NestJS features

## 📝 Current Configuration

```json
// vercel.json
{
  "functions": {
    "api/index.js": { "memory": 1024, "maxDuration": 30 },
    "api/health.js": { "memory": 512, "maxDuration": 10 },
    "api/test.js": { "memory": 512, "maxDuration": 10 },
    "api/express.js": { "memory": 1024, "maxDuration": 30 }
  }
}
```

## 🚨 Next Steps

1. Deploy và test từng endpoint theo thứ tự
2. Check logs trong Vercel dashboard
3. Nếu Express version hoạt động, có thể migrate logic từ NestJS sang Express
4. Hoặc sử dụng hybrid approach: Express cho basic endpoints, NestJS cho complex logic 