-- PostgreSQL Database Schema for Store Rating Platform
-- Execute this in your Neon PostgreSQL database

-- Drop existing tables if needed (for fresh start)
-- DROP TABLE IF EXISTS ratings CASCADE;
-- DROP TABLE IF EXISTS stores CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  address VARCHAR(400) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'store_owner')),
  store_id INTEGER NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Stores Table
CREATE TABLE IF NOT EXISTS stores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  address VARCHAR(400) NOT NULL,
  owner_id INTEGER NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for stores table
CREATE INDEX IF NOT EXISTS idx_stores_name ON stores(name);
CREATE INDEX IF NOT EXISTS idx_stores_owner ON stores(owner_id);

-- Ratings Table
CREATE TABLE IF NOT EXISTS ratings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  store_id INTEGER NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, store_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);

-- Create indexes for ratings table
CREATE INDEX IF NOT EXISTS idx_ratings_store ON ratings(store_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user ON ratings(user_id);

-- Insert Default Admin User (password: Admin@123)
-- Note: Password is pre-hashed with bcrypt
INSERT INTO users (name, email, password, address, role) 
VALUES (
  'System Administrator',
  'admin@system.com',
  '$2a$10$8YvZhIQxlVqVPR7XLmKxCeVPHQsGxOHZLqHMZ9p4dLPMFYt8YQNMa',
  'System Administration Office',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Create View for Store Ratings
CREATE OR REPLACE VIEW store_ratings_view AS
SELECT 
  s.id,
  s.name,
  s.email,
  s.address,
  s.owner_id,
  COALESCE(ROUND(AVG(r.rating)::numeric, 2), 0) as average_rating,
  COUNT(r.id) as total_ratings,
  s.created_at,
  s.updated_at
FROM stores s
LEFT JOIN ratings r ON s.id = r.store_id
GROUP BY s.id, s.name, s.email, s.address, s.owner_id, s.created_at, s.updated_at;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_stores_updated_at ON stores;
CREATE TRIGGER update_stores_updated_at
  BEFORE UPDATE ON stores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ratings_updated_at ON ratings;
CREATE TRIGGER update_ratings_updated_at
  BEFORE UPDATE ON ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Sample Data (Optional - for testing)
/*
-- Sample Users
INSERT INTO users (name, email, password, address, role) VALUES
('John Doe', 'john@example.com', '$2a$10$8YvZhIQxlVqVPR7XLmKxCeVPHQsGxOHZLqHMZ9p4dLPMFYt8YQNMa', '123 Main St, City', 'user'),
('Jane Smith', 'jane@example.com', '$2a$10$8YvZhIQxlVqVPR7XLmKxCeVPHQsGxOHZLqHMZ9p4dLPMFYt8YQNMa', '456 Oak Ave, Town', 'store_owner')
ON CONFLICT (email) DO NOTHING;

-- Sample Stores
INSERT INTO stores (name, email, address, owner_id) VALUES
('Best Buy Electronics', 'bestbuy@example.com', '789 Tech Plaza, Downtown', 2),
('Green Grocers', 'green@example.com', '321 Fresh Market, Uptown', NULL)
ON CONFLICT (email) DO NOTHING;

-- Sample Ratings
INSERT INTO ratings (user_id, store_id, rating) VALUES
(1, 1, 5),
(1, 2, 4)
ON CONFLICT (user_id, store_id) DO NOTHING;
*/
