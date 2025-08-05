import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Books from "./pages/Books";
import Rental from "./pages/MyRental";
import Users from "./pages/Users";

import AdminBooks from "./pages/Admin/Books";
import AdminRentals from "./pages/Admin/Dashboard";
import AdminUsers from "./pages/Admin/UsersSimple";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

import Navbar from "./components/Navbar"; // using only Navbar (not Header or PrivateRoute)

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/register" element={<Register />} />

        {/* Protected Routes (for logged-in users) */}
        <Route
          path="/books"
          element={
            <ProtectedRoute>
              <Books />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rental"
          element={
            <ProtectedRoute>
              <Rental />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />

        {/* Admin-only Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminRentals />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/books"
          element={
            <AdminRoute>
              <AdminBooks />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminRentals />
            </AdminRoute>
          }
        />
      </Routes>
    </Router> 
  );
}

export default App;
