import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";

const ManageStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ASC",
  });

  useEffect(() => {
    fetchStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortConfig]);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        sortBy: sortConfig.key,
        sortOrder: sortConfig.direction,
      };
      const response = await api.get("/admin/stores", { params });
      setStores(response.data);
    } catch (error) {
      console.error("Error fetching stores:", error);
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

  return (
    <div className="container">
      <div className="flex-between mb-20">
        <h1 className="page-title">Manage Stores</h1>
        <Link to="/admin/add-store" className="btn btn-primary">
          Add New Store
        </Link>
      </div>

      <div className="card">
        <h3>Filters</h3>
        <div className="search-filters">
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Search by store name..."
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
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading">Loading stores...</div>
        ) : stores.length === 0 ? (
          <div className="empty-state">
            <h3>No stores found</h3>
            <p>Try adjusting your filters or add a new store</p>
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
                    Store Name
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
                    className={getSortClass("average_rating")}
                    onClick={() => handleSort("average_rating")}
                  >
                    Rating
                  </th>
                  <th>Total Ratings</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store) => (
                  <tr key={store.id}>
                    <td>
                      <strong>{store.name}</strong>
                    </td>
                    <td>{store.email}</td>
                    <td>{store.address}</td>
                    <td>
                      {store.average_rating > 0 ? (
                        <span className="rating-stars">
                          ★ {store.average_rating}
                        </span>
                      ) : (
                        <span style={{ color: "#9ca3af" }}>No ratings</span>
                      )}
                    </td>
                    <td>{store.total_ratings}</td>
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

export default ManageStores;
