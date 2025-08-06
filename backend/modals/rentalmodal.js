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
  return await prisma.rental.findMany({
    include: {
      book: {
        select: {
          title: true,
          author: true,
          genre: true
        }
      },
      user: {
        select: {
          username: true,
          email: true
        }
      }
    },
    orderBy: {
      rented_at: 'desc'
    }
  });
};

const getRentalByUserId = async (userId) => {
  return await prisma.rental.findMany({
    where: {
      userId: parseInt(userId),
      status: 'active'
    },
    include: {
      book: {
        select: {
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
 