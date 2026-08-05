import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUserStore } from "../../store/useStore";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.75;

const OWNER_MENU = [
  { id: "/dashboard", label: "Dashboard" },
  { id: "/my-listings", label: "My Equipment" },
  { id: "/wallet", label: "Wallet" },
  { id: "/Inspection", label: "Return Inspection" },
  // { id: "/calendar", label: "Calendar" },
  { id: "/notifications", label: "Notifications" },
  { id: "/reviews", label: "Reviews" },
];

const RENTER_MENU = [
  { id: "/dashboard", label: "Dashboard" },
  { id: "/myBookings", label: "My Bookings" },
  { id: "/savedItems", label: "Saved Equipment" },
  { id: "/wallet", label: "Wallet" },
  { id: "/NotificationsScreen", label: "Notifications" },
  { id: "/reviews", label: "Reviews" },
];

const BOTTOM_MENU = [
  { id: "/settings", label: "Settings" },
  { id: "/help", label: "Help & Support" },
  { id: "/about", label: "About TrustLend" },
];

export default function Sidebar({
  visible,
  role = "owner",
  onClose,
  onNavigate,
}) {
  const { user, logout } = useUserStore();
  const currentPathname = usePathname();

  const fName = user?.firstName ? user.firstName.toUpperCase() : "";
  const lName = user?.lastName ? user.lastName.toUpperCase() : "";
  const fullName = fName || lName ? `${fName} ${lName}` : "Guest User";

  // Check if username (or username field) lowercase is equal to 'verified'
  const username = (user?.username || user?.firstName || "").toLowerCase();
  const isVerifiedUser = username === "verified";

  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(-SIDEBAR_WIDTH);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: -SIDEBAR_WIDTH,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      if (onClose) onClose();
    });
  };

  const rawMenuItems = role === "owner" ? OWNER_MENU : RENTER_MENU;

  // Filter out "My Equipment" and "Return Inspection" if username isn't 'verified'
  const menuItems = isVerifiedUser
    ? rawMenuItems
    : rawMenuItems.filter(
        (item) => item.id !== "/my-listings" && item.id !== "/Inspection"
      );

  function handleSelect(id) {
    if (onNavigate) {
      handleClose();
      onNavigate(id);
    }
  }

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={handleClose}
      animationType="none"
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />

        <Animated.View
          style={[styles.container, { transform: [{ translateX: slideAnim }] }]}
        >
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <Image
                source={require("../../assets/images/Logo.png.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Text style={styles.brandName}>
                Trust<Text style={styles.brandAccent}>Lend</Text>
              </Text>
            </View>

            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#0B2554" />
            </TouchableOpacity>
          </View>

          <View style={styles.userSection}>
            <Image
              source={
                user?.profilePhotoUrl && user?.profilePhotoUrl !== ""
                  ? { uri: user?.profilePhotoUrl }
                  : require("../../assets/images/profile.jpg")
              }
              style={styles.avatar}
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{fullName}</Text>
              <Text style={styles.userRole}>
                {role === "owner" ? "Owner" : "Renter"}
              </Text>

              <View style={styles.verifiedBadge}>
                <MaterialIcons name="verified" size={12} color="#88997D" />
                <Text style={styles.verifiedText}>
                  Verified {role === "owner" ? "Owner" : "Renter"}
                </Text>
              </View>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.menuContent}
          >
            {menuItems.map((item) => {
              const isActive =
                currentPathname === item.id ||
                currentPathname?.toLowerCase() === item.id.toLowerCase();
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.menuItem, isActive && styles.activeMenuItem]}
                  onPress={() => handleSelect(item.id)}
                >
                  <Text
                    style={[styles.menuText, isActive && styles.activeMenuText]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <View style={styles.divider} />

            {BOTTOM_MENU.map((item) => {
              const isActive =
                currentPathname === item.id ||
                currentPathname?.toLowerCase() === item.id.toLowerCase();
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.menuItem, isActive && styles.activeMenuItem]}
                  onPress={() => handleSelect(item.id)}
                >
                  <Text
                    style={[styles.menuText, isActive && styles.activeMenuText]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={() => {
                handleClose();
                logout();
                router.dismissAll("/login");
              }}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    flexDirection: "row",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    width: SIDEBAR_WIDTH,
    height: "100%",
    backgroundColor: "#FFFFFF",
    paddingTop: 50,
    paddingHorizontal: 20,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    zIndex: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  logoImage: {
    width: 28,
    height: 28,
  },
  brandName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0B2554",
  },
  brandAccent: {
    color: "#E8A325",
  },
  closeBtn: {
    padding: 4,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0B2554",
  },
  userRole: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 1,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFFE0",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  verifiedText: {
    fontSize: 10,
    color: "#88997D",
    fontWeight: "600",
  },
  menuContent: {
    paddingBottom: 30,
    gap: 6,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  activeMenuItem: {
    backgroundColor: "#E8A325",
  },
  menuText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0B2554",
  },
  activeMenuText: {
    color: "#0B2554",
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F3F8",
    marginVertical: 12,
  },
  logoutBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#EF4444",
  },
});