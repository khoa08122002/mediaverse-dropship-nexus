import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Khoa08122002@@', 10);

  const hr = await prisma.user.upsert({
    where: { email: 'khoa@gmail.com' },
    update: {
      password: hashedPassword
    },
    create: {
      email: 'khoa@gmail.com',
      password: hashedPassword,
      fullName: 'Khoa',
      role: 'HR',
      status: 'ACTIVE'
    }
  });

  console.log('HR user updated:', hr);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 