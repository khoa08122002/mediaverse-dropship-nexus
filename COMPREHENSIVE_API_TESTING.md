# 🚀 PHG Corporation - Comprehensive API Testing Guide

## 📊 API Overview

**New Comprehensive API Endpoint:** `/api/comprehensive`  
**Features:** Complete NestJS backend functionality in Vercel serverless function  
**Database:** Prisma with fallback to mock data  
**Authentication:** JWT with role-based access control  

---

## 🔗 API Endpoints

### Authentication
- `POST /api/comprehensive/auth/login` - Login with JWT
- `POST /api/comprehensive/auth/refresh` - Refresh token 
- `POST /api/comprehensive/auth/change-password` - Change password (auth required)

### Users  
- `GET /api/comprehensive/users/profile` - Get user profile (auth required)
- `POST /api/comprehensive/users/change-password` - User change password (auth required)
- `GET /api/comprehensive/users` - Get all users (admin only)

### Blogs (Public)
- `GET /api/comprehensive/blogs` - Get all published blogs
- `GET /api/comprehensive/blogs/featured` - Get featured blogs
- `GET /api/comprehensive/blogs/:id` - Get blog by ID
- `GET /api/comprehensive/blogs/slug/:slug` - Get blog by slug
- `POST /api/comprehensive/blogs/:id/views` - Increment blog views

### Recruitment
- `GET /api/comprehensive/recruitment/jobs` - Get all active jobs (public)
- `GET /api/comprehensive/recruitment/jobs/:id` - Get job by ID (public)
- `POST /api/comprehensive/recruitment/applications` - Submit application (public)

### Contacts
- `POST /api/comprehensive/contacts` - Create contact (public)
- `GET /api/comprehensive/contacts` - Get all contacts (auth required)

### Health & Status
- `GET /api/comprehensive` - API health check
- `GET /api/comprehensive/health` - Detailed health status

---

## 🧪 Testing Examples

### 1. Health Check
```bash
curl https://phg2.vercel.app/api/comprehensive
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "PHG Corporation API",
  "database": "connected",
  "timestamp": "2024-01-26T20:30:00.000Z"
}
```

### 2. Login Test
```bash
curl -X POST https://phg2.vercel.app/api/comprehensive/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@phg.com","password":"admin123"}'
```

**Expected Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "refresh_1706299800000",
  "user": {
    "id": "1",
    "email": "admin@phg.com",
    "fullName": "Admin User",
    "role": "ADMIN"
  }
}
```

### 3. Get User Profile
```bash
curl https://phg2.vercel.app/api/comprehensive/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Get Blogs
```bash
curl https://phg2.vercel.app/api/comprehensive/blogs
```

### 5. Get Jobs
```bash
curl https://phg2.vercel.app/api/comprehensive/recruitment/jobs
```

### 6. Submit Application
```bash
curl -X POST https://phg2.vercel.app/api/comprehensive/recruitment/applications \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "0123456789",
    "coverLetter": "I am interested in this position..."
  }'
```

### 7. Create Contact
```bash
curl -X POST https://phg2.vercel.app/api/comprehensive/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Jane Smith",
    "email": "jane@example.com",
    "phone": "0987654321",
    "subject": "Business Inquiry",
    "message": "I would like to know more about your services..."
  }'
```

---

## 🔑 Test Credentials

### Mock Authentication Accounts:
- **Admin:** admin@phg.com / admin123
- **HR:** hr@phg.com / hr123  
- **User:** user@phg.com / user123

### Mock Jobs Available:
1. **Senior Frontend Developer** (ID: 1)
   - React, TypeScript, UI/UX
   - Salary: $80k-$120k, Remote

2. **Backend Developer** (ID: 2)  
   - Node.js, APIs, databases
   - Salary: $70k-$110k, Hybrid

---

## 🌐 Frontend Integration

### Update Frontend Service URLs:
Replace your existing API calls with:

```typescript
// Auth Service
const API_BASE = '/api/comprehensive';

// Login
const response = await fetch(`${API_BASE}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

// Get Profile
const profile = await fetch(`${API_BASE}/users/profile`, {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Get Blogs
const blogs = await fetch(`${API_BASE}/blogs`);

// Get Jobs
const jobs = await fetch(`${API_BASE}/recruitment/jobs`);
```

---

## 🔄 Database Behavior

### Connected Mode:
- **Database Available:** Uses real Prisma operations
- **Real Authentication:** Bcrypt password verification
- **Persistent Data:** Database CRUD operations

### Fallback Mode:
- **Database Unavailable:** Uses mock data automatically
- **Mock Authentication:** Plain text password comparison
- **Sample Data:** Predefined users, jobs, blogs, contacts

---

## ✅ Testing Checklist

### Basic Functionality:
- [ ] Health check returns 200 OK
- [ ] Login with mock credentials works
- [ ] Profile endpoint requires authentication
- [ ] Blogs endpoint returns sample data
- [ ] Jobs endpoint returns sample data
- [ ] Application submission works
- [ ] Contact form submission works

### Authentication Flow:
- [ ] Invalid credentials return 401
- [ ] Valid credentials return JWT token
- [ ] Protected endpoints require Bearer token
- [ ] Role-based access control works

### Error Handling:
- [ ] Invalid JSON returns 400
- [ ] Missing required fields return 400
- [ ] Invalid endpoints return 404
- [ ] Server errors return 500

---

## 🚀 Deployment Status

**Current Status:** ✅ Ready for deployment  
**Next Steps:**
1. Commit changes to git
2. Push to trigger Vercel deployment  
3. Test endpoints after deployment
4. Update frontend to use comprehensive API

**Expected Result:** Single API endpoint handling all backend functionality with automatic database fallback!

---

**🎯 This comprehensive API replaces your entire NestJS backend with a single Vercel serverless function!** 