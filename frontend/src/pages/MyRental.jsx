import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const MyRentals = () => {
  const { auth } = useAuth();
  const [rentals, setRentals] = useState([]);

  const fetchRentals = async () => {
    try {
      const res = await axios.get("/api/rentals/my", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setRentals(res.data);
    } catch (error) {
      console.error("Failed to fetch rentals", error);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, [auth.token]);

  const handleReturn = async (rentalId) => {
    try {
      await axios.put(
        `/api/returns/${rentalId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      alert("Book returned successfully!");
      fetchRentals(); // Refresh the list
    } catch (error) {
      console.error("Failed to return book", error);
      alert("Error returning book");
    }
  };

  return (
    <div className="my-rentals">
      <h1>📦 My Rentals</h1>
      {rentals.length === 0 ? (
        <p>No books rented currently.</p>
      ) : (
        <ul>
          {rentals.map((rental) => (
            <li key={rental.id}>
              <strong>{rental.book.title}</strong> — {rental.book.genre}
              <br />
              <span>Rented At: {new Date(rental.rented_at).toLocaleString()}</span>
              <br />
              <button onClick={() => handleReturn(rental.id)}>Return</button>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyRentals;
