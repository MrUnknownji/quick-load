import { Order } from "@/types/Order";

// Dummy Orders
export const ORDERS: Order[] = [
  {
    id: "order1",
    userId: "user1",
    productName: "Bricks",
    quantity: 1000,
    price: 5000,
    status: "pending",
    createdAt: "2023-06-01",
  },
  {
    id: "order2",
    userId: "user1",
    productName: "Grit",
    quantity: 500,
    price: 2500,
    status: "pending",
    createdAt: "2023-06-05",
  },
  {
    id: "order9",
    userId: "user3",
    productName: "Bricks",
    quantity: 2000,
    price: 10000,
    status: "pending",
    createdAt: "2023-06-15",
  },
  {
    id: "order12",
    userId: "user3",
    productName: "Grit",
    quantity: 400,
    price: 2000,
    status: "delivered",
    createdAt: "2023-06-05",
  },
];

const CAROUSEL_IMAGES = [
  {
    uri: `https://quick-load.onrender.com/assets/carousal-image-1.png`,
  },
  {
    uri: `https://quick-load.onrender.com/assets/carousal-image-2.png`,
  },
  {
    uri: `https://quick-load.onrender.com/assets/carousal-image-3.png`,
  },
];

const FEATURES: string[] = [
  "100% quality and pure guarantee",
  "Quantity guarantee",
  "Cheapest price",
  "Secure delivery",
];

export { CAROUSEL_IMAGES, FEATURES };
