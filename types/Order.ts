export interface Order {
  id: string;
  userId: string;
  productName: string;
  quantity: number;
  price: number;
  status: "pending" | "delivered";
  createdAt: string;
}
