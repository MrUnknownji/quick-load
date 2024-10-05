import { useState, useEffect, useCallback } from "react";
import {
  getNotifications,
  createNotification,
  updateNotificationStatus,
} from "../services/notificationService";
import {
  Notification,
  NotificationRequest,
  UpdateNotificationRequest,
} from "../types/Notification";

export const useFetchNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const refetch = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    loading,
    error,
    refetch,
    setNotifications,
  };
};

export const useSendNotification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendNotification = async (notificationData: NotificationRequest) => {
    setLoading(true);
    try {
      const result = await createNotification(notificationData);
      setLoading(false);
      return result;
    } catch (err) {
      console.error("Error sending notification:", err);
      setError("Failed to send notification");
      setLoading(false);
    }
  };

  return { sendNotification, loading, error };
};

export const useUpdateNotification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateNotification = async (
    notificationId: string,
    updateData: UpdateNotificationRequest,
  ) => {
    setLoading(true);
    try {
      const result = await updateNotificationStatus(notificationId, updateData);
      setLoading(false);
      return result;
    } catch (err) {
      console.error("Error updating notification:", err);
      setError("Failed to update notification");
      setLoading(false);
    }
  };

  return { updateNotification, loading, error };
};
