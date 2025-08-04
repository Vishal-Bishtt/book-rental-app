// api/userApi.js
import axios from "./axios";

// Get all users (Admin only)
export const getAllUsers = async () => {
  const res = await axios.get("/users");
  return res.data;
};

// Register user
export const registerUser = async (userData) => {
  const res = await axios.post("/users/register", userData);
  return res.data;
};

// Login user
export const loginUser = async (credentials) => {
  const res = await axios.post("/users/login", credentials);
  return res.data;
};

// Get profile of logged-in user
export const getMyProfile = async () => {
  const res = await axios.get("/users/profile");
  return res.data;
};

// Delete a user (Admin only)
export const deleteUser = async (userId) => {
  const res = await axios.delete(`/users/${userId}`);
  return res.data;
};
