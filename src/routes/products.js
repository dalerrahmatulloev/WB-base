import { Router } from "express";
import { products } from "../db.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();
const productsRouter = Router();

// GET /api/catalog/products
productsRouter.get("/", (req, res) => res.json(products));

// GET /api/catalog/products/:id
productsRouter.get("/:id", (req, res) => {
  const product = products.find((p) => p.id == req.params.id);
  if (!product) return res.status(404).json({ error: "Not found" });
  res.json(product);
});

// POST /api/catalog/products
productsRouter.post("/", authRequired, (req, res) => {
  const product = { id: products.length + 1, ...req.body };
  products.push(product);
  res.status(201).json(product);
});

// PUT /api/catalog/products/:id
productsRouter.put("/:id", authRequired, (req, res) => {
  const index = products.findIndex((p) => p.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "Not found" });
  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

// DELETE /api/catalog/products/:id
productsRouter.delete("/:id", authRequired, (req, res) => {
  const index = products.findIndex((p) => p.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "Not found" });
  products.splice(index, 1);
  res.json({ deleted: true });
});

// Вложенный путь: /api/catalog/products
router.use("/products", productsRouter);

export default router;
