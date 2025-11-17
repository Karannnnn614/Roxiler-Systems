import React, { useState } from "react";
import "./RatingModal.css";

const RatingModal = ({ store, currentRating, onSubmit, onClose }) => {
  const [rating, setRating] = useState(currentRating || 0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    onSubmit(rating);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal rating-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Rate {store.name}</h2>
        <p className="modal-subtitle">{store.address}</p>

        <div className="rating-section">
          <p className="rating-label">Select your rating:</p>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${
                  star <= (hoverRating || rating) ? "active" : ""
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                ★
              </span>
            ))}
          </div>
          <p className="rating-value">
            {rating > 0 ? `${rating} out of 5` : "No rating selected"}
          </p>
        </div>

        <div className="modal-actions">
          <button onClick={handleSubmit} className="btn btn-primary">
            Submit Rating
          </button>
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
