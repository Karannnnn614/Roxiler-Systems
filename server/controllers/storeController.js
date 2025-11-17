const { pool } = require("../config/database");

class StoreController {
  // Get All Stores (for normal users)
  async getAllStores(req, res) {
    try {
      const { name, address, sortBy = "name", sortOrder = "ASC" } = req.query;
      const userId = req.user.id;

      let query = `
        SELECT 
          sr.id, sr.name, sr.address, sr.average_rating,
          r.rating as user_rating
        FROM store_ratings_view sr
        LEFT JOIN ratings r ON sr.id = r.store_id AND r.user_id = $1
        WHERE 1=1
      `;
      const params = [userId];
      let paramCount = 2;

      if (name) {
        query += ` AND sr.name ILIKE $${paramCount}`;
        params.push(`%${name}%`);
        paramCount++;
      }
      if (address) {
        query += ` AND sr.address ILIKE $${paramCount}`;
        params.push(`%${address}%`);
        paramCount++;
      }

      const validSortColumns = ["name", "address", "average_rating"];
      const sortColumn = validSortColumns.includes(sortBy) ? sortBy : "name";
      const order = sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC";

      query += ` ORDER BY sr.${sortColumn} ${order}`;

      const stores = await pool.query(query, params);
      res.json(stores.rows);
    } catch (error) {
      console.error("Get stores error:", error);
      res.status(500).json({ message: "Server error fetching stores" });
    }
  }

  // Submit or Update Rating
  async submitRating(req, res) {
    try {
      const { storeId, rating } = req.body;
      const userId = req.user.id;

      // Check if store exists
      const stores = await pool.query("SELECT id FROM stores WHERE id = $1", [
        storeId,
      ]);

      if (stores.rows.length === 0) {
        return res.status(404).json({ message: "Store not found" });
      }

      // Insert or update rating using PostgreSQL UPSERT
      await pool.query(
        `INSERT INTO ratings (user_id, store_id, rating) 
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, store_id) 
         DO UPDATE SET rating = $3, updated_at = CURRENT_TIMESTAMP`,
        [userId, storeId, rating]
      );

      res.json({ message: "Rating submitted successfully" });
    } catch (error) {
      console.error("Submit rating error:", error);
      res.status(500).json({ message: "Server error submitting rating" });
    }
  }
}

module.exports = new StoreController();
