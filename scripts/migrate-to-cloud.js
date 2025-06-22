#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

async function migrateData() {
  console.log('🔄 Starting data migration...');
  
  // Local database
  const localPrisma = new PrismaClient({
    datasources: {
      db: { url: 'postgresql://postgres:123456@localhost:5432/phgroup_db?schema=public' }
    }
  });
  
  // Cloud database (set in env)
  const cloudPrisma = new PrismaClient();
  
  try {
    // 1. Export data from local
    console.log('📤 Exporting data from local database...');
    const [localUsers, localJobs, localApplications, localContacts, localBlogs] = await Promise.all([
      localPrisma.user.findMany(),
      localPrisma.job.findMany(),
      localPrisma.application.findMany(),
      localPrisma.contact.findMany(),
      localPrisma.blog.findMany()
    ]);
    
    console.log(`Found: ${localUsers.length} users, ${localJobs.length} jobs, ${localApplications.length} applications, ${localContacts.length} contacts, ${localBlogs.length} blogs`);
    
    // 2. Import to cloud database
    console.log('📥 Importing data to cloud database...');
    
    // Import users first (no dependencies)
    for (const user of localUsers) {
      await cloudPrisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: user
      });
    }
    console.log(`✅ Imported ${localUsers.length} users`);
    
    // Import jobs (no dependencies)
    for (const job of localJobs) {
      await cloudPrisma.job.upsert({
        where: { id: job.id },
        update: {},
        create: job
      });
    }
    console.log(`✅ Imported ${localJobs.length} jobs`);
    
    // Import blogs (depends on users)
    for (const blog of localBlogs) {
      await cloudPrisma.blog.upsert({
        where: { slug: blog.slug },
        update: {},
        create: blog
      });
    }
    console.log(`✅ Imported ${localBlogs.length} blogs`);
    
    // Import contacts (no dependencies)
    for (const contact of localContacts) {
      await cloudPrisma.contact.upsert({
        where: { id: contact.id },
        update: {},
        create: contact
      });
    }
    console.log(`✅ Imported ${localContacts.length} contacts`);
    
    // Import applications (depends on jobs)
    for (const application of localApplications) {
      await cloudPrisma.application.upsert({
        where: { id: application.id },
        update: {},
        create: application
      });
    }
    console.log(`✅ Imported ${localApplications.length} applications`);
    
    console.log('🎉 Data migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await localPrisma.$disconnect();
    await cloudPrisma.$disconnect();
  }
}

if (require.main === module) {
  migrateData()
    .catch(console.error)
    .finally(() => process.exit());
}

module.exports = migrateData; 