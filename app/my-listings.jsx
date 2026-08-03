import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";
import SafeArea from "../components/common/safeArea";
import Sidebar from "../components/common/sideBar";
import HeaderBar from "../components/layout/headerComponents";
import { useUserStore } from "../store/useStore";

export default function MyListingsScreen() {
  const { user, apiFetch } = useUserStore();
  const { width } = useWindowDimensions();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [listings, setListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    if (!refreshing) setLoading(true);
    try {
      const { response, error } = await apiFetch("/equipment/my", {
        method: "GET",
      });

      if (!error && response?.ok) {
        const data = await response.json();
        const results = Array.isArray(data) ? data : data?.data || [];
        setListings(results);
      } else {
        setListings([]);
      }
    } catch (err) {
      setListings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMyListings();
  };

  const formatCurrency = (amount) => {
    const num = parseFloat(amount || 0);
    return `₦${num.toLocaleString("en-NG")}`;
  };

  // Dynamic status counters based on API response
  const activeCount = listings.filter(
    (i) => i.status === "active" || i.status === "available",
  ).length;

  const onRentCount = listings.filter(
    (i) =>
      i.status === "rented" ||
      i.status === "on_rent" ||
      i.status === "accepted",
  ).length;

  const completedCount = listings.filter(
    (i) => i.status === "completed",
  ).length;

  const filteredListings = listings.filter((item) =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderStatusBadge = (status) => {
    if (status === "rented" || status === "on_rent" || status === "accepted") {
      return (
        <View style={styles.badgeColumn}>
          <View style={[styles.badgePill, { backgroundColor: "#FEF3C7" }]}>
            <Text style={[styles.badgeDot, { color: "#D97706" }]}>•</Text>
            <Text style={[styles.badgeText, { color: "#D97706" }]}>
              On Rent
            </Text>
          </View>
          <Text style={styles.badgeSubText}>Due in 2 days</Text>
        </View>
      );
    }

    if (status === "maintenance") {
      return (
        <View style={styles.badgeColumn}>
          <View style={[styles.badgePill, { backgroundColor: "#DBEAFE" }]}>
            <Text style={[styles.badgeDot, { color: "#2563EB" }]}>•</Text>
            <Text style={[styles.badgeText, { color: "#2563EB" }]}>
              Maintenance
            </Text>
          </View>
          <Text style={[styles.badgeSubText, { color: "#EF4444" }]}>
            Unavailable
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.badgeColumn}>
        <View style={[styles.badgePill, { backgroundColor: "#DCFCE7" }]}>
          <Text style={[styles.badgeDot, { color: "#16A34A" }]}>•</Text>
          <Text style={[styles.badgeText, { color: "#16A34A" }]}>Active</Text>
        </View>
        <Text style={[styles.badgeSubText, { color: "#16A34A" }]}>
          Available
        </Text>
      </View>
    );
  };

  return (
    <SafeArea>
      <HeaderBar
        name="My Equipment"
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
        role="owner"
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
          {/* Search and Filters Bar */}
          <View style={styles.filterRow}>
            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={16} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <TouchableOpacity style={styles.dropdownBtn}>
              <Text style={styles.dropdownText}>All Statuses</Text>
              <Ionicons name="chevron-down" size={14} color="#64748B" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.dropdownBtn}>
              <Text style={styles.dropdownText}>Sort by Newest</Text>
              <Ionicons name="chevron-down" size={14} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Stat Cards Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="cube-outline" size={20} color="#64748B" />
              </View>
              <View style={styles.statTextContainer}>
                <Text style={styles.statLabel}>Total Equipment</Text>
                <Text style={styles.statValue}>{listings.length}</Text>
                <Text style={styles.statSub}>All Time</Text>
              </View>
            </View>

            <View style={styles.statCard}>
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: "#FEF3C7" },
                ]}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color="#D97706"
                />
              </View>
              <View style={styles.statTextContainer}>
                <Text style={styles.statLabel}>Active Listings</Text>
                <Text style={styles.statValue}>{listings.length}</Text>
                <Text style={styles.statSub}>Currently Available</Text>
              </View>
            </View>

            <View style={styles.statCard}>
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: "#DBEAFE" },
                ]}
              >
                <Ionicons name="calendar-outline" size={20} color="#2563EB" />
              </View>
              <View style={styles.statTextContainer}>
                <Text style={styles.statLabel}>On Rent</Text>
                <Text style={styles.statValue}>{onRentCount}</Text>
                <Text style={styles.statSub}>Out On Rent</Text>
              </View>
            </View>

            <View style={styles.statCard}>
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: "#DCFCE7" },
                ]}
              >
                <Ionicons
                  name="checkmark-done-circle-outline"
                  size={20}
                  color="#16A34A"
                />
              </View>
              <View style={styles.statTextContainer}>
                <Text style={styles.statLabel}>Completed Rentals</Text>
                <Text style={styles.statValue}>{completedCount}</Text>
                <Text style={styles.statSub}>All Time</Text>
              </View>
            </View>
          </View>

          {/* Equipment List Container */}
          <View style={styles.listCard}>
            {loading ? (
              <ActivityIndicator
                size="large"
                color="#0B2554"
                style={{ marginVertical: 30 }}
              />
            ) : filteredListings.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="cube-outline" size={40} color="#94A3B8" />
                <Text style={styles.emptyTitle}>No Equipment Found</Text>
              </View>
            ) : (
              filteredListings.map((item, index) => {
                const photoUrl =
                  Array.isArray(item.photos) &&
                  item.photos.length > 0 &&
                  item.photos[0]?.url
                    ? item.photos[0].url
                    : null;

                return (
                  <TouchableOpacity
                    key={item.id || index}
                    style={[
                      styles.listItemRow,
                      index < filteredListings.length - 1 && styles.rowBorder,
                    ]}
                    activeOpacity={0.7}
                    onPress={() =>
                      router.push({
                        pathname: "/EquipmentDetailsScreen",
                        params: { id: item.id },
                      })
                    }
                  >
                    {/* Item Image */}
                    {photoUrl ? (
                      <Image
                        source={{ uri: photoUrl }}
                        style={styles.itemImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.imageFallback}>
                        <Ionicons
                          name="image-outline"
                          size={20}
                          color="#94A3B8"
                        />
                      </View>
                    )}

                    {/* Info Column */}
                    <View style={styles.itemMainInfo}>
                      <Text style={styles.itemTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.itemIdText}>
                        ID:{" "}
                        {item.id ? `TL-${item.id.toString().slice(-5)}` : "N/A"}
                      </Text>

                      <View style={styles.categoryRow}>
                        <Ionicons
                          name="grid-outline"
                          size={12}
                          color="#64748B"
                        />
                        <Text style={styles.categoryText} numberOfLines={1}>
                          {item.category || "General"}
                        </Text>
                      </View>
                    </View>

                    {/* Price & Actions Column */}
                    <View style={styles.itemRightCol}>
                      <Text style={styles.priceText}>
                        {formatCurrency(item.dailyRate)}
                      </Text>

                      <View style={styles.rightActionsRow}>
                        {renderStatusBadge(item.status)}

                        <View style={styles.actionIconGroup}>
                          <TouchableOpacity
                            style={styles.iconBtn}
                            onPress={() =>
                              router.push({
                                pathname: "/EquipmentDetailsScreen",
                                params: { id: item.id },
                              })
                            }
                          >
                            <Ionicons
                              name="create-outline"
                              size={16}
                              color="#94A3B8"
                            />
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.iconBtn}>
                            <Ionicons
                              name="ellipsis-vertical"
                              size={16}
                              color="#94A3B8"
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}

            {/* Pagination / Result Summary Footer */}
            <View style={styles.paginationFooter}>
              <Text style={styles.paginationText}>
                Showing 1 to {filteredListings.length} of {listings.length}{" "}
                results
              </Text>

              <View style={styles.pageNumbersRow}>
                <TouchableOpacity style={styles.pageArrow}>
                  <Ionicons name="chevron-back" size={12} color="#94A3B8" />
                </TouchableOpacity>
                <View style={styles.activePagePill}>
                  <Text style={styles.activePageText}>1</Text>
                </View>
                <TouchableOpacity style={styles.pageArrow}>
                  <Ionicons name="chevron-forward" size={12} color="#94A3B8" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 10,
    height: 36,
    gap: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: "#0F172A",
    padding: 0,
  },
  dropdownBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 10,
    height: 36,
    gap: 4,
  },
  dropdownText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    width: "48.5%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  statTextContainer: {
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#64748B",
  },
  statValue: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
    marginVertical: 1,
  },
  statSub: {
    fontSize: 9,
    color: "#94A3B8",
  },
  listCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  listItemRow: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
  },
  imageFallback: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  itemMainInfo: {
    flex: 1,
    marginLeft: 10,
    marginRight: 6,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  itemIdText: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 1,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  categoryText: {
    fontSize: 11,
    color: "#64748B",
  },
  itemRightCol: {
    alignItems: "flex-end",
  },
  priceText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  rightActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badgeColumn: {
    alignItems: "flex-end",
  },
  badgePill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 3,
  },
  badgeDot: {
    fontSize: 12,
    lineHeight: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  badgeSubText: {
    fontSize: 9,
    color: "#64748B",
    marginTop: 2,
  },
  actionIconGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  iconBtn: {
    padding: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 6,
  },
  paginationFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    backgroundColor: "#FAFAFA",
  },
  paginationText: {
    fontSize: 10,
    color: "#94A3B8",
  },
  pageNumbersRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  pageArrow: {
    padding: 4,
  },
  activePagePill: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#0B2554",
    alignItems: "center",
    justifyContent: "center",
  },
  activePageText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 8,
  },
});
