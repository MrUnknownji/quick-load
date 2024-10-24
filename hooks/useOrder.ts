import { useState, useCallback } from "react";
import {
  addNewOrder,
  getOrders,
  getOrdersByUser,
  updateOrder,
} from "../services/orderService";
import { Order, OrderResponse, OrderListResponse } from "../types/Order";

export const useOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  const createOrder = useCallback(
    async (orderData: Order): Promise<OrderResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await addNewOrder(orderData);
        setOrders((prevOrders) => [...prevOrders, response.order]);
        return response;
      } catch (err) {
        setError("Failed to create order");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchAllOrders = useCallback(async (): Promise<OrderListResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await getOrders();
      setOrders(response.orders);
      return response;
    } catch (err) {
      setError("Failed to fetch orders");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserOrders = useCallback(
    async (userId: string): Promise<OrderListResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await getOrdersByUser(userId);
        setOrders(response.orders);
        return response;
      } catch (err) {
        setError("Failed to fetch user orders");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const updateOrderStatus = useCallback(
    async (
      orderId: string,
      status: Order["status"],
    ): Promise<OrderResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await updateOrder(orderId, status);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status } : order,
          ),
        );
        return response;
      } catch (err) {
        setError("Failed to update order status");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    orders,
    loading,
    error,
    createOrder,
    fetchAllOrders,
    fetchUserOrders,
    updateOrderStatus,
  };
};
