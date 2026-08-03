import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import SafeArea from "../components/common/safeArea";
import Sidebar from "../components/common/sideBar";
import HeaderBar from "../components/layout/headerComponents";
import { useBookingStore } from "../store/bookingStore";
import { useUserStore } from "../store/useStore";

export default function WalletScreen() {
  const { user, apiFetch } = useUserStore();
  const { accepted } = useBookingStore();
  const { width } = useWindowDimensions();

  const isOwner = user?.lastName?.toLowerCase() === "verified";

  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWalletData = async () => {
    if (!refreshing) setLoading(true);
    try {
      // Endpoint logic wrapped safely with failover
      const { response: bookingRes, error: bookingErr } =
        await apiFetch("/owner/bookings");

      if (bookingErr) {
        Alert.alert("Error", bookingErr);
        return;
      }
    } catch (err) {
      Alert.alert("Error", err?.message || "Failed to fetch data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchWalletData();
    }, [apiFetch]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchWalletData();
  };

  return (
    <SafeArea>
      <HeaderBar
        name="Wallet"
        image={
          user?.profilePhotoUrl
            ? { uri: user.profilePhotoUrl }
            : require("../assets/images/profile.jpg")
        }
        onPress={() => setMenuOpen(true)}
        onNotificationPress={() => router.push("/NotificationsScreen")}
      />

      <Sidebar
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        role={isOwner ? "owner" : "renter"}
        onNavigate={(routeId) => {
          setMenuOpen(false);
          router.replace(routeId);
        }}
      />

      <View style={[styles.container, { width }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Header Section */}
          <View style={styles.topHeader}>
            <View>
              <Text style={styles.screenTitle}>
                {isOwner ? "Earnings & Wallet" : "Wallet & Spend"}
              </Text>
              <Text style={styles.screenSubtitle}>
                {isOwner
                  ? "Manage your balance and payout settings"
                  : "Track your active rentals and payment methods"}
              </Text>
            </View>
          </View>

          {/* Balance Summary Card */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>
              {isOwner ? "AVAILABLE BALANCE" : "TOTAL SPENT"}
            </Text>

            <View style={styles.balanceRow}>
              <Text style={styles.balanceAmount}>₦0</Text>
              <Text style={styles.balanceDecimal}>.00</Text>
            </View>

            {/* Render Pending/Earned sub-cards ONLY for Owners */}
            {isOwner && (
              <View style={styles.subCardRow}>
                <View style={styles.subCard}>
                  <Text style={styles.subCardLabel}>Pending</Text>
                  <Text style={styles.subCardValue}>
                    {accepted ? "₦270,000" : "₦230,000"}
                  </Text>
                </View>

                <View style={styles.subCard}>
                  <Text style={styles.subCardLabel}>Earned</Text>
                  <Text style={styles.subCardValue}>₦0.00</Text>
                </View>
              </View>
            )}
          </View>

          {/* Quick Action Row */}
          <View style={styles.actionRow}>
            {isOwner ? (
              <>
                <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
                  <Ionicons
                    name="arrow-down-circle-outline"
                    size={22}
                    color="#0B2554"
                  />
                  <Text style={styles.actionLabel}>Withdraw</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
                  <Ionicons
                    name="add-circle-outline"
                    size={22}
                    color="#0B2554"
                  />
                  <Text style={styles.actionLabel}>Add Account</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
                  <Ionicons name="time-outline" size={22} color="#0B2554" />
                  <Text style={styles.actionLabel}>History</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
                  <Ionicons name="card-outline" size={22} color="#0B2554" />
                  <Text style={styles.actionLabel}>Payment Methods</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
                  <Ionicons name="receipt-outline" size={22} color="#0B2554" />
                  <Text style={styles.actionLabel}>Invoices</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
                  <Ionicons name="time-outline" size={22} color="#0B2554" />
                  <Text style={styles.actionLabel}>History</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Active Rentals Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ACTIVE RENTALS</Text>
            <View style={styles.card}>
              {loading ? (
                <ActivityIndicator
                  size="small"
                  color="#0B2554"
                  style={{ paddingVertical: 20 }}
                />
              ) : (
                <View style={styles.rentalRow}>
                  <Image
                    source={require("../assets/images/Sony.png")}
                    style={styles.itemImage}
                  />
                  <View style={styles.requestInfo}>
                    <Text style={styles.itemName} numberOfLines={1}>
                      Sony FX3
                    </Text>
                    <Text style={styles.requestSub} numberOfLines={1}>
                      Renter: Esa M.
                    </Text>
                  </View>
                  <Text style={styles.returnDate}>Returns Jul 25</Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.viewAllBtn}
                onPress={() => router.push("/(tabs)/dashboard")}
              >
                <Text style={styles.viewAllText}>View all on dashboard →</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Transactions Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>RECENT TRANSACTIONS</Text>
            <View style={styles.card}>
              <View style={styles.emptyContainer}>
                <Ionicons name="receipt-outline" size={36} color="#94A3B8" />
                <Text style={styles.emptyTitle}>No Transactions</Text>
                <Text style={styles.emptySubtitle}>
                  {isOwner
                    ? "Your payout and withdrawal history will appear here."
                    : "Your rental payments and receipt history will appear here."}
                </Text>
              </View>
            </View>
          </View>

          {/* Main Action Button */}
          {isOwner && (
            <TouchableOpacity
              style={styles.withdrawButton}
              activeOpacity={0.85}
            >
              <Text style={styles.withdrawButtonText}>Withdraw Funds</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  topHeader: {
    marginTop: 12,
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0B2554",
  },
  screenSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },

  /* Balance Card */
  balanceCard: {
    backgroundColor: "#0B2554",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  balanceLabel: {
    color: "#94A3B8",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 6,
    marginBottom: 16,
  },
  balanceAmount: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
  },
  balanceDecimal: {
    color: "#94A3B8",
    fontSize: 18,
    fontWeight: "600",
  },
  subCardRow: {
    flexDirection: "row",
    gap: 10,
  },
  subCard: {
    flex: 1,
    backgroundColor: "#173770",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  subCardLabel: {
    color: "#94A3B8",
    fontSize: 11,
    marginBottom: 2,
  },
  subCardValue: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  /* Quick Actions Row */
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
  },
  actionItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  actionLabel: {
    fontSize: 11,
    color: "#0B2554",
    fontWeight: "600",
  },

  /* Sections */
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },

  /* Active Rentals Item */
  rentalRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  itemImage: {
    width: 44,
    height: 44,
    borderRadius: 10,
    resizeMode: "cover",
  },
  requestInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0B2554",
  },
  requestSub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  returnDate: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0B2554",
  },
  viewAllBtn: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  viewAllText: {
    color: "#0B2554",
    fontWeight: "700",
    fontSize: 12,
  },

  /* Empty State */
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0B2554",
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
  },

  /* Withdraw Button */
  withdrawButton: {
    backgroundColor: "#0B2554",
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  withdrawButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
});
