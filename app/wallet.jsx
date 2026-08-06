import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from "react-native";
import SafeArea from "../components/common/safeArea";
import Sidebar from "../components/common/sideBar";
import HeaderBar from "../components/layout/headerComponents";
import { useUserStore } from "../store/useStore";

export default function WalletScreen() {
  const { user, apiFetch } = useUserStore();
  const { width } = useWindowDimensions();

  const isOwner = user?.lastName?.toLowerCase() === "verified";

  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Dynamic States
  const [balance, setBalance] = useState(0);
  const [pendingBalance, setPendingBalance] = useState(0);
  const [earnedBalance, setEarnedBalance] = useState(0);
  const [activeRental, setActiveRental] = useState(null);

  const fetchWalletData = async () => {
    if (!refreshing) setLoading(true);
    try {
      if (isOwner) {
        const { response: walletRes } = await apiFetch("/owner/wallet");
        const { response: bookingsRes } = await apiFetch("/owner/bookings");

        if (walletRes?.ok) {
          const wData = await walletRes.json();
          setBalance(wData.data?.availableBalance || 0);
          setPendingBalance(wData.data?.pendingBalance || 0);
          setEarnedBalance(wData.data?.totalEarned || 0);
        }

        if (bookingsRes?.ok) {
          const bData = await bookingsRes.json();
          const active = bData.data?.find((b) => b.status === "active");
          setActiveRental(active || null);
        }
      } else {
        const { response: walletRes } = await apiFetch("/renter/wallet");
        const { response: bookingsRes } = await apiFetch("/renter/bookings");

        if (walletRes?.ok) {
          const wData = await walletRes.json();
          setBalance(wData.data?.totalSpent || 0);
        }

        if (bookingsRes?.ok) {
          const bData = await bookingsRes.json();
          const active = bData.data?.find((b) => b.status === "active");
          setActiveRental(active || null);
        }
      }
    } catch (err) {
      // Defaults remain at 0 / null on failure
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchWalletData();
    }, [apiFetch, isOwner]),
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
              <Text style={styles.balanceAmount}>
                ₦{balance.toLocaleString()}
              </Text>
              <Text style={styles.balanceDecimal}>.00</Text>
            </View>

            {/* Render Pending/Earned sub-cards ONLY for Owners */}
            {isOwner && (
              <View style={styles.subCardRow}>
                <View style={styles.subCard}>
                  <Text style={styles.subCardLabel}>Pending</Text>
                  <Text style={styles.subCardValue}>
                    ₦{pendingBalance.toLocaleString()}
                  </Text>
                </View>

                <View style={styles.subCard}>
                  <Text style={styles.subCardLabel}>Earned</Text>
                  <Text style={styles.subCardValue}>
                    ₦{earnedBalance.toLocaleString()}
                  </Text>
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
              ) : activeRental ? (
                <View style={styles.rentalRow}>
                  <Image
                    source={
                      activeRental?.equipment?.imageUrl
                        ? { uri: activeRental.equipment.imageUrl }
                        : require("../assets/images/buildozer.png")
                    }
                    style={styles.itemImage}
                  />
                  <View style={styles.requestInfo}>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {activeRental?.equipment?.title || "Equipment"}
                    </Text>
                    <Text style={styles.requestSub} numberOfLines={1}>
                      {isOwner
                        ? `Renter: ${activeRental?.renter?.firstName || "N/A"}`
                        : `Owner: ${activeRental?.owner?.firstName || "N/A"}`}
                    </Text>
                  </View>
                  <Text style={styles.returnDate}>
                    Returns {activeRental?.endDate || "N/A"}
                  </Text>
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyTitle}>No Active Rentals</Text>
                  <Text style={styles.emptySubtitle}>
                    Active equipment bookings will appear here.
                  </Text>
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
    fontFamily: "pBold",
    color: "#0B2554",
  },
  screenSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
    fontFamily: "mRegular",
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
    letterSpacing: 0.8,
    fontFamily: "mBold",
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
    fontFamily: "pBold",
  },
  balanceDecimal: {
    color: "#94A3B8",
    fontSize: 18,
    fontFamily: "pSemiBold",
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
    fontFamily: "mRegular",
  },
  subCardValue: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "pSemiBold",
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
    fontFamily: "mSemiBold",
  },

  /* Sections */
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    color: "#64748B",
    letterSpacing: 0.6,
    marginBottom: 8,
    fontFamily: "mBold",
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
    color: "#0B2554",
    fontFamily: "pSemiBold",
  },
  requestSub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
    fontFamily: "mRegular",
  },
  returnDate: {
    fontSize: 12,
    color: "#0B2554",
    fontFamily: "mSemiBold",
  },
  viewAllBtn: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  viewAllText: {
    color: "#0B2554",
    fontSize: 12,
    fontFamily: "mSemiBold",
  },

  /* Empty State */
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  emptyTitle: {
    fontSize: 14,
    color: "#0B2554",
    marginTop: 8,
    fontFamily: "mSemiBold",
  },
  emptySubtitle: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
    fontFamily: "mRegular",
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
    fontSize: 14,
    fontFamily: "mBold",
  },
});
