import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useUserStore } from "./useStore"; // Update path if needed

export const useBookingStore = create(
  persist(
    (set, get) => ({
      bookings: [],
      accepted: false,
      isLoading: false,

      // Setters
      setAccepted: (status) => set({ accepted: status }),

      // Example fetcher using your existing userStore's apiFetch
      fetchBookings: async () => {
        set({ isLoading: true });
        const { apiFetch } = useUserStore.getState();

        const { response, error } = await apiFetch("/owner/bookings", {
          method: "GET",
        });

        if (error) {
          set({ isLoading: false });
          return { success: false, error };
        }

        try {
          const result = await response.json();
          if (response.ok) {
            set({
              bookings: result.data || [],
              isLoading: false,
            });
            return { success: true, data: result.data };
          } else {
            set({ isLoading: false });
            return {
              success: false,
              error: result.message || "Failed to fetch bookings.",
            };
          }
        } catch (err) {
          set({ isLoading: false });
          return {
            success: false,
            error: "Failed to parse bookings response.",
          };
        }
      },

      // Reset state on logout
      resetBookingStore: () => {
        set({
          bookings: [],
          accepted: false,
          isLoading: false,
        });
      },
    }),
    {
      name: "booking-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
