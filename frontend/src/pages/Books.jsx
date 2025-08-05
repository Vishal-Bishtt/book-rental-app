import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const BookList = () => {
  const { auth } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [renting, setRenting] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/books", {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setBooks(res.data);
      } catch (err) {
        console.error("Failed to fetch books", err);
        alert("Failed to fetch books");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [auth.token]);

  const handleRent = async (bookId) => {
    if (renting) return;
    
    setRenting(bookId);
    try {
      await axios.post(
        "http://localhost:5000/api/rentals",
        { bookId },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      alert("Book rented successfully!");
      
      // Update book availability locally
      setBooks(prevBooks => 
        prevBooks.map(book => 
          book.id === bookId ? { ...book, is_available: false } : book
        )
      );
    } catch (err) {
      console.error("Failed to rent book", err);
      alert(err.response?.data?.message || "Failed to rent book");
    } finally {
      setRenting(null);
    }
  };

  if (loading) {
    return <div className="loading">Loading books...</div>;
  }

  return (
    <div className="books-container">
      <style jsx>{`
        .books-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .books-title {
          text-align: center;
          color: #2c3e50;
          margin-bottom: 30px;
          font-size: 2.5rem;
          font-weight: 600;
        }

        .books-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 25px;
          padding: 0;
          list-style: none;
        }

        .book-card {
          background: #ffffff;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 1px solid #e1e8ed;
          position: relative;
          overflow: hidden;
        }

        .book-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .book-card.unavailable {
          background: #f8f9fa;
          opacity: 0.8;
        }

        .book-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 10px;
          line-height: 1.3;
        }

        .book-author {
          font-size: 1rem;
          color: #7f8c8d;
          margin-bottom: 8px;
        }

        .book-genre {
          font-size: 0.9rem;
          color: #8e44ad;
          font-weight: 500;
          margin-bottom: 15px;
          text-transform: capitalize;
        }

        .availability-status {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 15px;
        }

        .status-available {
          background: #d5edda;
          color: #155724;
        }

        .status-unavailable {
          background: #f8d7da;
          color: #721c24;
        }

        .rent-button {
          width: 100%;
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .rent-button.available {
          background: linear-gradient(135deg, #3498db, #2980b9);
          color: white;
        }

        .rent-button.available:hover {
          background: linear-gradient(135deg, #2980b9, #1f5f8b);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
        }

        .rent-button.available:active {
          transform: translateY(0);
        }

        .rent-button.unavailable {
          background: #95a5a6;
          color: #ecf0f1;
          cursor: not-allowed;
        }

        .rent-button.renting {
          background: #f39c12;
          color: white;
          cursor: not-allowed;
        }

        .loading {
          text-align: center;
          padding: 50px;
          font-size: 1.2rem;
          color: #7f8c8d;
        }

        .no-books {
          text-align: center;
          padding: 50px;
          color: #7f8c8d;
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .books-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .books-container {
            padding: 15px;
          }
          
          .books-title {
            font-size: 2rem;
          }
        }
      `}</style>

      <h1 className="books-title">📚 Available Books</h1>
      
      {books.length === 0 ? (
        <div className="no-books">No books available in the library.</div>
      ) : (
        <ul className="books-grid">
          {books.map((book) => (
            <li key={book.id} className={`book-card ${!book.is_available ? 'unavailable' : ''}`}>
              <h3 className="book-title">{book.title}</h3>
              {book.author && <p className="book-author">by {book.author}</p>}
              <p className="book-genre">{book.genre}</p>
              
              <span className={`availability-status ${book.is_available ? 'status-available' : 'status-unavailable'}`}>
                {book.is_available ? '✅ Available' : '❌ Not Available'}
              </span>
              
              {book.is_available ? (
                <button
                  className={`rent-button available ${renting === book.id ? 'renting' : ''}`}
                  onClick={() => handleRent(book.id)}
                  disabled={renting === book.id}
                >
                  {renting === book.id ? 'Renting...' : 'Rent Book'}
                </button>
              ) : (
                <button className="rent-button unavailable" disabled>
                  Currently Rented
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookList;
