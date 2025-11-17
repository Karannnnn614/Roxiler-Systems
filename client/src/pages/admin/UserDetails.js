import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      const response = await api.get(`/admin/users/${id}`);
      setUser(response.data);
    } catch (err) {
      setError("Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading user details...</div>;
  }

  if (error || !user) {
    return (
      <div className="container">
        <div className="alert alert-error">{error || "User not found"}</div>
        <button
          onClick={() => navigate("/admin/users")}
          className="btn btn-secondary"
        >
          Back to Users
        </button>
      </div>
    );
  }

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "admin":
        return "badge-admin";
      case "store_owner":
        return "badge-store-owner";
      default:
        return "badge-user";
    }
  };

  return (
    <div className="container">
      <button
        onClick={() => navigate("/admin/users")}
        className="btn btn-secondary mb-20"
      >
        ← Back to Users
      </button>

      <div className="card">
        <h1 className="page-title">User Details</h1>

        <div style={{ maxWidth: "600px" }}>
          <div className="form-group">
            <label>
              <strong>Name:</strong>
            </label>
            <p>{user.name}</p>
          </div>

          <div className="form-group">
            <label>
              <strong>Email:</strong>
            </label>
            <p>{user.email}</p>
          </div>

          <div className="form-group">
            <label>
              <strong>Address:</strong>
            </label>
            <p>{user.address}</p>
          </div>

          <div className="form-group">
            <label>
              <strong>Role:</strong>
            </label>
            <p>
              <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                {user.role.replace("_", " ")}
              </span>
            </p>
          </div>

          {user.role === "store_owner" && (
            <div className="form-group">
              <label>
                <strong>Store Rating:</strong>
              </label>
              <p>
                {user.rating > 0 ? (
                  <span className="rating-stars">★ {user.rating} / 5.0</span>
                ) : (
                  "No ratings yet"
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
