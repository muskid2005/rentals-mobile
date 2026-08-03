import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import SafeArea from "../components/common/safeArea";
import { useNotificationStore } from "../store/useNotificationStore";
import {
    getNotifications,
    markAllAsRead,
    markAsRead,
} from "../utils/notificationUtil";

export default function NotificationsScreen() {
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const loading = useNotificationStore((state) => state.loading);

  useEffect(() => {
    getNotifications();
  }, []);

  const handleNotificationPress = async (item) => {
    const id = item.id || item._id;
    if (!item.isRead) {
      await markAsRead(id);
    }
  };

  return (
    <SafeArea>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#0B2554" />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        {unreadCount > 0 ? (
          <TouchableOpacity onPress={() => markAllAsRead()}>
            <Text style={styles.markReadText}>Mark all read</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 60 }} />
        )}
      </View>

      {loading && notifications.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0B2554" />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No notifications yet</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id || item._id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, !item.isRead && styles.unreadCard]}
              onPress={() => handleNotificationPress(item)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>
                  {item.title || "Notification"}
                </Text>
                {!item.isRead && <View style={styles.dot} />}
              </View>
              <Text style={styles.cardBody}>{item.message || item.body}</Text>
              {item.createdAt && (
                <Text style={styles.cardDate}>
                  {new Date(item.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingVertical: 14,
    width: "100%",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0B2554",
  },
  markReadText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0B2554",
  },
  listContent: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#64748B",
  },
  card: {
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  unreadCard: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0B2554",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E53E3E",
  },
  cardBody: {
    fontSize: 13,
    color: "#334155",
    marginBottom: 6,
  },
  cardDate: {
    fontSize: 10,
    color: "#94A3B8",
  },
});
