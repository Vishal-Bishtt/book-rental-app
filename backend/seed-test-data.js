const prisma = require('./prisma/client');

/**
 * Seed script to create test data for verifying the fixes
 */
async function seedTestData() {
  try {
    console.log('🌱 Seeding test data...');
    
    // Create test users
    const testUsers = [
      {
        username: 'John Doe',
        email: 'john.doe@example.com',
        password: '$2b$10$examplehashedpassword', // Just a placeholder
        role: 'user'
      },
      {
        username: 'Jane Smith',
        email: 'jane.smith@example.com',
        googleId: 'google123456',
        role: 'user'
      }
    ];
    
    for (const userData of testUsers) {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });
      
      if (!existingUser) {
        const user = await prisma.user.create({
          data: userData
        });
        console.log(`✅ Created user: ${user.username} (${user.email})`);
      } else {
        console.log(`⏭️ User already exists: ${userData.email}`);
      }
    }
    
    // Create test books
    const testBooks = [
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        genre: 'Fiction',
        is_available: true
      },
      {
        title: '1984',
        author: 'George Orwell',
        genre: 'Dystopian Fiction',
        is_available: false
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        genre: 'Fiction',
        is_available: true
      }
    ];
    
    for (const bookData of testBooks) {
      const existingBook = await prisma.book.findFirst({
        where: { title: bookData.title }
      });
      
      if (!existingBook) {
        const book = await prisma.book.create({
          data: bookData
        });
        console.log(`📚 Created book: ${book.title} by ${book.author}`);
      } else {
        console.log(`⏭️ Book already exists: ${bookData.title}`);
      }
    }
    
    // Create test rentals
    const users = await prisma.user.findMany({ take: 2 });
    const books = await prisma.book.findMany({ take: 2 });
    
    if (users.length > 0 && books.length > 0) {
      const existingRental = await prisma.rental.findFirst({
        where: {
          userId: users[0].id,
          bookId: books[0].id
        }
      });
      
      if (!existingRental) {
        const rental = await prisma.rental.create({
          data: {
            userId: users[0].id,
            bookId: books[0].id,
            status: 'active'
          }
        });
        console.log(`🏷️ Created rental: User ${users[0].username} rented ${books[0].title}`);
      } else {
        console.log(`⏭️ Rental already exists between user and book`);
      }
    }
    
    console.log('✅ Test data seeding completed!');
    
  } catch (error) {
    console.error('❌ Test data seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedTestData()
    .then(() => {
      console.log('🎉 Seeding complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedTestData };
