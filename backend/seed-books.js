const pool = require('./db/db');

const sampleBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic Fiction"
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Classic Fiction"
  },
  {
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian Fiction"
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance"
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    genre: "Coming of Age"
  },
  {
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    genre: "Fantasy"
  },
  {
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    genre: "Fantasy"
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy"
  }
];

async function seedBooks() {
  try {
    console.log('Seeding books...');
    
    for (const book of sampleBooks) {
      await pool.query(
        'INSERT INTO books (title, author, genre, is_available) VALUES ($1, $2, $3, $4)',
        [book.title, book.author, book.genre, true]
      );
      console.log(`Added: ${book.title}`);
    }
    
    console.log('Books seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding books:', error);
    process.exit(1);
  }
}

seedBooks();
