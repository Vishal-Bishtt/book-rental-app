import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const BookList = () => {
  const { auth } = useAuth();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/books", {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setBooks(res.data);
      } catch (err) {
        console.error("Failed to fetch books", err);
      }
    };
    fetchBooks();
  }, [auth.token]);

  return (
    <div>
      <h2>Books</h2>
      <ul>
        {books.map((b) => (
          <li key={b.id}>
            {b.title} — {b.genre} —{" "}
            <strong>{b.is_available ? "Available" : "Rented"}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
