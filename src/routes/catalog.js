import { Router } from "express";
import { categories, products } from "../db.js";

const router = Router();

// Все категории с подкатегориями
router.get("/categories", (req, res) => {
  const main = categories.filter(c => c.parent_id === null).map(cat => ({
    ...cat,
    subcategories: categories.filter(sc => sc.parent_id === cat.id)
  }));
  res.json(main);
});

// Продукты по категории
router.get("/products", (req, res) => {
  const { category_id } = req.query;
  let filtered = products;
  if (category_id) {
    filtered = products.filter(p => p.category_id == category_id);
  }
  res.json(filtered);
});

export default router;
