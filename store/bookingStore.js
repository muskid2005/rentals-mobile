import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useUserStore } from "./useStore";

export const useBookingStore = create(
  persist(
    (set, get) => ({
      bookings: [],
      accepted: false,
      isLoading: false,

      setAccepted: (status) => set({ accepted: status }),

      fetchBookings: async () => {
        set({ isLoading: true });

        // Retrieve current user and apiFetch from useUserStore
        const { user, apiFetch } = useUserStore.getState();

        // Check if user is owner based on your app's verified check
        const isOwner = user?.lastName?.trim().toLowerCase() === "verified";

        // Determine dynamic endpoint
        const endpoint = isOwner ? "/owner/bookings" : "/bookings/my";

        const { response, error } = await apiFetch(endpoint, {
          method: "GET",
        });

        if (error) {
          console.log("Fetch Error:", error);
          set({ isLoading: false });
          return { success: false, error };
        }

        try {
          const result = await response.json();
          console.log("RAW BACKEND RESPONSE:", JSON.stringify(result, null, 2));

          if (response.ok) {
            // Extracts array from result.data or fallback array
            const bookingsArray = Array.isArray(result.data)
              ? result.data
              : Array.isArray(result)
                ? result
                : [];

            set({
              bookings: bookingsArray,
              isLoading: false,
            });
            return { success: true, data: bookingsArray };
          } else {
            set({ isLoading: false });
            return {
              success: false,
              error: result.message || "Failed to fetch bookings.",
            };
          }
        } catch (err) {
          console.log("Parse Error:", err);
          set({ isLoading: false });
          return {
            success: false,
            error: "Failed to parse bookings response.",
          };
        }
      },

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
