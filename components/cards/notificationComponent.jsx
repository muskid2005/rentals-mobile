import { StyleSheet, Text, View } from "react-native";

export default function NotificationCard({ title, description, time, unread }) {
  return (
    <View style={styles.card}>
      <View style={styles.imagePlaceholder} />

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {unread && <View style={styles.unreadDot} />}
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>

        <Text style={styles.time}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 16,
    padding: 14,
    width: "80%",
    alignSelf: "center",
    marginVertical: 6,
  },
  imagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#E0E0E0",
    marginRight: 12,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000000",
    flex: 1,
    paddingRight: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#8E8E93",
  },
  description: {
    fontSize: 13,
    color: "#666666",
    lineHeight: 18,
    marginBottom: 6,
  },
  time: {
    fontSize: 11,
    color: "#8E8E93",
  },
});
