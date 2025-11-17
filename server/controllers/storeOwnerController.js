const { pool } = require("../config/database");

class StoreOwnerController {
  // Get Store Owner Dashboard
  async getDashboard(req, res) {
    try {
      const storeId = req.user.store_id;

      if (!storeId) {
        return res
          .status(400)
          .json({ message: "User is not associated with any store" });
      }

      // Get average rating
      const avgRating = await pool.query(
        "SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 0) as average_rating FROM ratings WHERE store_id = $1",
        [storeId]
      );

      // Get users who rated the store
      const ratings = await pool.query(
        `
        SELECT 
          u.id, u.name, u.email, u.address,
          r.rating, r.created_at, r.updated_at
        FROM ratings r
        JOIN users u ON r.user_id = u.id
        WHERE r.store_id = $1
        ORDER BY r.updated_at DESC
        `,
        [storeId]
      );

      res.json({
        averageRating: parseFloat(avgRating.rows[0].average_rating),
        ratings: ratings.rows,
      });
    } catch (error) {
      console.error("Get dashboard error:", error);
      res.status(500).json({ message: "Server error fetching dashboard" });
    }
  }
}

module.exports = new StoreOwnerController();
