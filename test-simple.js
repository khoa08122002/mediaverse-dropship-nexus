#!/usr/bin/env node

// Simple test script without external dependencies
const http = require('http');
const https = require('https');

const API_BASE = 'http://localhost:3002';

const TEST_USER = {
  email: 'test@phg.com',
  password: 'admin123'
};

let authToken = null;

// Simple request function
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Test authentication
async function testAuth() {
  console.log('\n🔐 TESTING AUTHENTICATION...');
  
  try {
    const options = {
      hostname: 'localhost',
      port: 3002,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const result = await makeRequest(options, TEST_USER);
    
    if (result.status === 200 && result.data.accessToken) {
      authToken = result.data.accessToken;
      console.log('✅ Login successful!');
      console.log('📧 Email:', TEST_USER.email);
      console.log('🔑 Token received:', authToken.substring(0, 50) + '...');
      return true;
    } else {
      console.log('❌ Login failed:', result.data.message || 'Unknown error');
      return false;
    }
  } catch (error) {
    console.log('❌ Login error:', error.message);
    return false;
  }
}

// Test endpoints
async function testEndpoint(name, path, requiresAuth = false) {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (requiresAuth && authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const options = {
      hostname: 'localhost',
      port: 3002,
      path: path,
      method: 'GET',
      headers
    };

    const result = await makeRequest(options);
    
    if (result.status >= 200 && result.status < 300) {
      console.log(`✅ ${name}: ${result.status} OK`);
      return true;
    } else {
      console.log(`❌ ${name}: ${result.status} ${result.data.message || 'Error'}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${name}: Network error - ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🚀 PHG Corporation - Docker API Test');
  console.log('=====================================\n');

  // Test authentication
  const authSuccess = await testAuth();
  
  console.log('\n📂 TESTING PUBLIC ENDPOINTS...');
  const test1 = await testEndpoint('API Root', '/');
  const test2 = await testEndpoint('Health Check', '/api/health');
  
  console.log('\n🔒 TESTING PROTECTED ENDPOINTS...');
  const test3 = await testEndpoint('Users API', '/api/users', true);
  const test4 = await testEndpoint('Contacts API', '/api/contacts', true);
  
  // Summary
  console.log('\n📋 TEST SUMMARY');
  console.log('===============');
  console.log(`🔐 Authentication: ${authSuccess ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log(`📂 API Root: ${test1 ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log(`📂 Health Check: ${test2 ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log(`🔒 Users API: ${test3 ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log(`🔒 Contacts API: ${test4 ? 'PASSED ✅' : 'FAILED ❌'}`);
  
  const totalTests = 5;
  const passedTests = [authSuccess, test1, test2, test3, test4].filter(Boolean).length;
  
  console.log(`\n🎯 RESULT: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 ALL TESTS PASSED! Docker deployment is working perfectly!');
    console.log('\n📝 Next steps:');
    console.log('   - Open test-frontend.html in your browser');
    console.log('   - Test the full UI interface');
    console.log('   - Your Docker deployment is ready!');
  } else {
    console.log('\n⚠️  Some tests failed. Check the Docker containers status.');
  }
  
  console.log('\n🔑 Test credentials:');
  console.log('   Email: test@phg.com');
  console.log('   Password: admin123');
  console.log('\n🌐 URLs:');
  console.log('   Backend: http://localhost:3002');
  console.log('   Frontend: Open test-frontend.html');
}

runTests().catch(error => {
  console.error('❌ Test suite failed:', error.message);
}); 