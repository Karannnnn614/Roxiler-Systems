const { pool } = require("../config/database");
const bcrypt = require("bcryptjs");

class AdminController {
  // Dashboard Statistics
  async getDashboardStats(req, res) {
    try {
      const userCount = await pool.query(
        "SELECT COUNT(*) as total FROM users WHERE role != $1",
        ["admin"]
      );

      const storeCount = await pool.query(
        "SELECT COUNT(*) as total FROM stores"
      );

      const ratingCount = await pool.query(
        "SELECT COUNT(*) as total FROM ratings"
      );

      res.json({
        totalUsers: parseInt(userCount.rows[0].total),
        totalStores: parseInt(storeCount.rows[0].total),
        totalRatings: parseInt(ratingCount.rows[0].total),
      });
    } catch (error) {
      console.error("Dashboard stats error:", error);
      res
        .status(500)
        .json({ message: "Server error fetching dashboard stats" });
    }
  }

  // Create User (Admin/Normal User)
  async createUser(req, res) {
    try {
      const { name, email, password, address, role } = req.body;

      // Check if user already exists
      const existingUser = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
      );

      if (existingUser.rows.length > 0) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      const result = await pool.query(
        "INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [name, email, hashedPassword, address, role]
      );

      res.status(201).json({
        message: "User created successfully",
        userId: result.rows[0].id,
      });
    } catch (error) {
      console.error("Create user error:", error);
      res.status(500).json({ message: "Server error creating user" });
    }
  }

  // Create Store
  async createStore(req, res) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const { name, email, address, password, ownerName } = req.body;

      // Check if store email already exists
      const existingStore = await client.query(
        "SELECT id FROM stores WHERE email = $1",
        [email]
      );

      if (existingStore.rows.length > 0) {
        await client.query("ROLLBACK");
        return res
          .status(400)
          .json({ message: "Store with this email already exists" });
      }

      // Create store owner user
      const hashedPassword = await bcrypt.hash(password, 10);
      const userResult = await client.query(
        "INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [ownerName, email, hashedPassword, address, "store_owner"]
      );

      const ownerId = userResult.rows[0].id;

      // Create store
      const storeResult = await client.query(
        "INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING id",
        [name, email, address, ownerId]
      );

      const storeId = storeResult.rows[0].id;

      // Update user with store_id
      await client.query("UPDATE users SET store_id = $1 WHERE id = $2", [
        storeId,
        ownerId,
      ]);

      await client.query("COMMIT");

      res.status(201).json({
        message: "Store created successfully",
        storeId,
        ownerId,
      });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Create store error:", error);
      res.status(500).json({ message: "Server error creating store" });
    } finally {
      client.release();
    }
  }

  // Get All Stores with Ratings
  async getStores(req, res) {
    try {
      const {
        name,
        email,
        address,
        sortBy = "name",
        sortOrder = "ASC",
      } = req.query;

      let query = "SELECT * FROM store_ratings_view WHERE 1=1";
      const params = [];
      let paramCount = 1;

      if (name) {
        query += ` AND name ILIKE $${paramCount}`;
        params.push(`%${name}%`);
        paramCount++;
      }
      if (email) {
        query += ` AND email ILIKE $${paramCount}`;
        params.push(`%${email}%`);
        paramCount++;
      }
      if (address) {
        query += ` AND address ILIKE $${paramCount}`;
        params.push(`%${address}%`);
        paramCount++;
      }

      const validSortColumns = ["name", "email", "address", "average_rating"];
      const sortColumn = validSortColumns.includes(sortBy) ? sortBy : "name";
      const order = sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC";

      query += ` ORDER BY ${sortColumn} ${order}`;

      const stores = await pool.query(query, params);
      res.json(stores.rows);
    } catch (error) {
      console.error("Get stores error:", error);
      res.status(500).json({ message: "Server error fetching stores" });
    }
  }

  // Get All Users
  async getUsers(req, res) {
    try {
      const {
        name,
        email,
        address,
        role,
        sortBy = "name",
        sortOrder = "ASC",
      } = req.query;

      let query = `
        SELECT u.id, u.name, u.email, u.address, u.role, u.store_id,
               COALESCE(sr.average_rating, 0) as rating
        FROM users u
        LEFT JOIN stores s ON u.store_id = s.id
        LEFT JOIN store_ratings_view sr ON s.id = sr.id
        WHERE 1=1
      `;
      const params = [];
      let paramCount = 1;

      if (name) {
        query += ` AND u.name ILIKE $${paramCount}`;
        params.push(`%${name}%`);
        paramCount++;
      }
      if (email) {
        query += ` AND u.email ILIKE $${paramCount}`;
        params.push(`%${email}%`);
        paramCount++;
      }
      if (address) {
        query += ` AND u.address ILIKE $${paramCount}`;
        params.push(`%${address}%`);
        paramCount++;
      }
      if (role) {
        query += ` AND u.role = $${paramCount}`;
        params.push(role);
        paramCount++;
      }

      const validSortColumns = ["name", "email", "address", "role"];
      const sortColumn = validSortColumns.includes(sortBy) ? sortBy : "name";
      const order = sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC";

      query += ` ORDER BY u.${sortColumn} ${order}`;

      const users = await pool.query(query, params);
      res.json(users.rows);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ message: "Server error fetching users" });
    }
  }

  // Get User Details
  async getUserDetails(req, res) {
    try {
      const { id } = req.params;

      const users = await pool.query(
        `
        SELECT u.id, u.name, u.email, u.address, u.role, u.store_id,
               COALESCE(sr.average_rating, 0) as rating
        FROM users u
        LEFT JOIN stores s ON u.store_id = s.id
        LEFT JOIN store_ratings_view sr ON s.id = sr.id
        WHERE u.id = $1
        `,
        [id]
      );

      if (users.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(users.rows[0]);
    } catch (error) {
      console.error("Get user details error:", error);
      res.status(500).json({ message: "Server error fetching user details" });
    }
  }
}

module.exports = new AdminController();
