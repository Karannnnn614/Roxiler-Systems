const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function checkAdmin() {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role FROM users WHERE email = $1",
      ["admin@system.com"]
    );

    console.log("\n🔍 Admin User Check:");
    if (result.rows.length > 0) {
      console.log("✅ Admin user exists:");
      console.log(result.rows[0]);
    } else {
      console.log("❌ Admin user NOT found!");
      console.log("\n📝 Creating admin user...");

      const bcrypt = require("bcryptjs");
      const hashedPassword = await bcrypt.hash("Admin@123", 10);

      const insertResult = await pool.query(
        "INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role",
        [
          "System Administrator",
          "admin@system.com",
          hashedPassword,
          "System Administration Office",
          "admin",
        ]
      );

      console.log("✅ Admin user created:");
      console.log(insertResult.rows[0]);
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await pool.end();
  }
}

checkAdmin();
