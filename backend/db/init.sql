-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone_number VARCHAR(20),
  city VARCHAR(100),
  state VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create items table for swipe/discovery
CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category VARCHAR(100),
  condition VARCHAR(100),
  size VARCHAR(10),
  owner_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create swipes table for tracking likes/passes
CREATE TABLE IF NOT EXISTS swipes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  item_id INTEGER REFERENCES items(id),
  action VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, item_id)
);

-- Create refresh_tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  token TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample items for testing
INSERT INTO items (title, description, price, image_url, category, condition, size, owner_id)
VALUES 
  ('Vintage Denim Jacket', 'Pre-loved in excellent condition', 45.00, 'https://images.unsplash.com/photo-1576995853127-5a05cc87aae9?w=500', 'Outerwear', 'Excellent', 'M', 1),
  ('Summer Linen Shirt', 'Light and breathable', 25.00, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500', 'Tops', 'Good', 'L', 1),
  ('Classic Black Blazer', 'Perfect for office wear', 35.00, 'https://images.unsplash.com/photo-1591047139829-d91aecb6ca5d?w=500', 'Outerwear', 'Like New', 'M', 1)
ON CONFLICT DO NOTHING;