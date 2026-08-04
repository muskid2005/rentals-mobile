import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { BASE_URL } from "../config/api";

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: (responsePayload) => {
        const { accessToken, refreshToken, user } = responsePayload.data;
        set({
          user: user,
          accessToken: accessToken,
          refreshToken: refreshToken,
          isAuthenticated: true,
        });
      },

      getValidAccessToken: async () => {
        const { accessToken, refreshToken, logout } = get();

        if (!accessToken) return null;

        const isExpired = checkTokenExpired(accessToken);
        if (!isExpired) return accessToken;

        if (!refreshToken) {
          await logout();
          return null;
        }

        try {
          const res = await fetch(`${BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });

          const result = await res.json();

          if (res.ok && result.data?.accessToken) {
            set({
              accessToken: result.data.accessToken,
              refreshToken: result.data.refreshToken || refreshToken,
            });
            return result.data.accessToken;
          } else {
            await logout();
            return null;
          }
        } catch (err) {
          await logout();
          return null;
        }
      },

      apiFetch: async (endpoint, options = {}) => {
        const { getValidAccessToken } = get();
        const token = await getValidAccessToken();

        if (!token) {
          return { error: "Session expired or missing token." };
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          ...options.headers,
        };

        if (headers["Content-Type"] === undefined) {
          delete headers["Content-Type"];
        } else if (!headers["Content-Type"]) {
          headers["Content-Type"] = "application/json";
        }

        try {
          const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers,
          });

          return { response };
        } catch (err) {
          return { error: err.message || "Network connection failed." };
        }
      },

      deleteData: async (path, id) => {
        const { apiFetch } = get();

        if (!path) {
          return { success: false, error: "Path is required." };
        }

        // Ensures no trailing or double slashes when constructing the endpoint
        const formattedPath = path.startsWith("/") ? path : `/${path}`;
        const endpoint = id ? `${formattedPath}/${id}` : formattedPath;

        const { response, error: networkError } = await apiFetch(endpoint, {
          method: "DELETE",
        });

        if (networkError) {
          return { success: false, error: networkError };
        }

        try {
          const result = await response.json();

          if (response.ok) {
            return { success: true, data: result.data || result };
          } else {
            return {
              success: false,
              error: result.message || "Failed to delete item.",
            };
          }
        } catch (err) {
          // Safely handles 204 No Content responses with no JSON body
          if (response.ok) {
            return { success: true };
          }
          return {
            success: false,
            error: "Failed to parse response from server.",
          };
        }
      },

      fetchCurrentUser: async () => {
        const { apiFetch } = get();

        const { response, error: networkError } = await apiFetch("/users/me", {
          method: "GET",
        });

        if (networkError) {
          return { success: false, error: networkError };
        }

        try {
          const result = await response.json();

          if (response.ok) {
            const fullUserData = result.data || result;

            set((state) => ({
              user: { ...state.user, ...fullUserData },
            }));

            return { success: true, data: fullUserData };
          } else {
            return {
              success: false,
              error: result.message || "Failed to fetch user profile.",
            };
          }
        } catch (err) {
          return {
            success: false,
            error: "Failed to parse response from server.",
          };
        }
      },

      logout: async () => {
        const { apiFetch } = get();

        try {
          await apiFetch("/auth/logout", {
            method: "POST",
          });
        } catch (err) {
          // ignore logout network errors to guarantee state reset
        }

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });

        return { success: true };
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

function checkTokenExpired(token) {
  try {
    const payloadBase64 = token.split(".")[1];
    const decodedJson = atob(payloadBase64);
    const decoded = JSON.parse(decodedJson);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp - 10 < currentTime;
  } catch (e) {
    return true;
  }
}
