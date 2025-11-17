import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import RatingModal from "../../components/RatingModal";
import "./UserStores.css";

const UserStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: "",
    address: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ASC",
  });
  const [selectedStore, setSelectedStore] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);

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
      const response = await api.get("/stores", { params });
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

  const openRatingModal = (store) => {
    setSelectedStore(store);
    setShowRatingModal(true);
  };

  const handleRatingSubmit = async (rating) => {
    try {
      await api.post("/stores/rating", {
        storeId: selectedStore.id,
        rating,
      });
      alert("Rating submitted successfully!");
      setShowRatingModal(false);
      fetchStores(); // Refresh the list
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit rating");
    }
  };

  const renderStars = (rating) => {
    if (!rating || rating === 0) {
      return <span style={{ color: "#9ca3af" }}>No ratings yet</span>;
    }
    return (
      <span className="rating-stars">
        {"★".repeat(Math.floor(rating))}
        {rating % 1 !== 0 && "½"} {rating.toFixed(2)}
      </span>
    );
  };

  return (
    <div className="container">
      <h1 className="page-title">Browse Stores</h1>

      <div className="card">
        <h3>Search Stores</h3>
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
            <p>Try adjusting your search filters</p>
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
                    className={getSortClass("address")}
                    onClick={() => handleSort("address")}
                  >
                    Address
                  </th>
                  <th
                    className={getSortClass("average_rating")}
                    onClick={() => handleSort("average_rating")}
                  >
                    Overall Rating
                  </th>
                  <th>Your Rating</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store) => (
                  <tr key={store.id}>
                    <td>
                      <strong>{store.name}</strong>
                    </td>
                    <td>{store.address}</td>
                    <td>{renderStars(store.average_rating)}</td>
                    <td>
                      {store.user_rating ? (
                        <span className="user-rating">
                          ★ {store.user_rating}
                        </span>
                      ) : (
                        <span style={{ color: "#9ca3af" }}>Not rated</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => openRatingModal(store)}
                        className="btn btn-primary"
                        style={{ padding: "6px 12px", fontSize: "12px" }}
                      >
                        {store.user_rating ? "Update Rating" : "Rate Store"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showRatingModal && (
        <RatingModal
          store={selectedStore}
          currentRating={selectedStore.user_rating}
          onSubmit={handleRatingSubmit}
          onClose={() => setShowRatingModal(false)}
        />
      )}
    </div>
  );
};

export default UserStores;
