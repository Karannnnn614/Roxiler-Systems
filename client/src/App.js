import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UpdatePassword from "./pages/UpdatePassword";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import UserDetails from "./pages/admin/UserDetails";
import AddUser from "./pages/admin/AddUser";
import ManageStores from "./pages/admin/ManageStores";
import AddStore from "./pages/admin/AddStore";

// User Pages
import UserStores from "./pages/user/UserStores";

// Store Owner Pages
import StoreOwnerDashboard from "./pages/storeOwner/StoreOwnerDashboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/update-password"
            element={
              <PrivateRoute>
                <UpdatePassword />
              </PrivateRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <ManageUsers />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users/:id"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <UserDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/add-user"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AddUser />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/stores"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <ManageStores />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/add-store"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AddStore />
              </PrivateRoute>
            }
          />

          {/* User Routes */}
          <Route
            path="/stores"
            element={
              <PrivateRoute allowedRoles={["user"]}>
                <UserStores />
              </PrivateRoute>
            }
          />

          {/* Store Owner Routes */}
          <Route
            path="/store-owner/dashboard"
            element={
              <PrivateRoute allowedRoles={["store_owner"]}>
                <StoreOwnerDashboard />
              </PrivateRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
