const { Pool } = require("pg");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function initializeDatabase() {
  const client = await pool.connect();

  try {
    console.log("🔄 Connected to PostgreSQL database...");

    // Read SQL file
    const sqlFile = path.join(__dirname, "config", "database.postgresql.sql");
    const sqlContent = fs.readFileSync(sqlFile, "utf8");

    console.log(`📝 Executing SQL file...`);

    // Execute entire SQL file at once
    await client.query(sqlContent);

    console.log("\n✅ Database initialized successfully!");
    console.log("\n🔐 Default Admin Credentials:");
    console.log("   Email: admin@system.com");
    console.log("   Password: Admin@123");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run initialization
initializeDatabase()
  .then(() => {
    console.log(
      "\n✨ Setup complete! You can now start the server with 'npm run dev'"
    );
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Setup failed:", error);
    process.exit(1);
  });
