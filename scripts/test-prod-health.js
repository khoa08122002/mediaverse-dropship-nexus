const { spawn } = require('child_process');
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
          console.log('✅ Production health check passed!');
          console.log('Response:', data);
          resolve();
        } else {
          console.error(`❌ Production health check failed with status code: ${res.statusCode}`);
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

async function buildAndTest() {
  console.log('🏗️  Starting production build and test...');
  
  try {
    // Step 1: Clean and build
    console.log('\n📦 Building application...');
    const buildProcess = spawn('npm', ['run', 'build'], { 
      stdio: 'inherit',
      shell: true 
    });
    
    await new Promise((resolve, reject) => {
      buildProcess.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Build completed successfully!');
          resolve();
        } else {
          reject(new Error(`Build failed with code ${code}`));
        }
      });
    });

    // Step 2: Run predeploy (migrate database)
    console.log('\n🗄️  Running database migration...');
    const predeploy = spawn('npm', ['run', 'predeploy'], { 
      stdio: 'inherit',
      shell: true 
    });
    
    await new Promise((resolve, reject) => {
      predeploy.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Database migration completed!');
          resolve();
        } else {
          console.log('⚠️  Database migration failed, but continuing...');
          resolve(); // Continue even if migration fails in local test
        }
      });
    });

    // Step 3: Start production server
    console.log('\n🚀 Starting production server...');
    const serverProcess = spawn('npm', ['run', 'start:prod'], { 
      stdio: 'pipe',
      shell: true,
      env: { ...process.env, NODE_ENV: 'production' }
    });

    let serverReady = false;
    
    serverProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(output);
      if (output.includes('Application successfully started!')) {
        serverReady = true;
      }
    });

    serverProcess.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    // Wait for server to start
    console.log('⏳ Waiting for server to start...');
    for (let i = 0; i < 30; i++) {
      if (serverReady) break;
      await sleep(1000);
      console.log(`Waiting... ${i + 1}/30 seconds`);
    }

    if (!serverReady) {
      throw new Error('Server failed to start within 30 seconds');
    }

    // Step 4: Test health check
    console.log('\n🏥 Testing health check...');
    await sleep(2000); // Extra wait to ensure server is fully ready
    await checkHealth();

    // Step 5: Cleanup
    console.log('\n🧹 Cleaning up...');
    serverProcess.kill('SIGTERM');
    
    console.log('\n🎉 Production build and health check test completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Production test failed:');
    console.error(error.message);
    process.exit(1);
  }
}

buildAndTest(); 