import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@phg.com' },
    update: {},
    create: {
      email: 'admin@phg.com',
      password: adminPassword,
      fullName: 'Admin User',
      role: 'ADMIN',
      status: 'ACTIVE'
    }
  });

  // Create HR user
  const hrPassword = await bcrypt.hash('hr123', 10);
  const hr = await prisma.user.upsert({
    where: { email: 'hr@phg.com' },
    update: {},
    create: {
      email: 'hr@phg.com',
      password: hrPassword,
      fullName: 'HR Manager',
      role: 'HR',
      status: 'ACTIVE'
    }
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@phg.com' },
    update: {},
    create: {
      email: 'user@phg.com',
      password: userPassword,
      fullName: 'Regular User',
      role: 'USER',
      status: 'ACTIVE'
    }
  });

  // Create sample jobs
  const job1 = await prisma.job.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'fulltime',
      description: 'We are looking for a Senior Frontend Developer to join our team. You will be responsible for developing user-facing features using React, TypeScript, and modern web technologies.',
      requirements: 'Requirements:\n• 3+ years of experience with React\n• Strong knowledge of TypeScript\n• Experience with modern CSS frameworks\n• Understanding of responsive design\n• Good communication skills',
      benefits: 'Benefits:\n• Competitive salary\n• Remote work flexibility\n• Health insurance\n• Professional development budget\n• Team building events',
      salary: '$80,000 - $120,000',
      status: 'active'
    }
  });

  const job2 = await prisma.job.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: 'Backend Developer',
      department: 'Engineering', 
      location: 'Hybrid',
      type: 'fulltime',
      description: 'Join our backend team to build scalable APIs and services. You will work with Node.js, databases, and cloud technologies.',
      requirements: 'Requirements:\n• 2+ years of Node.js experience\n• Database design knowledge\n• REST API development\n• Cloud platform experience\n• Problem-solving skills',
      benefits: 'Benefits:\n• Competitive salary\n• Hybrid work model\n• Health insurance\n• Learning opportunities\n• Career growth',
      salary: '$70,000 - $110,000',
      status: 'active'
    }
  });

  // Create sample blog
  const blog = await prisma.blog.upsert({
    where: { slug: 'react-19-features' },
    update: {},
    create: {
      title: 'React 19 New Features',
      slug: 'react-19-features',
      content: 'React 19 brings exciting new features including improved Server Components, enhanced Suspense, and better developer experience. This article covers all the major updates and how they impact modern web development.',
      excerpt: 'Discover the latest React 19 features and improvements',
      featuredImage: '/placeholder-blog.jpg',
      category: 'Technology',
      tags: 'React,JavaScript,Web Development', // Comma-separated for SQLite
      readTime: '5 min read',
      isFeatured: true,
      status: 'published',
      published: true,
      views: 150,
      authorId: admin.id
    }
  });

  // Create sample contacts
  const contact1 = await prisma.contact.upsert({
    where: { id: 'contact-1' },
    update: {},
    create: {
      id: 'contact-1',
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      phone: '0123456789',
      company: 'ABC Company',
      service: 'Tuyển dụng',
      budget: '10-50 triệu',
      subject: 'Hỏi về dịch vụ tuyển dụng',
      message: 'Chúng tôi cần hỗ trợ tuyển dụng nhân sự IT. Vui lòng liên hệ để tư vấn chi tiết.',
      status: 'NEW',
      priority: 'HIGH'
    }
  });

  const contact2 = await prisma.contact.upsert({
    where: { id: 'contact-2' },
    update: {},
    create: {
      id: 'contact-2',
      name: 'Trần Thị B',
      email: 'tranthib@example.com',
      phone: '0987654321',
      company: 'XYZ Corp',
      service: 'Phát triển phần mềm',
      budget: '50-100 triệu',
      subject: 'Dự án phát triển website',
      message: 'Chúng tôi muốn phát triển một website thương mại điện tử. Bạn có thể tư vấn về timeline và chi phí không?',
      status: 'REPLIED',
      priority: 'MEDIUM'
    }
  });

  console.log('✅ Database seeded successfully!');
  console.log(`👤 Created users: ${admin.email}, ${hr.email}, ${user.email}`);
  console.log(`💼 Created jobs: ${job1.title}, ${job2.title}`);
  console.log(`📝 Created blog: ${blog.title}`);
  console.log(`📞 Created contacts: ${contact1.name}, ${contact2.name}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 