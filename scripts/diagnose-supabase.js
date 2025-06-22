#!/usr/bin/env node

const https = require('https');
const { URL } = require('url');

console.log('🔍 Supabase Connection Diagnostics');
console.log('===================================\n');

// Check if Supabase project is accessible
async function checkSupabaseStatus() {
    console.log('🌐 Checking Supabase project status...');
    
    const projectUrl = 'https://qwtockcawgwpvpxiewov.supabase.co';
    
    return new Promise((resolve) => {
        const req = https.get(projectUrl, (res) => {
            console.log(`✅ Supabase project is accessible (HTTP ${res.statusCode})`);
            resolve(true);
        });
        
        req.on('error', (error) => {
            console.log(`❌ Cannot reach Supabase project: ${error.message}`);
            resolve(false);
        });
        
        req.setTimeout(10000, () => {
            console.log('⏰ Timeout reaching Supabase project');
            req.destroy();
            resolve(false);
        });
    });
}

// Check database connectivity
async function checkDatabaseConnectivity() {
    console.log('\n🔌 Checking database connectivity...');
    
    const net = require('net');
    const host = 'db.qwtockcawgwpvpxiewov.supabase.co';
    const port = 5432;
    
    return new Promise((resolve) => {
        const socket = new net.Socket();
        
        socket.setTimeout(10000);
        
        socket.on('connect', () => {
            console.log(`✅ Database port ${port} is reachable`);
            socket.destroy();
            resolve(true);
        });
        
        socket.on('timeout', () => {
            console.log(`⏰ Timeout connecting to database port ${port}`);
            socket.destroy();
            resolve(false);
        });
        
        socket.on('error', (error) => {
            console.log(`❌ Cannot connect to database port ${port}: ${error.message}`);
            resolve(false);
        });
        
        socket.connect(port, host);
    });
}

// Check pooler connectivity
async function checkPoolerConnectivity() {
    console.log('\n🏊 Checking pooler connectivity...');
    
    const net = require('net');
    const host = 'aws-0-ap-southeast-1.pooler.supabase.com';
    const port = 6543; // Transaction pooler port
    
    return new Promise((resolve) => {
        const socket = new net.Socket();
        
        socket.setTimeout(10000);
        
        socket.on('connect', () => {
            console.log(`✅ Pooler port ${port} is reachable`);
            socket.destroy();
            resolve(true);
        });
        
        socket.on('timeout', () => {
            console.log(`⏰ Timeout connecting to pooler port ${port}`);
            socket.destroy();
            resolve(false);
        });
        
        socket.on('error', (error) => {
            console.log(`❌ Cannot connect to pooler port ${port}: ${error.message}`);
            resolve(false);
        });
        
        socket.connect(port, host);
    });
}

// Main diagnostic function
async function runDiagnostics() {
    console.log('🔧 Environment Check:');
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    if (process.env.DATABASE_URL) {
        console.log('DATABASE_URL preview:', process.env.DATABASE_URL.substring(0, 50) + '...');
    }
    
    console.log('\n🔍 Running connectivity tests...\n');
    
    const supabaseStatus = await checkSupabaseStatus();
    const dbConnective = await checkDatabaseConnectivity();
    const poolerConnective = await checkPoolerConnectivity();
    
    console.log('\n📊 DIAGNOSTIC SUMMARY:');
    console.log('===================');
    console.log(`Supabase Project: ${supabaseStatus ? '✅ OK' : '❌ FAIL'}`);
    console.log(`Direct Database: ${dbConnective ? '✅ OK' : '❌ FAIL'}`);
    console.log(`Transaction Pooler: ${poolerConnective ? '✅ OK' : '❌ FAIL'}`);
    
    console.log('\n💡 RECOMMENDATIONS:');
    console.log('==================');
    
    if (!supabaseStatus) {
        console.log('❌ Supabase project không accessible:');
        console.log('   • Check if project is paused/suspended');
        console.log('   • Go to Supabase dashboard and check project status');
        console.log('   • Try refreshing/restarting the project');
    }
    
    if (!dbConnective && !poolerConnective) {
        console.log('❌ Cả direct và pooler đều fail:');
        console.log('   • Project có thể đang paused');
        console.log('   • Check firewall/network restrictions');
        console.log('   • Thử từ network khác');
    } else if (!dbConnective && poolerConnective) {
        console.log('✅ Pooler OK, Direct connection fail:');
        console.log('   • Dùng Transaction Pooler cho Vercel (đã đúng)');
        console.log('   • Local development dùng pooler thay vì direct');
    } else if (dbConnective && !poolerConnective) {
        console.log('✅ Direct OK, Pooler fail:');
        console.log('   • Có thể dùng direct connection cho development');
        console.log('   • Check pooler region settings');
    } else {
        console.log('✅ Cả hai đều OK - Problem might be authentication');
        console.log('   • Check password correctness');
        console.log('   • Verify URL encoding');
    }
    
    console.log('\n🔄 NEXT STEPS:');
    console.log('=============');
    
    if (poolerConnective) {
        console.log('1. Update local .env to use pooler:');
        console.log('   DATABASE_URL="postgresql://postgres.qwtockcawgwpvpxiewov:Dangkhoa08122002%40%40@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"');
        console.log('2. Test again: npm run test:supabase');
        console.log('3. Deploy schema: npm run prisma:deploy');
    } else {
        console.log('1. Check Supabase dashboard for project status');
        console.log('2. Ensure project is not paused');
        console.log('3. Try from different network');
        console.log('4. Contact Supabase support if issue persists');
    }
}

runDiagnostics().catch(console.error); 