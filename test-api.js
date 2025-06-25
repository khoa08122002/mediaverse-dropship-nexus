#!/usr/bin/env node

const axios = require('axios');
const colors = require('colors');

const API_BASE = 'http://localhost:3002';

// Test credentials
const TEST_USER = {
  email: 'test@phg.com',
  password: 'admin123'
};

let authToken = null;

// Helper function for colored output
const log = {
  success: (msg) => console.log('✅', msg.green),
  error: (msg) => console.log('❌', msg.red),
  info: (msg) => console.log('ℹ️ ', msg.blue),
  warning: (msg) => console.log('⚠️ ', msg.yellow),
  header: (msg) => {
    console.log('\n' + '='.repeat(60).cyan);
    console.log(msg.cyan.bold);
    console.log('='.repeat(60).cyan);
  }
};

// Test function
async function testEndpoint(name, method, endpoint, requiresAuth = false, expectedStatus = 200) {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (requiresAuth && authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const config = {
      method: method.toLowerCase(),
      url: `${API_BASE}${endpoint}`,
      headers,
      timeout: 5000
    };

    const response = await axios(config);
    
    if (response.status === expectedStatus) {
      log.success(`${name}: ${response.status} ${response.statusText}`);
      return { success: true, data: response.data };
    } else {
      log.warning(`${name}: Expected ${expectedStatus}, got ${response.status}`);
      return { success: false, data: response.data };
    }
  } catch (error) {
    if (error.response) {
      log.error(`${name}: ${error.response.status} ${error.response.statusText}`);
      if (error.response.status === 401 && requiresAuth) {
        log.warning('Authentication required - make sure login worked');
      }
      return { success: false, error: error.response.data };
    } else {
      log.error(`${name}: Network error - ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}

async function testAuthentication() {
  log.header('🔐 AUTHENTICATION TESTS');
  
  try {
    const response = await axios.post(`${API_BASE}/api/auth/login`, TEST_USER, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.data.accessToken) {
      authToken = response.data.accessToken;
      log.success('Login successful - token received');
      log.info(`Token: ${authToken.substring(0, 50)}...`);
      return true;
    } else {
      log.error('Login failed - no token received');
      return false;
    }
  } catch (error) {
    log.error(`Login failed: ${error.message}`);
    if (error.response) {
      console.log('Response:', error.response.data);
    }
    return false;
  }
}

async function testPublicEndpoints() {
  log.header('📂 PUBLIC ENDPOINTS TESTS');
  
  const tests = [
    { name: 'API Root', method: 'GET', endpoint: '/' },
    { name: 'Health Check', method: 'GET', endpoint: '/api/health' },
  ];

  const results = [];
  for (const test of tests) {
    const result = await testEndpoint(test.name, test.method, test.endpoint);
    results.push(result);
  }
  
  return results;
}

async function testProtectedEndpoints() {
  log.header('🔒 PROTECTED ENDPOINTS TESTS');
  
  if (!authToken) {
    log.error('No auth token available - skipping protected endpoints');
    return [];
  }

  const tests = [
    { name: 'Get Users', method: 'GET', endpoint: '/api/users', requiresAuth: true },
    { name: 'Get Contacts', method: 'GET', endpoint: '/api/contacts', requiresAuth: true },
    { name: 'Get Blogs', method: 'GET', endpoint: '/api/blogs', requiresAuth: false }, // May be public
    { name: 'Get Jobs', method: 'GET', endpoint: '/api/jobs', requiresAuth: false }, // May be public
  ];

  const results = [];
  for (const test of tests) {
    const result = await testEndpoint(test.name, test.method, test.endpoint, test.requiresAuth);
    results.push(result);
  }
  
  return results;
}

async function testDatabaseData() {
  log.header('📊 DATABASE DATA VERIFICATION');
  
  if (!authToken) {
    log.warning('No auth token - cannot verify database data');
    return;
  }

  try {
    // Test users endpoint to verify seeded data
    const usersResponse = await testEndpoint('Users Data', 'GET', '/api/users', true);
    if (usersResponse.success && Array.isArray(usersResponse.data)) {
      log.info(`Found ${usersResponse.data.length} users in database`);
      usersResponse.data.forEach(user => {
        log.info(`  - ${user.email} (${user.role})`);
      });
    }
  } catch (error) {
    log.error('Failed to verify database data');
  }
}

async function runAllTests() {
  console.log('🚀 PHG Corporation API Test Suite'.rainbow.bold);
  console.log('Docker Deployment Testing'.gray);
  console.log('=' * 60);

  const startTime = Date.now();
  
  // Test authentication first
  const authSuccess = await testAuthentication();
  
  // Test public endpoints
  const publicResults = await testPublicEndpoints();
  
  // Test protected endpoints (only if auth worked)
  const protectedResults = await testProtectedEndpoints();
  
  // Verify database data
  await testDatabaseData();
  
  // Summary
  log.header('📋 TEST SUMMARY');
  
  const allResults = [...publicResults, ...protectedResults];
  const successful = allResults.filter(r => r.success).length;
  const total = allResults.length;
  
  console.log(`🔐 Authentication: ${authSuccess ? 'PASSED'.green : 'FAILED'.red}`);
  console.log(`📂 API Endpoints: ${successful}/${total} passed`);
  
  if (successful === total && authSuccess) {
    log.success('🎉 ALL TESTS PASSED! Docker deployment is working perfectly!');
  } else {
    log.warning(`⚠️  ${total - successful} tests failed. Check the logs above.`);
  }
  
  const duration = Date.now() - startTime;
  console.log(`\n⏱️  Total test time: ${duration}ms`.gray);
  
  // Test credentials reminder
  log.header('🔑 TEST CREDENTIALS');
  console.log('Email: test@phg.com'.green);
  console.log('Password: admin123'.green);
  console.log('Frontend: Open test-frontend.html in browser'.cyan);
  console.log('Backend API: http://localhost:3002'.cyan);
}

// Run tests
runAllTests().catch(error => {
  log.error(`Test suite failed: ${error.message}`);
  process.exit(1);
}); 