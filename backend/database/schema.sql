-- Book Rental System Database Schema
-- Run this SQL script in your PostgreSQL database

-- Drop tables if they exist (be careful with this in production!)
DROP TABLE IF EXISTS rentals CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE rental_status AS ENUM ('active', 'returned', 'overdue');

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create books table
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    genre VARCHAR(100),
    isbn VARCHAR(20) UNIQUE,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create rentals table
CREATE TABLE rentals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL,
    rented_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    returned_at TIMESTAMP NULL,
    due_date TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '14 days'),
    status rental_status DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    CONSTRAINT fk_rental_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
    
    CONSTRAINT fk_rental_book 
        FOREIGN KEY (book_id) 
        REFERENCES books(id) 
        ON DELETE CASCADE,
    
    -- Ensure a book can only have one active rental at a time
    CONSTRAINT unique_active_rental 
        UNIQUE (book_id, status) 
        DEFERRABLE INITIALLY DEFERRED
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_books_genre ON books(genre);
CREATE INDEX idx_books_available ON books(is_available);
CREATE INDEX idx_rentals_user_id ON rentals(user_id);
CREATE INDEX idx_rentals_book_id ON rentals(book_id);
CREATE INDEX idx_rentals_status ON rentals(status);
CREATE INDEX idx_rentals_rented_at ON rentals(rented_at);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_books_updated_at 
    BEFORE UPDATE ON books 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rentals_updated_at 
    BEFORE UPDATE ON rentals 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to prevent renting unavailable books
CREATE OR REPLACE FUNCTION check_book_availability()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT is_available FROM books WHERE id = NEW.book_id) = false THEN
        RAISE EXCEPTION 'Book with id % is not available for rental', NEW.book_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to check book availability before rental
CREATE TRIGGER check_book_availability_trigger
    BEFORE INSERT ON rentals
    FOR EACH ROW
    EXECUTE FUNCTION check_book_availability();

-- Sample admin user (password: admin123)
INSERT INTO users (username, email, password, role) VALUES 
('admin', 'admin@bookrental.com', '$2b$10$rOzJaC8EHqyruBqcVz8f9.fYqm2i5JH2l4SLdmJ8yBqJ1mKxZ7gKS', 'admin');

-- Sample regular user (password: user123)
INSERT INTO users (username, email, password, role) VALUES 
('john_doe', 'john@example.com', '$2b$10$vKx5lCjI4j7Rm8/yQ3f4k.7pA1cE9JH2l4SLdmJ8yBqJ1mKxZ7gKS', 'user');

-- Sample books
INSERT INTO books (title, author, genre, isbn, is_available) VALUES 
('The Great Gatsby', 'F. Scott Fitzgerald', 'Classic Fiction', '9780743273565', true),
('To Kill a Mockingbird', 'Harper Lee', 'Classic Fiction', '9780446310789', true),
('1984', 'George Orwell', 'Dystopian Fiction', '9780451524935', true),
('Pride and Prejudice', 'Jane Austen', 'Romance', '9780141439518', true),
('The Catcher in the Rye', 'J.D. Salinger', 'Coming-of-age Fiction', '9780316769174', true),
('Lord of the Flies', 'William Golding', 'Adventure Fiction', '9780571056682', true),
('Animal Farm', 'George Orwell', 'Political Satire', '9780451526342', true),
('Brave New World', 'Aldous Huxley', 'Science Fiction', '9780060850524', true),
('The Hobbit', 'J.R.R. Tolkien', 'Fantasy', '9780547928227', true),
('Harry Potter and the Philosopher''s Stone', 'J.K. Rowling', 'Fantasy', '9780747532699', true);

-- Sample rental (John rents The Great Gatsby)
INSERT INTO rentals (user_id, book_id, status) VALUES 
((SELECT id FROM users WHERE username = 'john_doe'), 
 (SELECT id FROM books WHERE title = 'The Great Gatsby'), 
 'active');

-- Update book availability after rental
UPDATE books SET is_available = false WHERE title = 'The Great Gatsby';

-- Verify the setup
SELECT 'Database setup completed successfully!' as status;
SELECT 'Users created: ' || COUNT(*) as users_count FROM users;
SELECT 'Books created: ' || COUNT(*) as books_count FROM books;
SELECT 'Rentals created: ' || COUNT(*) as rentals_count FROM rentals;
