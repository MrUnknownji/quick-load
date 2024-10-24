export interface Order {
  _id?: string;
  userId: string;
  productOwnerId: string;
  productId: string;
  productPrice: number;
  productSize: string;
  productQuantity: number;
  productType: string;
  loadingCharge: number;
  brokerCharge: number;
  platformCharge: number;
  totalAmount?: number;
  status?: "pending" | "completed" | "canceled";
}

export interface OrderResponse {
  message: string;
  order: Order;
}

export interface OrderListResponse {
  resultMessage: {
    en: string;
    tr: string;
  };
  resultCode: string;
  orders: Order[];
}
