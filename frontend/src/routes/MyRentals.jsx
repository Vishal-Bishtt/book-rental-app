import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const MyRentals = () => {
  const { auth } = useAuth();
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/rentals/user", {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        setRentals(res.data);
      } catch (err) {
        console.error("Error fetching rentals", err);
      }
    };

    if (auth?.token) fetchRentals();
  }, [auth]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">My Rentals</h2>
      {rentals.length === 0 ? (
        <p>No books rented yet.</p>
      ) : (
        <ul className="space-y-2">
          {rentals.map((rental) => (
            <li key={rental.id} className="border p-2 rounded shadow">
              <strong>{rental.book.title}</strong> -{" "}
              {new Date(rental.rented_at).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyRentals;
