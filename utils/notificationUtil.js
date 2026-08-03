import { useNotificationStore } from "../store/useNotificationStore";

export const getNotifications = () => {
  return useNotificationStore.getState().fetchNotifications();
};

export const markAsRead = (notificationId) => {
  return useNotificationStore.getState().markNotificationAsRead(notificationId);
};

export const markAllAsRead = () => {
  return useNotificationStore.getState().markAllAsRead();
};
