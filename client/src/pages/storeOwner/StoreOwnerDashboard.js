import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import "./StoreOwnerDashboard.css";

const StoreOwnerDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/store-owner/dashboard");
      setDashboard(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">Store Owner Dashboard</h1>

      <div className="card">
        <div className="average-rating-card">
          <div className="rating-icon">⭐</div>
          <h2>Average Store Rating</h2>
          <div className="rating-value-large">
            {dashboard.averageRating > 0
              ? dashboard.averageRating
              : "No ratings yet"}
          </div>
          <p className="rating-subtitle">out of 5.0</p>
        </div>
      </div>

      <div className="card">
        <h2>Customer Ratings ({dashboard.ratings.length})</h2>

        {dashboard.ratings.length === 0 ? (
          <div className="empty-state">
            <h3>No ratings yet</h3>
            <p>Your store hasn't received any ratings from customers</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Rating</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.ratings.map((rating, index) => (
                  <tr key={index}>
                    <td>
                      <strong>{rating.name}</strong>
                    </td>
                    <td>{rating.email}</td>
                    <td>{rating.address}</td>
                    <td>
                      <span className="rating-badge">
                        {"★".repeat(rating.rating)} ({rating.rating}/5)
                      </span>
                    </td>
                    <td>{new Date(rating.updated_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
