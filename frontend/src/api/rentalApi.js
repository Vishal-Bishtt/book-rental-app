// api/rentalApi.js
import axios from "./axios";

// Rent a book
export const rentBook = async (bookId) => {
  const res = await axios.post("/api/rentals", { bookId });
  return res.data;
};

// Return a book
export const returnBook = async (rentalId) => {
  const res = await axios.put(`/api/rentals/${rentalId}/return`);
  return res.data;
};

// Get all rentals for logged-in user
export const getMyRentals = async () => {
  const res = await axios.get("/api/rentals/my");
  return res.data;
};

// Get all rentals (Admin only)
export const getAllRentals = async () => {
  const res = await axios.get("/api/rentals");
  return res.data;
};

// Delete rental record (Admin only)
export const deleteRental = async (rentalId) => {
  const res = await axios.delete(`/api/rentals/${rentalId}`);
  return res.data;
};
