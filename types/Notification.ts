export interface Notification {
  _id: string;
  type: string;
  hi_message: string;
  en_message: string;
  userId: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationRequest {
  type: string;
  hi_message: string;
  en_message: string;
  userId: string;
}

export interface UpdateNotificationRequest {
  isRead: boolean;
}

export interface NotificationResponse {
  message: string;
  notifications: Notification[];
}

export interface SendNotificationResponse {
  message: string;
  notification: Notification;
}

export interface UpdateNotificationResponse {
  message: string;
  notification: Notification;
}
