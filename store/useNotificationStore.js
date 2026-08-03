import { create } from "zustand";
import { useUserStore } from "./useStore";

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true });
    const { apiFetch } = useUserStore.getState();

    const { response, error } = await apiFetch("/notifications", {
      method: "GET",
    });

    set({ loading: false });

    if (error) return { success: false, error };

    try {
      const result = await response.json();
      if (response.ok) {
        const notificationsList = result.data || result || [];
        const unread = Array.isArray(notificationsList)
          ? notificationsList.filter((n) => !n.isRead).length
          : 0;

        set({
          notifications: notificationsList,
          unreadCount: unread,
        });

        return { success: true, data: notificationsList };
      }
      return { success: false, error: result.message };
    } catch (err) {
      return { success: false, error: "Failed to parse response" };
    }
  },

  markNotificationAsRead: async (notificationId) => {
    const { apiFetch } = useUserStore.getState();
    const { fetchNotifications } = get();

    const { response, error } = await apiFetch(
      `/notifications/${notificationId}/read`,
      {
        method: "PATCH",
      },
    );

    if (error) return { success: false, error };

    try {
      const result = await response.json();
      if (response.ok) {
        await fetchNotifications();
        return { success: true, data: result.data || result };
      }
      return { success: false, error: result.message };
    } catch (err) {
      return { success: false, error: "Failed to update notification" };
    }
  },

  markAllAsRead: async () => {
    const { apiFetch } = useUserStore.getState();
    const { fetchNotifications } = get();

    const { response, error } = await apiFetch("/notifications/read-all", {
      method: "PATCH",
    });

    if (error) return { success: false, error };

    try {
      const result = await response.json();
      if (response.ok) {
        await fetchNotifications();
        return { success: true, data: result.data || result };
      }
      return { success: false, error: result.message };
    } catch (err) {
      return { success: false, error: "Failed to update notifications" };
    }
  },
}));
