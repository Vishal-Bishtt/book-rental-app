-- Quick Database Setup for Book Rental System
-- Minimal version - run this if you want to get started quickly

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create books table
CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    genre VARCHAR(100),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create rentals table
CREATE TABLE IF NOT EXISTS rentals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    rented_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    returned_at TIMESTAMP NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_rentals_user_id ON rentals(user_id);
CREATE INDEX IF NOT EXISTS idx_rentals_book_id ON rentals(book_id);
CREATE INDEX IF NOT EXISTS idx_rentals_status ON rentals(status);
CREATE INDEX IF NOT EXISTS idx_books_available ON books(is_available);

-- Insert sample data
INSERT INTO users (username, email, password, role) VALUES 
('admin', 'admin@bookrental.com', '$2b$10$rOzJaC8EHqyruBqcVz8f9.fYqm2i5JH2l4SLdmJ8yBqJ1mKxZ7gKS', 'admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (username, email, password, role) VALUES 
('john_doe', 'john@example.com', '$2b$10$vKx5lCjI4j7Rm8/yQ3f4k.7pA1cE9JH2l4SLdmJ8yBqJ1mKxZ7gKS', 'user')
ON CONFLICT (email) DO NOTHING;

INSERT INTO books (title, author, genre, is_available) VALUES 
('The Great Gatsby', 'F. Scott Fitzgerald', 'Classic Fiction', true),
('To Kill a Mockingbird', 'Harper Lee', 'Classic Fiction', true),
('1984', 'George Orwell', 'Dystopian Fiction', true),
('Pride and Prejudice', 'Jane Austen', 'Romance', true),
('The Catcher in the Rye', 'J.D. Salinger', 'Coming-of-age Fiction', true)
ON CONFLICT DO NOTHING;
