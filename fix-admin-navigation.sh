#!/bin/bash

# Fix Admin Navigation Script
# This script debugs and fixes navigation after login

set -e

SERVER_IP="198.38.91.102"
SERVER_USER="root"
APP_DIR="/home/deploy/app"

echo "🔧 Debugging and fixing admin navigation..."

ssh ${SERVER_USER}@${SERVER_IP} << 'EOF'
cd /home/deploy/app

echo "1️⃣ Checking user roles in database..."
sudo -u deploy docker compose -f docker-compose.prod.yml exec app node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.user.findMany().then(users => {
  console.log('=== Users in database ===');
  users.forEach(user => {
    console.log(\`Email: \${user.email}, Role: \${user.role}, Status: \${user.status}\`);
  });
  return prisma.\$disconnect();
}).catch(err => {
  console.log('❌ Database query failed:', err.message);
});
"

echo ""
echo "2️⃣ Testing auth/login endpoint response..."
curl -s -X POST https://phgcorporation.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@phg.com","password":"admin123"}' \
  | jq '.' || echo "Response is not JSON, showing raw:"

echo ""
echo "3️⃣ Checking backend auth route..."
sudo -u deploy docker compose -f docker-compose.prod.yml logs --tail=20 app | grep -E "(auth|login|role)" || echo "No auth-related logs found"

echo ""
echo "4️⃣ Testing if /admin route exists..."
curl -s -I https://phgcorporation.com/admin | head -5

EOF

echo ""
echo "🛠️ Creating AuthContext fix..."

# Create updated AuthContext with better debugging
cat > AuthContext-debug.tsx << 'AUTHEOF'
// Add debug logging to the login function
const login = async (email: string, password: string) => {
  let retryCount = 0;
  const maxRetries = 2;

  const attemptLogin = async (): Promise<void> => {
    try {
      setError(null);
      setLoading(true);

      console.log(`Login attempt ${retryCount + 1}/${maxRetries + 1} for email:`, email);

      const response = await axios.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user: userData } = response.data;

      console.log('=== LOGIN DEBUG ===');
      console.log('Login successful:', { 
        userData: { ...userData, email: userData.email },
        role: userData.role,
        accessToken: accessToken.substring(0, 20) + '...',
        loginTime: response.data.loginTime
      });

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(userData);

      // Enhanced role-based routing with debug
      console.log('User role:', userData.role);
      console.log('Is ADMIN?', userData.role === 'ADMIN');
      console.log('Is HR?', userData.role === 'HR');
      
      if (userData.role === 'ADMIN' || userData.role === 'HR') {
        console.log('Navigating to /admin...');
        setTimeout(() => {
          navigate('/admin', { replace: true });
        }, 100);
      } else {
        console.log('Navigating to / ...');
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 100);
      }

      toast.success('Đăng nhập thành công');
      
      // Force page reload if navigation doesn't work
      setTimeout(() => {
        if (userData.role === 'ADMIN' || userData.role === 'HR') {
          if (window.location.pathname !== '/admin') {
            console.log('Navigation failed, forcing redirect...');
            window.location.href = '/admin';
          }
        }
      }, 1000);
      
    } catch (error: any) {
      // ... rest of error handling
    } finally {
      setLoading(false);
    }
  };

  return attemptLogin();
};
AUTHEOF

echo ""
echo "📋 Manual fix instructions:"
echo ""
echo "1. SSH to server: ssh root@198.38.91.102"
echo "2. Check user roles from database output above"
echo "3. If roles are correct, update AuthContext.tsx with the debug version"
echo "4. Add setTimeout delay and replace: true to navigation"
echo "5. Or add force redirect as fallback"
echo ""
echo "Quick manual fix on server:"
echo "cd /home/deploy/app"
echo "# Edit AuthContext.tsx and add debug + timeout:"
echo "nano src/contexts/AuthContext.tsx"
echo ""
echo "Replace navigation lines (121-127) with:"
echo "setTimeout(() => {"
echo "  if (userData.role === 'ADMIN' || userData.role === 'HR') {"
echo "    navigate('/admin', { replace: true });"
echo "  } else {"
echo "    navigate('/', { replace: true });"
echo "  }"
echo "}, 100);" 