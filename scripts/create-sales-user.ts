import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import { UserRole } from '../types/user';

async function createSalesUser() {
  try {
    // Hash the default sales password
    const hashedPassword = await bcrypt.hash('sales123', 10);
    
    // Create the sales user
    const salesUser = await prisma.user.create({
      data: {
        name: 'Sales User',
        email: 'sales@example.com',
        password: hashedPassword,
        role: UserRole.SALES,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    console.log('Sales user created successfully:');
    console.log(`ID: ${salesUser.id}`);
    console.log(`Email: ${salesUser.email}`);
    console.log(`Name: ${salesUser.name}`);
    console.log(`Role: ${salesUser.role}`);

  } catch (error) {
    console.error('Error creating sales user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSalesUser();