import { Router } from "express";
import { products } from "../db.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

// All products
router.get("/", (req, res) => res.json(products));

// Product by ID
router.get("/:id", (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (!product) return res.status(404).json({ error: "Not found" });
  res.json(product);
});

// Create product
router.post("/", authRequired, (req, res) => {
  const product = { id: products.length + 1, ...req.body };
  products.push(product);
  res.status(201).json(product);
});

// Update product
router.put("/:id", authRequired, (req, res) => {
  const index = products.findIndex(p => p.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "Not found" });
  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

// Delete product
router.delete("/:id", authRequired, (req, res) => {
  const index = products.findIndex(p => p.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "Not found" });
  products.splice(index, 1);
  res.json({ deleted: true });
});

export default router;
