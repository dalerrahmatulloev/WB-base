import jwt from "jsonwebtoken";
import { users } from "../db.js";

export function authRequired(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = users.find(u => u.id === decoded.id);
    if (!req.user) return res.status(401).json({ error: "User not found" });
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
