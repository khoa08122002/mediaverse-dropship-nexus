const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      fullName: 'Admin User',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  console.log({ admin });

  // Create sample jobs
  const jobs = await Promise.all([
    prisma.job.create({
      data: {
        title: 'Frontend Developer',
        department: 'Engineering',
        location: 'Ho Chi Minh City',
        type: 'fulltime',
        description: 'We are looking for a Frontend Developer to join our team.',
        requirements: '- 2+ years of experience with React\n- Strong knowledge of JavaScript/TypeScript\n- Experience with modern frontend frameworks',
        benefits: '- Competitive salary\n- Health insurance\n- Annual leave\n- Training opportunities',
        salary: '$1000-$2000',
        status: 'active',
      },
    }).catch((error) => {
      if (error.code === 'P2002') {
        return prisma.job.findFirst({
          where: { title: 'Frontend Developer' }
        });
      }
      throw error;
    }),
    prisma.job.create({
      data: {
        title: 'Backend Developer',
        department: 'Engineering',
        location: 'Ho Chi Minh City',
        type: 'fulltime',
        description: 'We are looking for a Backend Developer to join our team.',
        requirements: '- 2+ years of experience with Node.js\n- Strong knowledge of TypeScript\n- Experience with NestJS and PostgreSQL',
        benefits: '- Competitive salary\n- Health insurance\n- Annual leave\n- Training opportunities',
        salary: '$1000-$2000',
        status: 'active',
      },
    }).catch((error) => {
      if (error.code === 'P2002') {
        return prisma.job.findFirst({
          where: { title: 'Backend Developer' }
        });
      }
      throw error;
    }),
  ]);

  console.log({ jobs });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 