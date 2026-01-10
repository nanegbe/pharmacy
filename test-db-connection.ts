import { prisma } from './lib/prisma';

async function testConnection() {
  try {
    // Try to connect to the database
    await prisma.$connect();
    console.log('✅ Successfully connected to the database!');
    
    // Test by running a simple query
    const userCount = await prisma.user.count();
    console.log(`✅ Database connection working. User count: ${userCount}`);
    
    // Test other models too
    const drugCount = await prisma.drug.count();
    console.log(`✅ Drug count: ${drugCount}`);
    
    const saleCount = await prisma.sale.count();
    console.log(`✅ Sale count: ${saleCount}`);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();