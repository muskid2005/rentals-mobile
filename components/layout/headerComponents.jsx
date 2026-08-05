import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useNotificationStore } from "../../store/useNotificationStore";
import { getNotifications } from "../../utils/notificationUtil";

export default function HeaderBar({ name, image, onPress }) {
  const { width } = useWindowDimensions();
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const onNotificationPress = () => router.push("/NotificationsScreen");

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <View style={[styles.header, { width: width }]}>
      <View style={styles.barChild}>
        <Pressable onPress={onPress}>
          <Ionicons name="menu" size={20} color="#0B2554" />
        </Pressable>
        <Text style={styles.headerTitle}>{name}</Text>
      </View>

      <View style={styles.barChild}>
        <TouchableOpacity
          onPress={onNotificationPress}
          style={styles.bellContainer}
        >
          <FontAwesome5 name="bell" size={20} color="#0B2554" />
          {unreadCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>
                {unreadCount > 99 ? "99+" : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <Image
          source={image}
          style={{ width: 32, height: 32, borderRadius: 16 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bellContainer: {
    position: "relative",
    padding: 2,
  },

  notificationBadge: {
    position: "absolute",
    top: -4,
    right: -6,
    backgroundColor: "#E53E3E",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },

  badgeText: {
    color: "#FFFFFF",
    fontFamily: "pBold",
    fontSize: 9,
    textAlign: "center",
  },

  barChild: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    marginBottom: 12,
    paddingHorizontal: 24,
  },

  headerTitle: {
    fontSize: 16,
    fontFamily: "mRegular",
    color: "#0B2554",
  },
});