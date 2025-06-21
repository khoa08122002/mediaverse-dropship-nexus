#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

async function testDatabase() {
  console.log('🔍 Testing database connection...');
  
  if (!process.env.DATABASE_URL) {
    console.log('❌ No DATABASE_URL found in environment variables');
    return false;
  }
  
  console.log('📍 Database URL found:', process.env.DATABASE_URL.substring(0, 20) + '...');
  
  const prisma = new PrismaClient();
  
  try {
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Test query
    const userCount = await prisma.user.count();
    console.log(`👥 Users in database: ${userCount}`);
    
    const jobCount = await prisma.job.count();
    console.log(`💼 Jobs in database: ${jobCount}`);
    
    const contactCount = await prisma.contact.count();
    console.log(`📞 Contacts in database: ${contactCount}`);
    
    const blogCount = await prisma.blog.count();
    console.log(`📝 Blogs in database: ${blogCount}`);
    
    return true;
    
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  testDatabase()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('❌ Test failed:', error);
      process.exit(1);
    });
}

module.exports = testDatabase; 