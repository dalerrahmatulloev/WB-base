import { query, one } from "./db.js";
import bcrypt from "bcryptjs";

export async function runMigrations() {
  // Create tables if not exists
  await query(`
CREATE TABLE IF NOT EXISTS users (
id BIGSERIAL PRIMARY KEY,
name VARCHAR(100) NOT NULL,
email VARCHAR(150) UNIQUE NOT NULL,
password_hash TEXT NOT NULL,
created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS password_resets (
id BIGSERIAL PRIMARY KEY,
user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
reset_token TEXT UNIQUE NOT NULL,
expires_at TIMESTAMP NOT NULL,
created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS categories (
id BIGSERIAL PRIMARY KEY,
name VARCHAR(100) NOT NULL UNIQUE
);


CREATE TABLE IF NOT EXISTS subcategories (
id BIGSERIAL PRIMARY KEY,
category_id BIGINT REFERENCES categories(id) ON DELETE CASCADE,
name VARCHAR(100) NOT NULL,
UNIQUE(category_id, name)
);


CREATE TABLE IF NOT EXISTS products (
id BIGSERIAL PRIMARY KEY,
subcategory_id BIGINT REFERENCES subcategories(id) ON DELETE SET NULL,
name VARCHAR(200) NOT NULL,
description TEXT,
price DECIMAL(10,2) NOT NULL,
discount_price DECIMAL(10,2),
stock_quantity INT DEFAULT 0,
sizes TEXT[],
created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS product_images (
id BIGSERIAL PRIMARY KEY,
product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
image_url TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS reviews (
id BIGSERIAL PRIMARY KEY,
product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
rating INT CHECK (rating BETWEEN 0 AND 5),
comment TEXT,
created_at TIMESTAMP DEFAULT NOW(),
UNIQUE(product_id, user_id)
);

CREATE TABLE IF NOT EXISTS favorites (
user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
created_at TIMESTAMP DEFAULT NOW(),
PRIMARY KEY(user_id, product_id)
);


CREATE TABLE IF NOT EXISTS carts (
id BIGSERIAL PRIMARY KEY,
user_id BIGINT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS cart_items (
id BIGSERIAL PRIMARY KEY,
cart_id BIGINT REFERENCES carts(id) ON DELETE CASCADE,
product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
size TEXT,
quantity INT CHECK (quantity > 0),
UNIQUE(cart_id, product_id, size)
);
`);
}

export async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) return;
  const existing = await one("SELECT * FROM users WHERE email=$1", [
    adminEmail,
  ]);
  if (!existing) {
    const hash = await bcrypt.hash(adminPassword, 10);
    await query(
      "INSERT INTO users(name, email, password_hash) VALUES ($1,$2,$3)",
      ["Admin", adminEmail, hash]
    );
    console.log("Seeded admin user");
  }
}
