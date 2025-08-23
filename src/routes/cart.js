import { Router } from "express";
import { carts, cartItems, products } from "../db.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();
router.use(authRequired);

// Ensure cart exists
function ensureCart(userId) {
  let cart = carts.find(c => c.user_id === userId);
  if (!cart) {
    cart = { id: carts.length + 1, user_id: userId };
    carts.push(cart);
  }
  return cart;
}

// Get cart
router.get("/", (req, res) => {
  const cart = ensureCart(req.user.id);
  const items = cartItems
    .filter(ci => ci.cart_id === cart.id)
    .map(ci => {
      const product = products.find(p => p.id === ci.product_id);
      return { ...ci, ...product };
    });
  res.json({ cart_id: cart.id, items });
});

// Add/update item
router.post("/items", (req, res) => {
  const { product_id, size, quantity } = req.body;
  const cart = ensureCart(req.user.id);
  let item = cartItems.find(
    ci => ci.cart_id === cart.id && ci.product_id === product_id && ci.size === (size || null)
  );
  if (item) {
    item.quantity = quantity;
    return res.json(item);
  } else {
    item = { id: cartItems.length + 1, cart_id: cart.id, product_id, size: size || null, quantity };
    cartItems.push(item);
    return res.status(201).json(item);
  }
});

// Remove item
router.delete("/items/:id", (req, res) => {
  const index = cartItems.findIndex(ci => ci.id == req.params.id);
  if (index !== -1) cartItems.splice(index, 1);
  res.json({ deleted: true });
});

// Clear cart
router.delete("/", (req, res) => {
  const cart = ensureCart(req.user.id);
  for (let i = cartItems.length - 1; i >= 0; i--) {
    if (cartItems[i].cart_id === cart.id) cartItems.splice(i, 1);
  }
  res.json({ cleared: true });
});

export default router;
