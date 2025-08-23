import { Router } from "express";
import { reviews, products, users } from "../db.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

// Get reviews for a product
router.get("/:product_id", (req, res) => {
  const productReviews = reviews
    .filter(r => r.product_id == req.params.product_id)
    .map(r => ({
      ...r,
      author: users.find(u => u.id === r.user_id)?.name || "Unknown"
    }))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(productReviews);
});

// Add review
router.post("/:product_id", authRequired, (req, res) => {
  const { rating, comment } = req.body;
  const review = {
    id: reviews.length + 1,
    product_id: Number(req.params.product_id),
    user_id: req.user.id,
    rating,
    comment: comment || null,
    created_at: new Date()
  };
  reviews.push(review);
  res.status(201).json(review);
});

// Update review
router.put("/:id", authRequired, (req, res) => {
  const review = reviews.find(r => r.id == req.params.id && r.user_id === req.user.id);
  if (!review) return res.status(404).json({ error: "Not found" });

  review.rating = req.body.rating ?? review.rating;
  review.comment = req.body.comment ?? review.comment;
  res.json(review);
});

// Delete review
router.delete("/:id", authRequired, (req, res) => {
  const index = reviews.findIndex(r => r.id == req.params.id && r.user_id === req.user.id);
  if (index !== -1) reviews.splice(index, 1);
  res.json({ deleted: true });
});

export default router;
