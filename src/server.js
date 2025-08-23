import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import catalogRouter from "./routes/catalog.js";

// Моки для практики
export const users = [];
export const carts = [];
export const cartItems = [];
export const favorites = [];
export const products = [
  {
    id: 1,
    name: "Футболка Красная",
    description: "Удобная хлопковая футболка",
    price: 20,
    discount_price: 15,
    stock_quantity: 50,
    sizes: ["S", "M", "L"],
    images: [
      "https://via.placeholder.com/150/FF0000/FFFFFF?text=Red+Tshirt",
      "https://via.placeholder.com/150/FF6666/FFFFFF?text=Red+Tshirt",
    ],
    stars: 4.5,
  },
  {
    id: 2,
    name: "Джинсы Синие",
    description: "Стильные синие джинсы",
    price: 40,
    discount_price: 35,
    stock_quantity: 30,
    sizes: ["M", "L", "XL"],
    images: ["https://via.placeholder.com/150/0000FF/FFFFFF?text=Blue+Jeans"],
    stars: 4.7,
  },
];
export const reviews = [];

dotenv.config();
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Swagger
const swaggerDocument = YAML.load("./src/swagger.yaml");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Маршруты
import authRoutes from "./routes/auth.js";
import cartRoutes from "./routes/cart.js";
import favoritesRoutes from "./routes/favorites.js";
import reviewsRoutes from "./routes/reviews.js";

app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/catalog", catalogRouter);

// Главная страница
app.get("/", (req, res) => {
  res.json({ status: "ok", docs: "/docs" });
});

// Запуск сервера
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
