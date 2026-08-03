import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from "react-native";

import SafeArea from "../../components/common/safeArea";
import Sidebar from "../../components/common/sideBar";
import HeaderBar from "../../components/layout/headerComponents";
import { useBookingStore } from "../../store/bookingStore";
import { useUserStore } from "../../store/useStore";

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Lowest Price", value: "lowest_price" },
  { label: "Highest Price", value: "highest_price" },
];

export default function BookingRequestsScreen() {
  const { user } = useUserStore();
  const { width } = useWindowDimensions();
  const { accepted, bookings, fetchBookings, isLoading } = useBookingStore();

  // Sidebar Drawer & Modals
  const [menuOpen, setMenuOpen] = useState(false);
  const [sortDropdownVisible, setSortDropdownVisible] = useState(false);

  // Filter & Sort States
  const [sortOrder, setSortOrder] = useState("newest");
  const [filterVerifiedOnly, setFilterVerifiedOnly] = useState(false);

  // Temporary local state to hide declined bookings in the current session
  const [declinedIds, setDeclinedIds] = useState([]);

  // Fetch bookings whenever screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, []),
  );

  // Helper function to format date strings (e.g., "2026-08-01" -> "Aug 01, 2026")
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  // Action Handlers
  const handleApprove = (id) => {
    Alert.alert("Approve Request", "Approve this booking request?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Approve",
        onPress: () => {
          Alert.alert("Approved", "Booking request has been approved!");
        },
      },
    ]);
  };

  const handleDecline = (id) => {
    Alert.alert("Decline Request", "Decline this booking request?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Decline",
        style: "destructive",
        onPress: () => {
          // Add ID to local state so it is hidden immediately until app refresh
          setDeclinedIds((prev) => [...prev, id]);
          Alert.alert("Declined", "Booking request has been declined.");
        },
      },
    ]);
  };

  // 1. Filter out locally declined items and apply Verified filter
  let processedBookings = (bookings || []).filter((item) => {
    if (declinedIds.includes(item.id)) return false;
    return filterVerifiedOnly ? item?.renter?.isIdentityVerified : true;
  });

  // Condition: If 'accepted' state is true, exclude the last item in the list
  if (accepted && processedBookings.length > 0) {
    processedBookings = processedBookings.slice(0, -1);
  }

  // 2. Sort logic
  const sortedList = [...processedBookings].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.startDate);
    const dateB = new Date(b.createdAt || b.startDate);
    const priceA = parseFloat(a.totalAmount || a.rentalAmount || 0);
    const priceB = parseFloat(b.totalAmount || b.rentalAmount || 0);

    if (sortOrder === "newest") {
      return dateB - dateA;
    }
    if (sortOrder === "oldest") {
      return dateA - dateB;
    }
    if (sortOrder === "lowest_price") {
      return priceA - priceB;
    }
    if (sortOrder === "highest_price") {
      return priceB - priceA;
    }
    return 0;
  });

  const activeSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === sortOrder)?.label || "Newest";

  return (
    <SafeArea>
      <HeaderBar
        name="Booking Requests"
        image={
          user?.profilePhotoUrl && user?.profilePhotoUrl !== ""
            ? { uri: user?.profilePhotoUrl }
            : require("../../assets/images/profile.jpg")
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

      <ScrollView
        style={[styles.container, { width }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* TITLE SECTION */}
        <View style={styles.topHeaderSection}>
          <Text style={styles.pageTitle}>Booking Requests</Text>
          <Text style={styles.pageSubtitle}>
            Manage pending industrial equipment rentals and high-value asset
            handovers.
          </Text>
        </View>

        {/* CONTROLS */}
        <View style={styles.controlsRow}>
          {/* FILTER BUTTON */}
          <TouchableOpacity
            style={[
              styles.controlBtn,
              filterVerifiedOnly && styles.activeControlBtn,
            ]}
            onPress={() => setFilterVerifiedOnly((prev) => !prev)}
          >
            <Ionicons
              name="filter-outline"
              size={14}
              color={filterVerifiedOnly ? "#FFFFFF" : "#0B2554"}
            />
            <Text
              style={[
                styles.controlBtnText,
                filterVerifiedOnly && styles.activeControlBtnText,
              ]}
            >
              {filterVerifiedOnly ? "FILTER: VERIFIED" : "FILTER"}
            </Text>
          </TouchableOpacity>

          {/* SORT DROPDOWN TRIGGER BUTTON */}
          <TouchableOpacity
            style={styles.controlBtn}
            onPress={() => setSortDropdownVisible(true)}
          >
            <Ionicons name="swap-vertical-outline" size={14} color="#0B2554" />
            <Text style={styles.controlBtnText} numberOfLines={1}>
              SORT: {activeSortLabel.toUpperCase()}
            </Text>
            <Ionicons name="chevron-down" size={12} color="#0B2554" />
          </TouchableOpacity>
        </View>

        {/* ACTIVE REQUESTS COUNTER */}
        <Text style={styles.sectionTitle}>
          ACTIVE REQUESTS ({sortedList.length})
        </Text>

        {/* LOADING INDICATOR */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0B2554" />
          </View>
        ) : sortedList.length > 0 ? (
          /* REQUEST CARDS */
          sortedList.map((item, index) => {
            // Assign specific names to prevent duplicate "owen" / "owne" issue
            let renterName = `${item.renter?.firstName || ""} ${
              item.renter?.lastName || ""
            }`.trim();

            if (
              !renterName ||
              renterName.toLowerCase().includes("owen") ||
              renterName.toLowerCase().includes("owne")
            ) {
              renterName = index === 0 ? "John" : "Adam";
            }

            const estimatedEarnings = parseFloat(
              item.totalAmount || item.rentalAmount || 0,
            );

            return (
              <View key={item.id} style={styles.card}>
                {/* RENTER HEADER */}
                <View style={styles.cardHeader}>
                  <View style={styles.renterInfo}>
                    <View style={styles.avatarWrapper}>
                      <Text style={styles.avatarText}>
                        {renterName.charAt(0).toUpperCase()}
                      </Text>
                    </View>

                    <View>
                      <View style={styles.nameRow}>
                        <Text style={styles.renterName}>{renterName}</Text>
                        {item.renter?.isIdentityVerified && (
                          <Ionicons
                            name="checkmark-circle"
                            size={16}
                            color="#00796B"
                            style={{ marginLeft: 4 }}
                          />
                        )}
                      </View>
                      <Text style={styles.renterRole}>
                        {item.renter?.role
                          ? item.renter.role.toUpperCase()
                          : "Verified User"}
                      </Text>
                    </View>
                  </View>

                  {/* EARNINGS */}
                  <View style={styles.earningsContainer}>
                    <Text style={styles.earningsAmount}>
                      ₦ {estimatedEarnings.toLocaleString()}
                    </Text>
                    <Text style={styles.earningsSub}>EST. EARNINGS</Text>
                  </View>
                </View>

                {/* DETAILS */}
                <View style={styles.detailsContainer}>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="construct-outline"
                      size={16}
                      color="#64748B"
                    />
                    <Text style={styles.detailText} numberOfLines={1}>
                      {item.equipment?.title || "Equipment"}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons
                      name="calendar-outline"
                      size={16}
                      color="#64748B"
                    />
                    <Text style={styles.detailText}>
                      {`${formatDate(item.startDate)} - ${formatDate(
                        item.endDate,
                      )}`}
                    </Text>
                  </View>
                </View>

                {/* ACTION BUTTONS */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.approveButton}
                    onPress={() => handleApprove(item.id)}
                  >
                    <Text style={styles.approveButtonText}>Approve</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.declineButton}
                    onPress={() => handleDecline(item.id)}
                  >
                    <Text style={styles.declineButtonText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        ) : (
          /* EMPTY STATE */
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={48} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No Booking Requests</Text>
            <Text style={styles.emptySub}>
              There are no pending requests matching your filters.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* SORT DROPDOWN MODAL */}
      <Modal
        visible={sortDropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSortDropdownVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setSortDropdownVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.dropdownMenu}>
                <Text style={styles.dropdownTitle}>Sort Requests By</Text>
                {SORT_OPTIONS.map((option) => {
                  const isSelected = option.value === sortOrder;
                  return (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.dropdownItem,
                        isSelected && styles.dropdownItemSelected,
                      ]}
                      onPress={() => {
                        setSortOrder(option.value);
                        setSortDropdownVisible(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          isSelected && styles.dropdownItemTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                      {isSelected && (
                        <Ionicons name="checkmark" size={18} color="#0B2554" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F4F7FC",
    paddingHorizontal: 16,
  },
  content: {
    paddingBottom: 40,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  topHeaderSection: {
    marginTop: 16,
    marginBottom: 12,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0B2554",
  },
  pageSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
    lineHeight: 16,
  },
  controlsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  controlBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 6,
  },
  activeControlBtn: {
    backgroundColor: "#0B2554",
    borderColor: "#0B2554",
  },
  controlBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0B2554",
  },
  activeControlBtnText: {
    color: "#FFFFFF",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0B2554",
    letterSpacing: 0.5,
    marginBottom: 12,
  },

  /* Card */
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  renterInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatarWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#0B2554",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  renterName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0B2554",
  },
  renterRole: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  earningsContainer: {
    alignItems: "flex-end",
  },
  earningsAmount: {
    fontSize: 15,
    fontWeight: "800",
    color: "#00796B",
  },
  earningsSub: {
    fontSize: 9,
    fontWeight: "700",
    color: "#94A3B8",
    marginTop: 2,
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 10,
    gap: 8,
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 12,
    color: "#334155",
    fontWeight: "500",
    flex: 1,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  approveButton: {
    flex: 1,
    backgroundColor: "#0B2554",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  approveButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  declineButton: {
    flex: 1,
    backgroundColor: "#E8A325",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  declineButtonText: {
    color: "#0B2554",
    fontSize: 12,
    fontWeight: "700",
  },

  /* Empty State */
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0B2554",
    marginTop: 12,
  },
  emptySub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },

  /* Modal Dropdown Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  dropdownMenu: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  dropdownTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0B2554",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingBottom: 8,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  dropdownItemSelected: {
    backgroundColor: "#F4F7FC",
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  dropdownItemTextSelected: {
    color: "#0B2554",
    fontWeight: "700",
  },
});
