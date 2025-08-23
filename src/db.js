// src/db.js
export let products = [
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
      "https://via.placeholder.com/150/FF6666/FFFFFF?text=Red+Tshirt"
    ],
    stars: 4.5
  },
  {
    id: 2,
    name: "Джинсы Синие",
    description: "Стильные джинсы с высокой талией",
    price: 50,
    discount_price: 45,
    stock_quantity: 30,
    sizes: ["M", "L", "XL"],
    images: [
      "https://via.placeholder.com/150/0000FF/FFFFFF?text=Blue+Jeans"
    ],
    stars: 4.0
  },
  {
    id: 3,
    name: "Кроссовки Белые",
    description: "Лёгкие спортивные кроссовки",
    price: 70,
    discount_price: 65,
    stock_quantity: 20,
    sizes: ["40", "41", "42", "43"],
    images: [
      "https://via.placeholder.com/150/FFFFFF/000000?text=White+Sneakers"
    ],
    stars: 4.7
  },
  {
    id: 4,
    name: "Куртка Чёрная",
    description: "Тёплая зимняя куртка",
    price: 120,
    discount_price: 110,
    stock_quantity: 15,
    sizes: ["M", "L", "XL"],
    images: [
      "https://via.placeholder.com/150/000000/FFFFFF?text=Black+Jacket"
    ],
    stars: 4.8
  }
];

export const users = [];
export const passwordResets = [];
export const carts = [];
export const cartItems = [];
export const favorites = [];
export const reviews = [];
export const categories = [
  { id: 1, name: "Одежда", parent_id: null },
  { id: 2, name: "Футболки", parent_id: 1 },
  { id: 3, name: "Штаны", parent_id: 1 },
  { id: 4, name: "Обувь", parent_id: null },
];