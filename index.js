require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Порт
const PORT = process.env.PORT || 3000;

// Подключение к БД
const db = new sqlite3.Database('./database.db');

//////////////////////
// Создание таблиц
//////////////////////
db.serialize(() => {
  // Категории
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    parent_id INTEGER,
    FOREIGN KEY(parent_id) REFERENCES categories(id)
  )`);

  // Бренды
  db.run(`CREATE TABLE IF NOT EXISTS brands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  )`);

  // Продавцы
  db.run(`CREATE TABLE IF NOT EXISTS sellers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    store_name TEXT,
    rating REAL DEFAULT 0
  )`);

  // Пользователи
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    address TEXT,
    phone TEXT
  )`);

  // Товары
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
    brand_id INTEGER,
    seller_id INTEGER,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    discount INTEGER DEFAULT 0,
    stock INTEGER DEFAULT 0,
    image_url TEXT,
    reviews INTEGER DEFAULT 0,
    overallRating REAL DEFAULT 0,
    colors TEXT, -- JSON: ["red","blue"]
    sizes TEXT,  -- JSON: ["S","M","L"]
    gender TEXT CHECK(gender IN ('Мужской', 'Женский', 'Детский')),
    FOREIGN KEY(category_id) REFERENCES categories(id),
    FOREIGN KEY(brand_id) REFERENCES brands(id),
    FOREIGN KEY(seller_id) REFERENCES sellers(id)
  )`);

  // Отзывы
  db.run(`CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    product_id INTEGER,
    rating INTEGER CHECK(rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  )`);

  // Корзина
  db.run(`CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    product_id INTEGER,
    quantity INTEGER DEFAULT 1,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  )`);

  // Заказы
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    total REAL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  // Состав заказа
  db.run(`CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    price REAL,
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  )`);
});

//////////////////////
// ROUTES
//////////////////////

// Категории
app.get('/categories', (req, res) => {
  db.all(`SELECT * FROM categories`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Бренды
app.get('/brands', (req, res) => {
  db.all(`SELECT * FROM brands`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Товары + фильтры
app.get('/products', (req, res) => {
  let query = `SELECT p.*, b.name AS brand_name, c.name AS category_name
               FROM products p
               LEFT JOIN brands b ON p.brand_id = b.id
               LEFT JOIN categories c ON p.category_id = c.id
               WHERE 1=1`;
  let params = [];

  if (req.query.category_id) {
    query += ` AND p.category_id = ?`;
    params.push(req.query.category_id);
  }
  if (req.query.brand_id) {
    query += ` AND p.brand_id = ?`;
    params.push(req.query.brand_id);
  }
  if (req.query.min_price) {
    query += ` AND p.price >= ?`;
    params.push(req.query.min_price);
  }
  if (req.query.max_price) {
    query += ` AND p.price <= ?`;
    params.push(req.query.max_price);
  }
  if (req.query.gender) {
    query += ` AND p.gender = ?`;
    params.push(req.query.gender);
  }

  if (req.query.sort === 'price_asc') {
    query += ` ORDER BY p.price ASC`;
  } else if (req.query.sort === 'price_desc') {
    query += ` ORDER BY p.price DESC`;
  } else if (req.query.sort === 'rating') {
    query += ` ORDER BY p.overallRating DESC`;
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Товар по id
app.get('/products/:id', (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM products WHERE id = ?`, [id], (err, row) => {
    if (!row) return res.status(404).json({ error: 'Товар не найден' });
    res.json(row);
  });
});

// Добавление товара
app.post('/products', (req, res) => {
  const { category_id, brand_id, seller_id, name, price, stock } = req.body;
  if (!name || !price) return res.status(400).json({ error: 'Название и цена обязательны' });

  db.run(
    `INSERT INTO products (category_id, brand_id, seller_id, name, price, stock)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [category_id || null, brand_id || null, seller_id || null, name, price, stock || 0],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, name, price });
    }
  );
});

//////////////////////
// Базовые данные
//////////////////////
const baseCategories = [
  "Одежда", "Обувь", "Электроника", "Книги", "Дом и интерьер",
  "Красота и здоровье", "Спорт и отдых"
];
baseCategories.forEach(name => {
  db.run(`INSERT OR IGNORE INTO categories (name) VALUES (?)`, [name]);
});

const baseBrands = ["Nike", "Adidas", "Samsung", "Apple", "Sony", "Zara"];
baseBrands.forEach(name => {
  db.run(`INSERT OR IGNORE INTO brands (name) VALUES (?)`, [name]);
});

//////////////////////
// Запуск сервера
//////////////////////
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
  console.log(`📖 Swagger: http://localhost:${PORT}/api-docs`);
});