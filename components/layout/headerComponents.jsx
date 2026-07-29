import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
    useWindowDimensions
} from "react-native";

export default function HeaderBar({ name, image, notificationCount }) {
  const { width } = useWindowDimensions();
  return (
    <View style={[styles.header, { width: width }]}>
      <View style={styles.barChild}>
        <Pressable>
          <Ionicons name="menu" size={20} color="#0B2554" />
        </Pressable>
        <Text style={styles.headerTitle}>{name}</Text>
      </View>

      <View style={styles.barChild}>
        <View>
          <FontAwesome5 name="bell" size={24} color="black" />
          <Text style={styles.notificationBadge}>{notificationCount}</Text>
        </View>

        <Image
          source={image}
          style={{ width: 32, height: 32, borderRadius: 16 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  notificationBadge: {
    position: "absolute",
    top: 0,
    right: -4,
    backgroundColor: "red",
    color: "white",
    borderRadius: 8,
    textAlign: "center",
    width: 12,
    height: 12,
    fontSize: 10,
  },
  barChild: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  container: {
    // flex: 1,
    backgroundColor: "#FFFFFF",
    width: "100%",
    paddingHorizontal: 24,
  },
  content: {
    paddingBottom: 20,
    paddingTop: 10,
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
    fontFamily: "regular",
    color: "#0B2554",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginTop: 10,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    minHeight: 110,
    justifyContent: "space-between",
  },
  darkCard: {
    backgroundColor: "#0B2554",
  },
  lightCard: {
    backgroundColor: "#DCE6F7",
  },
  orangeCard: {
    backgroundColor: "#E8A325",
  },
  statLabel: {
    fontSize: 13,
    color: "#0B2554",
    fontWeight: "600",
  },
  statLabelDark: {
    fontSize: 13,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0B2554",
    marginVertical: 4,
  },
  statValueDark: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0B2554",
    marginVertical: 4,
  },
  statSub: {
    fontSize: 12,
    color: "#0B2554",
  },
  statSubDark: {
    fontSize: 12,
    color: "#0B2554",
  },
  bookingsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#0B2554",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0B2554",
    letterSpacing: 0.5,
  },
  link: {
    fontSize: 12,
    color: "#0B2554",
  },
  requestRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  rentalRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: "#EEE",
    marginRight: 12,
  },
  requestInfo: {
    flex: 1,
    gap: 8,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0B2554",
  },
  requestSub: {
    fontSize: 12,
    color: "#0B2554",
    marginTop: 2,
  },
  requestDates: {
    fontSize: 12,
    color: "#0B2554",
    marginTop: 2,
  },
  returnDate: {
    fontSize: 12,
    color: "#0B2554",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 16,
  },
  acceptButton: {
    backgroundColor: "#0B2554",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  acceptText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },
  declineButton: {
    backgroundColor: "#E8A325",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  declineText: {
    color: "#0B2554",
    fontWeight: "600",
    fontSize: 13,
  },
});
