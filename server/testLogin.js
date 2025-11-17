const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function testLogin() {
  try {
    const email = "admin@system.com";
    const password = "Admin@123";

    console.log("\n🔐 Testing Login...");
    console.log("Email:", email);
    console.log("Password:", password);

    const result = await pool.query(
      "SELECT id, name, email, password, role FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      console.log("❌ User not found!");
      return;
    }

    const user = result.rows[0];
    console.log("\n✅ User found:", user.name);

    const isValid = await bcrypt.compare(password, user.password);
    console.log("\n🔑 Password match:", isValid ? "✅ YES" : "❌ NO");

    if (isValid) {
      console.log("\n✅ Login would succeed!");
    } else {
      console.log("\n❌ Login would fail - password mismatch");
      console.log("\nStored hash:", user.password);

      // Create correct hash
      const correctHash = await bcrypt.hash(password, 10);
      console.log("\nUpdating password...");
      await pool.query("UPDATE users SET password = $1 WHERE email = $2", [
        correctHash,
        email,
      ]);
      console.log("✅ Password updated! Try logging in again.");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await pool.end();
  }
}

testLogin();
