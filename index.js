require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Порт
const PORT = process.env.PORT || 3000;

// БД
const db = new sqlite3.Database('./database.db');

// Создание таблиц
db.run(`CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  parent_id INTEGER,
  FOREIGN KEY(parent_id) REFERENCES categories(id)
)`);

db.run(`CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  discount INTEGER DEFAULT 0,
  stock INTEGER DEFAULT 0,
  image_url TEXT,
  FOREIGN KEY(category_id) REFERENCES categories(id)
)`);

//////////////////////
// CATEGORIES ROUTES
//////////////////////

app.get('/categories', (req, res) => {
  db.all(`SELECT * FROM categories`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/categories/:id', (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM categories WHERE id = ?`, [id], (err, row) => {
    if (!row) return res.status(404).json({ error: 'Категория не найдена' });
    res.json(row);
  });
});

app.post('/categories', (req, res) => {
  const { name, parent_id } = req.body;
  if (!name) return res.status(400).json({ error: 'Название обязательно' });

  db.run(`INSERT INTO categories (name, parent_id) VALUES (?, ?)`,
    [name, parent_id || null],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, name, parent_id });
    }
  );
});

app.put('/categories/:id', (req, res) => {
  const { id } = req.params;
  const { name, parent_id } = req.body;
  db.run(`UPDATE categories SET name = ?, parent_id = ? WHERE id = ?`,
    [name, parent_id || null, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Категория не найдена' });
      res.json({ message: 'Категория обновлена' });
    }
  );
});

app.delete('/categories/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM categories WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Категория не найдена' });
    res.json({ message: 'Категория удалена' });
  });
});

//////////////////////
// PRODUCTS ROUTES
//////////////////////

app.get('/products', (req, res) => {
  db.all(`SELECT * FROM products`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/products/:id', (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM products WHERE id = ?`, [id], (err, row) => {
    if (!row) return res.status(404).json({ error: 'Товар не найден' });
    res.json(row);
  });
});

app.post('/products', (req, res) => {
  const { category_id, name, price, discount, stock, image_url } = req.body;
  if (!name || !price) return res.status(400).json({ error: 'Название и цена обязательны' });

  db.run(
    `INSERT INTO products (category_id, name, price, discount, stock, image_url)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [category_id || null, name, price, discount || 0, stock || 0, image_url || null],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, name, price });
    }
  );
});

app.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const { category_id, name, price, discount, stock, image_url } = req.body;
  db.run(
    `UPDATE products SET category_id=?, name=?, price=?, discount=?, stock=?, image_url=? WHERE id=?`,
    [category_id || null, name, price, discount, stock, image_url, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Товар не найден' });
      res.json({ message: 'Товар обновлен' });
    }
  );
});

app.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM products WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Товар не найден' });
    res.json({ message: 'Товар удалён' });
  });
});

// Продукты по категории
app.get('/products/category/:categoryId', (req, res) => {
  const { categoryId } = req.params;

  db.get(`SELECT * FROM categories WHERE id = ?`, [categoryId], (err, category) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!category) return res.status(404).json({ error: 'Категория не найдена' });

    db.all(`SELECT * FROM products WHERE category_id = ?`, [categoryId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });
});

// Базовые категории
const baseCategories = [
  "Одежда",
  "Обувь",
  "Электроника",
  "Книги",
  "Дом и интерьер",
  "Красота и здоровье",
  "Спорт и отдых"
];

baseCategories.forEach(name => {
  db.run(`INSERT OR IGNORE INTO categories (name) VALUES (?)`, [name], err => {
    if (err) console.log('Ошибка при добавлении категории:', err);
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
  console.log(`📖 Swagger: http://localhost:${PORT}/api-docs`);
});