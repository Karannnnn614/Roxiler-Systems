import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect based on role
  React.useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "store_owner") {
        navigate("/store-owner/dashboard");
      } else if (user.role === "user") {
        navigate("/stores");
      }
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>🏪 Store Rating Platform</h1>
        <p>Redirecting to your dashboard...</p>
      </div>
    </div>
  );
};

export default Home;
