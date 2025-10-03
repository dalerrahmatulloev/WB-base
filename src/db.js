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
      "https://sizcentr.ru/upload/iblock/499/499a004dc9e0a870033df579f8f5b688.png",
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
      "https://cdn-sh1.vigbo.com/shops/3903/products/22445701/images/3-b1340da8fd82d77620107c308a4b9b5a.jpg",
      "https://cdn-sh1.vigbo.com/shops/3903/products/22445701/images/3-cc2d56573fe99a1db62d0bf3db991f8c.jpg"
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
      "https://kotofey.ru/images/cms/thumbs/2ae37496c9f0a5a59178026a00b75c71f4c80a02/ef201e699db011ee8c18ac1f6bd8bc11_ef201efa9db011ee8c18ac1f6bd8bc11_556_555_jpg_5_80.jpg",
      "https://kotofey.ru/images/cms/thumbs/2ae37496c9f0a5a59178026a00b75c71f4c80a02/ef201e699db011ee8c18ac1f6bd8bc11_ef201efa9db011ee8c18ac1f6bd8bc11_263_263_jpg_5_80.jpg",
      "https://kotofey.ru/images/cms/thumbs/2ae37496c9f0a5a59178026a00b75c71f4c80a02/ef201e699db011ee8c18ac1f6bd8bc11_ef201f319db011ee8c18ac1f6bd8bc11_263_263_jpg_5_80.jpg",
      "https://kotofey.ru/images/cms/thumbs/2ae37496c9f0a5a59178026a00b75c71f4c80a02/ef201e699db011ee8c18ac1f6bd8bc11_ef201f689db011ee8c18ac1f6bd8bc11_263_263_jpg_5_80.jpg",
      "https://kotofey.ru/images/cms/thumbs/2ae37496c9f0a5a59178026a00b75c71f4c80a02/ef201e699db011ee8c18ac1f6bd8bc11_ef201f9f9db011ee8c18ac1f6bd8bc11_263_263_jpg_5_80.jpg"
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
      "https://charisma.ua/image/cache/catalog/S2237%202XX%2099/IMG_3278%20copy-1100x1400.jpg",
      "https://charisma.ua/image/cache/catalog/S2237%202XX%2099/IMG_3273%20copy-1100x1400.jpg"
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