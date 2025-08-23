import { Router } from "express";
import { favorites, products } from "../db.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();
router.use(authRequired);

// Get favorites
router.get("/", (req, res) => {
  const favs = favorites
    .filter(f => f.user_id === req.user.id)
    .map(f => products.find(p => p.id === f.product_id));
  res.json(favs);
});

// Add to favorites
router.post("/", (req, res) => {
  const { product_id } = req.body;
  if (!favorites.find(f => f.user_id === req.user.id && f.product_id === product_id)) {
    favorites.push({ user_id: req.user.id, product_id });
  }
  res.status(201).json({ added: true });
});

// Remove from favorites
router.delete("/:product_id", (req, res) => {
  const index = favorites.findIndex(f => f.user_id === req.user.id && f.product_id == req.params.product_id);
  if (index !== -1) favorites.splice(index, 1);
  res.json({ removed: true });
});

export default router;
