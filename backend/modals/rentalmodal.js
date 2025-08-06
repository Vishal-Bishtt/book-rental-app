const prisma = require('../prisma/client');

const createRental = async (userId, bookId) => {
  try {
    // Use Prisma transaction for atomic operations
    const result = await prisma.$transaction(async (tx) => {
      // Check if book is available
      const book = await tx.book.findUnique({
        where: { id: parseInt(bookId) },
        select: { is_available: true }
      });
      
      if (!book || !book.is_available) {
        throw new Error('Book is not available for rental');
      }
      
      // Create rental record
      const rental = await tx.rental.create({
        data: {
          userId: parseInt(userId),
          bookId: parseInt(bookId),
          status: 'active'
        }
      });
      
      // Update book availability
      await tx.book.update({
        where: { id: parseInt(bookId) },
        data: { is_available: false }
      });
      
      return rental;
    });
    
    return result;
  } catch (err) {
    throw err;
  }
};

const returnBook = async (rentalId) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Get rental info
      const rental = await tx.rental.findFirst({
        where: { 
          id: parseInt(rentalId),
          status: 'active'
        },
        select: { bookId: true }
      });
      
      if (!rental) {
        throw new Error('Active rental not found');
      }
      
      // Update rental record
      const updatedRental = await tx.rental.update({
        where: { id: parseInt(rentalId) },
        data: {
          returned_at: new Date(),
          status: 'returned'
        }
      });
      
      // Update book availability
      await tx.book.update({
        where: { id: rental.bookId },
        data: { is_available: true }
      });
      
      return updatedRental;
    });
    
    return result;
  } catch (err) {
    throw err;
  }
};

const getAllRentals = async () => {
  const rentals = await prisma.rental.findMany({
    include: {
      book: {
        select: {
          id: true,
          title: true,
          author: true,
          genre: true
        }
      },
      user: {
        select: {
          id: true,
          username: true,
          email: true
        }
      }
    },
    orderBy: {
      rented_at: 'desc'
    }
  });

  // Transform data to match expected format
  return rentals.map(rental => ({
    ...rental,
    // Add legacy field mappings for backward compatibility
    user_name: rental.user.username || rental.user.email,
    user_email: rental.user.email,
    book_title: rental.book.title,
    book_author: rental.book.author,
    book_genre: rental.book.genre
  }));
};

const getRentalByUserId = async (userId) => {
  const rentals = await prisma.rental.findMany({
    where: {
      userId: parseInt(userId),
      status: 'active'
    },
    include: {
      book: {
        select: {
          id: true,
          title: true,
          author: true,
          genre: true
        }
      }
    },
    orderBy: {
      rented_at: 'desc'
    }
  });

  // Transform data to match expected format
  return rentals.map(rental => ({
    ...rental,
    // Add legacy field mappings for backward compatibility
    book_title: rental.book.title,
    book_author: rental.book.author,
    book_genre: rental.book.genre
  }));
};

const deleteRental = async (id) => {
  await prisma.rental.delete({
    where: { id: parseInt(id) }
  });
};

module.exports = {
  createRental,
  returnBook,
  getAllRentals,
  getRentalByUserId,
  deleteRental,
};
 