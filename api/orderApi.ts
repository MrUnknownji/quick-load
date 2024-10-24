import { authApiClient } from "./apiClient";
import { Order, OrderResponse, OrderListResponse } from "../types/Order";

export const createOrder = async (orderData: Order): Promise<OrderResponse> => {
  const response = await authApiClient.post("/order/add", orderData);
  return response.data;
};

export const getAllOrders = async (): Promise<OrderListResponse> => {
  const response = await authApiClient.get("/order/list");
  return response.data;
};

export const getUserOrders = async (
  userId: string,
): Promise<OrderListResponse> => {
  const response = await authApiClient.get(`/order/list/${userId}`);
  return response.data;
};

export const updateOrderStatus = async (
  orderId: string,
  status: Order["status"],
): Promise<OrderResponse> => {
  const response = await authApiClient.put(`/order/${orderId}`, { status });
  return response.data;
};
