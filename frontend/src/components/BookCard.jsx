import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BookCard = ({ book, handleRent }) => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const onRent = () => {
    if (!auth?.token) {
      return navigate("/login");
    }
    handleRent(book.id); // Assuming book has an 'id' field
  };

  return (
    <div className="border p-4 rounded shadow-md bg-white hover:shadow-lg transition">
      <h2 className="text-xl font-bold">{book.title}</h2>
      <p className="text-gray-700 mb-2"><strong>Genre:</strong> {book.genre}</p>
      <p className="text-gray-700 mb-2">
        <strong>Available:</strong> {book.is_available ? "Yes" : "No"}
      </p>
      <button
        onClick={onRent}
        disabled={!book.is_available}
        className={`mt-2 px-4 py-2 rounded text-white 
          ${book.is_available ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
      >
        {book.is_available ? "Rent" : "Unavailable"}
      </button>
    </div>
  );
};

export default BookCard;
