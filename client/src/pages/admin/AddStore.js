import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateAddress,
} from "../../utils/validation";

const AddStore = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    ownerName: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setApiError("");
  };

  const validateForm = () => {
    const newErrors = {};

    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;

    const ownerNameError = validateName(formData.ownerName);
    if (ownerNameError) newErrors.ownerName = ownerNameError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    const addressError = validateAddress(formData.address);
    if (addressError) newErrors.address = addressError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      await api.post("/admin/stores", formData);
      alert("Store created successfully!");
      navigate("/admin/stores");
    } catch (error) {
      setApiError(error.response?.data?.message || "Failed to create store");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <button
        onClick={() => navigate("/admin/stores")}
        className="btn btn-secondary mb-20"
      >
        ← Back to Stores
      </button>

      <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h1 className="page-title">Add New Store</h1>

        {apiError && <div className="alert alert-error">{apiError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Store Name (20-60 characters) *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter store name"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
            <span className="char-count">{formData.name.length}/60</span>
          </div>

          <div className="form-group">
            <label htmlFor="ownerName">Owner Name (20-60 characters) *</label>
            <input
              type="text"
              id="ownerName"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              placeholder="Enter owner name"
            />
            {errors.ownerName && (
              <span className="error-text">{errors.ownerName}</span>
            )}
            <span className="char-count">{formData.ownerName.length}/60</span>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password (8-16 characters) *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Must include uppercase and special character"
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="address">Address (Max 400 characters) *</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              rows="3"
            />
            {errors.address && (
              <span className="error-text">{errors.address}</span>
            )}
            <span className="char-count">{formData.address.length}/400</span>
          </div>

          <div className="flex-gap">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Store"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/stores")}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStore;
