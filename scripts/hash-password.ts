import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function hashPassword(userId: string, newPassword: string) {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: { 
        password: hashedPassword,
        updatedAt: new Date()
      }
    });

    console.log('Password hashed successfully for user:', user.email);
    return user;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Example usage:
// Run with: npx ts-node scripts/hash-password.ts <userId> <newPassword>
const [,, userId, newPassword] = process.argv;

if (!userId || !newPassword) {
  console.error('Please provide userId and newPassword');
  console.error('Usage: npx ts-node scripts/hash-password.ts <userId> <newPassword>');
  process.exit(1);
}

hashPassword(userId, newPassword)
  .catch(error => {
    console.error('Failed to hash password:', error);
    process.exit(1);
  }); 