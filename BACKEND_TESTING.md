# 🚀 PHG Corporation Backend API Testing Guide

## 📋 **API Overview**

The comprehensive backend is available at: `/api/backend`

### **Base URL**
```
https://your-domain.vercel.app/api/backend
```

## 🔍 **Available Endpoints**

### 1. **Health Check**
```bash
GET /api/backend/health
GET /api/backend/
```
**Response:**
```json
{
  "status": "ok",
  "message": "PHG Corporation API Backend",
  "timestamp": "2025-06-19T18:30:00.000Z",
  "service": "comprehensive-backend",
  "platform": "vercel-express",
  "database": "connected"
}
```

### 2. **Authentication**

#### Login
```bash
POST /api/backend/auth/login
Content-Type: application/json

{
  "email": "admin@phg.com",
  "password": "your-password"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@phg.com",
    "fullName": "Admin User",
    "role": "ADMIN"
  }
}
```

### 3. **Jobs/Recruitment**

#### Get All Jobs (Public)
```bash
GET /api/backend/recruitment/jobs
```

#### Get Job by ID (Public)
```bash
GET /api/backend/recruitment/jobs/1
```

### 4. **Blogs**

#### Get All Blogs (Public)
```bash
GET /api/backend/blogs
```

### 5. **Contacts**

#### Create Contact (Public)
```bash
POST /api/backend/contacts
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "subject": "Business Inquiry",
  "message": "I would like to know more about your services."
}
```

### 6. **User Profile**

#### Get User Profile (Auth Required)
```bash
GET /api/backend/users/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

### 7. **API Documentation**

#### Get API Documentation
```bash
GET /api/backend/docs
GET /api/backend/swagger
```

## 🧪 **Testing Steps**

### **Step 1: Test Health Check**
```bash
curl https://your-domain.vercel.app/api/backend/health
```

### **Step 2: Test Public Endpoints**
```bash
# Test jobs
curl https://your-domain.vercel.app/api/backend/recruitment/jobs

# Test blogs  
curl https://your-domain.vercel.app/api/backend/blogs

# Test contact creation
curl -X POST https://your-domain.vercel.app/api/backend/contacts \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","message":"Test message"}'
```

### **Step 3: Test Authentication**
```bash
curl -X POST https://your-domain.vercel.app/api/backend/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@phg.com","password":"your-password"}'
```

### **Step 4: Test Protected Endpoints**
```bash
# Get user profile (replace TOKEN with actual JWT)
curl https://your-domain.vercel.app/api/backend/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔧 **Database States**

### **Connected State**
- All endpoints work with real data
- Database operations are performed
- Real authentication and authorization

### **Disconnected State**
- Endpoints return mock/fallback data
- Contact forms are logged but not saved
- Authentication returns mock responses

## 📊 **Error Handling**

### **Common Error Responses**

#### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

#### 401 Unauthorized  
```json
{
  "error": "Authentication required"
}
```

#### 404 Not Found
```json
{
  "error": "Endpoint not found",
  "method": "GET",
  "url": "/api/backend/unknown",
  "availableEndpoints": [...]
}
```

#### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Database connection failed",
  "timestamp": "2025-06-19T18:30:00.000Z"
}
```

## 🎯 **Frontend Integration**

Update your frontend API base URL to:
```javascript
const API_BASE_URL = 'https://your-domain.vercel.app/api/backend';

// Example usage
const response = await fetch(`${API_BASE_URL}/recruitment/jobs`);
const jobs = await response.json();
```

## 🔄 **Migration from NestJS**

To migrate frontend from NestJS backend to this Express backend:

1. **Update API base URL** from `/api` to `/api/backend`
2. **Authentication responses** remain the same format
3. **Error handling** follows REST standards
4. **CORS** is properly configured for your domains

## 🚀 **Next Steps**

1. Test all endpoints in order
2. Update frontend to use `/api/backend` 
3. Test authentication flow
4. Verify database operations
5. Test file uploads (if needed)

This backend provides **full compatibility** with your existing frontend while running efficiently on Vercel serverless! 