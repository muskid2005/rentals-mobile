import AntDesign from "@expo/vector-icons/AntDesign";
import { StyleSheet, Text, View } from "react-native";

export default function ReviewCard({
  name,
  badgeText,
  rating,
  timeAgo,
  comment,
  itemName,
}) {
  const initial = name ? name.charAt(0).toUpperCase() : "U";

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>

        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badgeText}</Text>
            </View>
          </View>

          <View style={styles.ratingRow}>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <AntDesign
                  key={star}
                  name="star"
                  size={12}
                  color={star <= rating ? "#EAAA08" : "#E5E5EA"}
                  style={styles.starIcon}
                />
              ))}
            </View>
            <Text style={styles.timeAgo}>{timeAgo}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.comment}>{comment}</Text>

      <Text style={styles.itemName}>{itemName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    width: "80%",
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000000",
    marginRight: 8,
  },
  badge: {
    borderWidth: 1,
    borderColor: "#8E8E93",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#000000",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
    marginRight: 8,
  },
  starIcon: {
    marginRight: 2,
  },
  timeAgo: {
    fontSize: 11,
    color: "#666666",
  },
  comment: {
    fontSize: 12,
    color: "#333333",
    lineHeight: 18,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#000000",
  },
});
