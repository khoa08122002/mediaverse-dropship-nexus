const http = require('http');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function checkHealth() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: process.env.HOST || '0.0.0.0',
      port: process.env.PORT || 3002,
      path: '/api/health',
      method: 'GET',
      timeout: 10000
    };

    console.log(`Testing health check endpoint: http://${options.hostname}:${options.port}${options.path}`);

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Health check passed!');
          console.log('Response:', data);
          resolve();
        } else {
          console.error(`❌ Health check failed with status code: ${res.statusCode}`);
          console.error('Response:', data);
          reject(new Error(`Health check failed with status: ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error('Health check error:', error.message);
      reject(error);
    });

    req.on('timeout', () => {
      console.error('Health check timeout');
      req.destroy();
      reject(new Error('Health check timeout'));
    });

    req.end();
  });
}

async function runHealthCheck(maxRetries = 10, retryDelay = 3000, initialDelay = 10000) {
  console.log('Starting health check test...');
  console.log(`Will retry up to ${maxRetries} times with ${retryDelay}ms delay between retries`);
  console.log(`Initial delay: ${initialDelay}ms`);
  
  // Wait for initial server startup
  console.log('Waiting for server to start...');
  await sleep(initialDelay);

  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`\nAttempt ${i + 1}/${maxRetries}`);
      await checkHealth();
      console.log('\n✨ Health check test completed successfully!');
      process.exit(0);
    } catch (error) {
      if (i === maxRetries - 1) {
        console.error('\n❌ Health check test failed after all retries');
        console.error('Last error:', error.message);
        process.exit(1);
      }
      console.log(`Retrying in ${retryDelay}ms...`);
      await sleep(retryDelay);
    }
  }
}

runHealthCheck(); 