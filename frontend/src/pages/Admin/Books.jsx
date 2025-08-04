import React, { useEffect, useState, useContext } from "react";
import { useAuth } from '../../context/AuthContext';
import BookCard from "../../components/BookCard";

const AdminBooks = () => {
  const { user, isAdmin } = useContext(useAuth);
  const [books, setBooks] = useState([]);

  // Fetch all books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("/api/books");
        const data = await res.json(); 
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    if (user && isAdmin) {
      fetchBooks();
    }
  }, [user, isAdmin]);

  // Delete book
  const handleDelete = async (bookId) => {
    try {
      const res = await fetch(`/api/books/${bookId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setBooks((prev) => prev.filter((book) => book.id !== bookId));
      } else {
        console.error("Failed to delete book");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Manage Books</h2>
      {books.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              isAdmin={true}
              onDelete={() => handleDelete(book.id)}
            />
          ))}
        </div>
      ) : (
        <p>No books found.</p>
      )}
    </div>
  );
};

export default AdminBooks;
