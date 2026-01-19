import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function seedAdminUser() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Check if admin user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@pharmacy.local' },
    });

    if (existingUser) {
      console.log('Admin user already exists');
      return;
    }

    // Create the admin user
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@pharmacy.local',
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN', // assuming you want admin role
      },
    });

    console.log('Admin user created successfully:', adminUser.email);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdminUser();