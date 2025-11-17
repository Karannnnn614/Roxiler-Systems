import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ASC",
  });

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortConfig]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        sortBy: sortConfig.key,
        sortOrder: sortConfig.direction,
      };
      const response = await api.get("/admin/users", { params });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "ASC" ? "DESC" : "ASC",
    }));
  };

  const getSortClass = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ASC" ? "sort-asc" : "sort-desc";
    }
    return "sortable";
  };

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
      <div className="flex-between mb-20">
        <h1 className="page-title">Manage Users</h1>
        <Link to="/admin/add-user" className="btn btn-primary">
          Add New User
        </Link>
      </div>

      <div className="card">
        <h3>Filters</h3>
        <div className="search-filters">
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Search by name..."
              value={filters.name}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="email"
              placeholder="Search by email..."
              value={filters.email}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="address"
              placeholder="Search by address..."
              value={filters.address}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <select
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="store_owner">Store Owner</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <h3>No users found</h3>
            <p>Try adjusting your filters</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th
                    className={getSortClass("name")}
                    onClick={() => handleSort("name")}
                  >
                    Name
                  </th>
                  <th
                    className={getSortClass("email")}
                    onClick={() => handleSort("email")}
                  >
                    Email
                  </th>
                  <th
                    className={getSortClass("address")}
                    onClick={() => handleSort("address")}
                  >
                    Address
                  </th>
                  <th
                    className={getSortClass("role")}
                    onClick={() => handleSort("role")}
                  >
                    Role
                  </th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.address}</td>
                    <td>
                      <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                        {user.role.replace("_", " ")}
                      </span>
                    </td>
                    <td>
                      {user.role === "store_owner" && user.rating > 0 ? (
                        <span className="rating-stars">★ {user.rating}</span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      <Link
                        to={`/admin/users/${user.id}`}
                        className="btn btn-secondary"
                        style={{ padding: "6px 12px", fontSize: "12px" }}
                      >
                        View Details
                      </Link>
                    </td>
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

export default ManageUsers;
