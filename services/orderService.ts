import {
  createOrder,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
} from "../api/orderApi";
import { Order, OrderResponse, OrderListResponse } from "../types/Order";

export const addNewOrder = async (orderData: Order): Promise<OrderResponse> => {
  return await createOrder(orderData);
};

export const getOrders = async (): Promise<OrderListResponse> => {
  return await getAllOrders();
};

export const getOrdersByUser = async (
  userId: string,
): Promise<OrderListResponse> => {
  return await getUserOrders(userId);
};

export const updateOrder = async (
  orderId: string,
  status: Order["status"],
): Promise<OrderResponse> => {
  return await updateOrderStatus(orderId, status);
};
