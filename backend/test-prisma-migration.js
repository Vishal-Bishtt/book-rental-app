const prisma = require('./prisma/client');

/**
 * Migration script to test Prisma connectivity and basic operations
 * Run this after migrating from db/db.js to Prisma
 */
async function testPrismaConnectivity() {
  try {
    console.log('🔍 Testing Prisma connectivity...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Prisma connected successfully');
    
    // Get counts of all models
    const userCount = await prisma.user.count();
    const bookCount = await prisma.book.count();
    const rentalCount = await prisma.rental.count();
    
    console.log('📊 Database Statistics:');
    console.log(`   Users: ${userCount}`);
    console.log(`   Books: ${bookCount}`);
    console.log(`   Rentals: ${rentalCount}`);
    
    // Test a simple query with relations
    const sampleRentals = await prisma.rental.findMany({
      take: 3,
      include: {
        user: {
          select: {
            username: true,
            email: true
          }
        },
        book: {
          select: {
            title: true,
            author: true
          }
        }
      }
    });
    
    console.log('📚 Sample rentals with relations:');
    sampleRentals.forEach((rental, index) => {
      console.log(`   ${index + 1}. ${rental.user.username} rented "${rental.book.title}" by ${rental.book.author}`);
    });
    
    console.log('✅ Prisma migration test completed successfully!');
    
  } catch (error) {
    console.error('❌ Prisma migration test failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testPrismaConnectivity()
    .then(() => {
      console.log('🎉 Migration validation complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration validation failed:', error);
      process.exit(1);
    });
}

module.exports = { testPrismaConnectivity };
