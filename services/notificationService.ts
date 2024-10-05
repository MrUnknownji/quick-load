import {
  fetchNotifications,
  sendNotification,
  updateNotification,
} from "../api/notificationApi";
import {
  Notification,
  NotificationRequest,
  UpdateNotificationRequest,
} from "@/types/Notification";

export const getNotifications = async (): Promise<Notification[]> => {
  return await fetchNotifications();
};

export const createNotification = async (
  notificationData: NotificationRequest,
): Promise<Notification> => {
  return await sendNotification(notificationData);
};

export const updateNotificationStatus = async (
  notificationId: string,
  updateData: UpdateNotificationRequest,
): Promise<Notification> => {
  return await updateNotification(notificationId, updateData);
};
