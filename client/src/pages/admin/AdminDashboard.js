import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/admin/dashboard/stats");
      setStats(response.data);
    } catch (err) {
      setError("Failed to fetch dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div className="container">
      <h1 className="page-title">Admin Dashboard</h1>

      <div className="stats-grid">
        <div
          className="stat-card"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <h3>{stats.totalUsers}</h3>
          <p>Total Users</p>
        </div>

        <div
          className="stat-card"
          style={{
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          }}
        >
          <h3>{stats.totalStores}</h3>
          <p>Total Stores</p>
        </div>

        <div
          className="stat-card"
          style={{
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
          }}
        >
          <h3>{stats.totalRatings}</h3>
          <p>Total Ratings</p>
        </div>
      </div>

      <div className="admin-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/admin/users" className="action-card">
            <div className="action-icon">👥</div>
            <h3>Manage Users</h3>
            <p>View and manage all users</p>
          </Link>

          <Link to="/admin/stores" className="action-card">
            <div className="action-icon">🏪</div>
            <h3>Manage Stores</h3>
            <p>View and manage all stores</p>
          </Link>

          <Link to="/admin/add-user" className="action-card">
            <div className="action-icon">➕</div>
            <h3>Add User</h3>
            <p>Create new user account</p>
          </Link>

          <Link to="/admin/add-store" className="action-card">
            <div className="action-icon">🏬</div>
            <h3>Add Store</h3>
            <p>Register new store</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
