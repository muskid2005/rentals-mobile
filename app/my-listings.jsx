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
  const [activeFilter, setActiveFilter] = useState("all");

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

  const filteredListings = listings.filter((item) => {
    if (activeFilter === "listed") return item.status === "draft";
    if (activeFilter === "active") return item.status !== "draft";
    return true;
  });

  const formatCurrency = (amount) => {
    const num = parseFloat(amount || 0);
    return `₦${num.toLocaleString("en-NG")}`;
  };

  const renderBadge = () => {
    return (
      <View style={[styles.badge, { backgroundColor: "#DCFCE7" }]}>
        <Text style={[styles.badgeText, { color: "#15803D" }]}>LISTED</Text>
      </View>
    );
  };

  return (
    <SafeArea>
      <HeaderBar
        name="My Listings"
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
        {/* Top Header Section */}
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.screenTitle}>Equipment Listings</Text>
            <Text style={styles.screenSubtitle}>
              Manage your gear available for rent
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/listItem")}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add New</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[
              styles.filterPill,
              activeFilter === "all" && styles.activeFilterPill,
            ]}
            onPress={() => setActiveFilter("all")}
          >
            <Text
              style={[
                styles.filterPillText,
                activeFilter === "all" && styles.activeFilterPillText,
              ]}
            >
              All ({listings.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              activeFilter === "listed" && styles.activeFilterPill,
            ]}
            onPress={() => setActiveFilter("listed")}
          >
            <Text
              style={[
                styles.filterPillText,
                activeFilter === "listed" && styles.activeFilterPillText,
              ]}
            >
              Listed ({listings.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable Listings Container */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#0B2554"
              style={{ marginTop: 40 }}
            />
          ) : filteredListings.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="cube-outline" size={48} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No Listings Found</Text>
              <Text style={styles.emptySubtitle}>
                You don't have any items under this category yet.
              </Text>
            </View>
          ) : (
            filteredListings.map((item) => {
              const photoUrl =
                Array.isArray(item.photos) &&
                item.photos.length > 0 &&
                item.photos[0]?.url
                  ? item.photos[0].url
                  : null;

              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.card}
                  activeOpacity={0.85}
                  onPress={() => router.push(`/equipment/${item.id}`)}
                >
                  {/* Card Header Image */}
                  <View style={styles.imageContainer}>
                    {photoUrl ? (
                      <Image
                        source={{ uri: photoUrl }}
                        style={styles.image}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.imageFallback}>
                        <Ionicons
                          name="image-outline"
                          size={32}
                          color="#94A3B8"
                        />
                        <Text style={styles.imageFallbackText}>
                          No Image Available
                        </Text>
                      </View>
                    )}
                    {renderBadge(item.status)}
                  </View>

                  {/* Card Details */}
                  <View style={styles.cardContent}>
                    <View style={styles.titleRow}>
                      <Text style={styles.title} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.dailyPrice}>
                        {formatCurrency(item.dailyRate)}
                        <Text style={styles.perDay}>/day</Text>
                      </Text>
                    </View>

                    <Text style={styles.metaText}>
                      {item.brand} {item.model} • {item.condition}
                    </Text>

                    <View style={styles.locationRow}>
                      <Ionicons
                        name="location-outline"
                        size={14}
                        color="#64748B"
                      />
                      <Text style={styles.locationText} numberOfLines={1}>
                        {item.address}
                      </Text>
                    </View>

                    {/* Footer Metadata */}
                    <View style={styles.cardFooter}>
                      <Text style={styles.weeklyRateText}>
                        Weekly:{" "}
                        <Text style={styles.boldPrice}>
                          {formatCurrency(item.weeklyRate)}
                        </Text>
                      </Text>
                      <Text style={styles.depositText}>
                        Deposit: {formatCurrency(item.securityDepositAmount)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
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
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0B2554",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 4,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DCE6F7",
    backgroundColor: "#FFFFFF",
  },
  activeFilterPill: {
    backgroundColor: "#0B2554",
    borderColor: "#0B2554",
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748B",
  },
  activeFilterPillText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  imageContainer: {
    height: 120,
    width: "100%",
    backgroundColor: "#F8FAFC",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageFallback: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
  },
  imageFallbackText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
    marginTop: 4,
  },
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  cardContent: {
    padding: 14,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0B2554",
    flex: 1,
    marginRight: 8,
  },
  dailyPrice: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0B2554",
  },
  perDay: {
    fontSize: 11,
    fontWeight: "400",
    color: "#64748B",
  },
  metaText: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 11,
    color: "#94A3B8",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  weeklyRateText: {
    fontSize: 11,
    color: "#64748B",
  },
  boldPrice: {
    fontWeight: "700",
    color: "#0B2554",
  },
  depositText: {
    fontSize: 11,
    color: "#64748B",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0B2554",
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },
});
