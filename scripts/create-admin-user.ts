import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import { UserRole } from '../types/user';

async function createAdminUser() {
  try {
    // Hash the default admin password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Create the admin user
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    console.log('Admin user created successfully:');
    console.log(`ID: ${adminUser.id}`);
    console.log(`Email: ${adminUser.email}`);
    console.log(`Name: ${adminUser.name}`);
    console.log(`Role: ${adminUser.role}`);

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();