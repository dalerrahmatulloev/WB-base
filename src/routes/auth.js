import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { users, passwordResets } from "../db.js";

const router = Router();

// Register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "Missing fields" });

  if (users.find(u => u.email === email))
    return res.status(409).json({ error: "Email already used" });

  const hash = await bcrypt.hash(password, 10);
  const user = { id: users.length + 1, name, email, password_hash: hash };
  users.push(user);
  res.status(201).json({ id: user.id, name: user.name, email: user.email });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });
  res.json({ token });
});

// Forgot password
router.post("/forgot", (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ error: "User not found" });

  const token = uuidv4();
  const expires = new Date(Date.now() + 1000 * 60 * 30);
  passwordResets.push({ user_id: user.id, reset_token: token, expires_at: expires });
  res.json({ reset_token: token, expires_at: expires });
});

// Reset password
router.post("/reset", async (req, res) => {
  const { token, new_password } = req.body;
  const pr = passwordResets.find(pr => pr.reset_token === token && pr.expires_at > new Date());
  if (!pr) return res.status(400).json({ error: "Invalid or expired token" });

  const user = users.find(u => u.id === pr.user_id);
  user.password_hash = await bcrypt.hash(new_password, 10);

  passwordResets.splice(passwordResets.indexOf(pr), 1);
  res.json({ status: "password_updated" });
});

export default router;
