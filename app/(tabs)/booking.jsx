import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
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
  const { user, apiFetch } = useUserStore();
  const { width } = useWindowDimensions();
  const { bookings, fetchBookings, isLoading } = useBookingStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const [sortDropdownVisible, setSortDropdownVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const [filterVerifiedOnly, setFilterVerifiedOnly] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  console.log(bookings);
  // Determine role based on lastName === "verified"
  const isOwner = user?.lastName?.trim().toLowerCase() === "verified";

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, []),
  );

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

  const getStatusBadge = (status) => {
    const formattedStatus = (status || "pending").toLowerCase();
    switch (formattedStatus) {
      case "approved":
      case "accepted":
        return {
          label: "APPROVED",
          bgColor: "#E6F4EA",
          textColor: "#137333",
          icon: "checkmark-circle-outline",
        };
      case "completed":
        return {
          label: "COMPLETED",
          bgColor: "#E8F0FE",
          textColor: "#1A73E8",
          icon: "checkmark-done-circle-outline",
        };
      case "declined":
      case "rejected":
      case "cancelled":
        return {
          label: formattedStatus.toUpperCase(),
          bgColor: "#FCE8E6",
          textColor: "#C5221F",
          icon: "close-circle-outline",
        };
      case "pending":
      default:
        return {
          label: "PENDING APPROVAL",
          bgColor: "#FEF7E0",
          textColor: "#B06000",
          icon: "time-outline",
        };
    }
  };

  // Execute Accept API Call for Owner
  const handleBookingStatusUpdate = async (bookingId, action) => {
    setActionLoadingId(bookingId);
    try {
      const endpoint = `/bookings/${bookingId}/${action}`;

      const fetchOptions = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { response, error } = await apiFetch(endpoint, fetchOptions);

      if (error) {
        Alert.alert(
          "Error",
          typeof error === "string" ? error : `Failed to ${action} booking.`,
        );
      } else if (response?.ok) {
        Alert.alert(
          "Success",
          `Booking successfully ${action === "accept" ? "accepted" : "declined"}.`,
        );
        await fetchBookings();
      } else {
        const resData = await response?.json().catch(() => null);
        Alert.alert(
          "Failed",
          resData?.message || `Unable to ${action} this request.`,
        );
      }
    } catch (err) {
      console.log("Status update error:", err);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleApprove = (bookingId) => {
    Alert.alert(
      "Approve Request",
      "Are you sure you want to approve this request?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve",
          onPress: () => handleBookingStatusUpdate(bookingId, "accept"),
        },
      ],
    );
  };

  // Navigate Renter to Checkout Screen with all required parameters
  const handleProceedToCheckout = (item) => {
    const primaryPhoto =
      item.equipment?.photos?.find((p) => p.isPrimary)?.url ||
      item.equipment?.photos?.[0]?.url ||
      "";

    router.push({
      pathname: "/checkout",
      params: {
        bookingId: item.id,
        renterId: item.renterId || item.renter?.id,
        equipmentId: item.equipmentId || item.equipment?.id,
        ownerId: item.ownerId || item.owner?.id,
        startDate: item.startDate,
        endDate: item.endDate,
        dailyRate: item.dailyRate || item.equipment?.dailyRate,
        rentalAmount: item.rentalAmount,
        depositAmount: item.depositAmount,
        totalAmount: item.totalAmount,
        status: item.status,
        title: item.equipment?.title,
        image: primaryPhoto,
        address: item.equipment?.address || item.equipment?.location,
      },
    });
  };

  const rawList = Array.isArray(bookings) ? bookings : [];

  const filteredBookings = rawList.filter((item) => {
    if (filterVerifiedOnly) {
      const targetUser = isOwner ? item?.renter : item?.owner;
      return targetUser?.isIdentityVerified === true;
    }
    return true;
  });

  const sortedList = [...filteredBookings].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.startDate);
    const dateB = new Date(b.createdAt || b.startDate);
    const priceA = parseFloat(a.totalAmount || a.rentalAmount || 0);
    const priceB = parseFloat(b.totalAmount || b.rentalAmount || 0);

    if (sortOrder === "newest") return dateB - dateA;
    if (sortOrder === "oldest") return dateA - dateB;
    if (sortOrder === "lowest_price") return priceA - priceB;
    if (sortOrder === "highest_price") return priceB - priceA;
    return 0;
  });

  const activeSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === sortOrder)?.label || "Newest";

  return (
    <SafeArea>
      <HeaderBar
        name={isOwner ? "Received Requests" : "My Rental Requests"}
        image={
          user?.profilePhotoUrl
            ? { uri: user.profilePhotoUrl }
            : require("../../assets/images/profile.jpg")
        }
        onPress={() => setMenuOpen(true)}
        onNotificationPress={() => router.push("/NotificationsScreen")}
      />

      <Sidebar
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        role={user?.role || "user"}
        onNavigate={(routeId) => {
          setMenuOpen(false);
          router.replace(routeId);
        }}
      />

      <ScrollView
        style={[styles.container, { width: width - 24 }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topHeaderSection}>
          <Text style={styles.pageTitle}>
            {isOwner ? "Incoming Booking Requests" : "My Rental Requests"}
          </Text>
          <Text style={styles.pageSubtitle}>
            {isOwner
              ? "Review incoming booking requests from renters and manage approvals."
              : "Track the status of equipment rental requests you have submitted."}
          </Text>
        </View>

        <View style={styles.controlsRow}>
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

        <Text style={styles.sectionTitle}>
          {isOwner ? "INCOMING REQUESTS" : "SENT BOOKINGS"} ({sortedList.length}
          )
        </Text>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0B2554" />
          </View>
        ) : sortedList.length > 0 ? (
          sortedList.map((item) => {
            const targetUser = isOwner ? item.renter : item.owner;

            const firstName = targetUser?.firstName || "";
            const lastName = targetUser?.lastName || "";
            const fullName =
              `${firstName} ${lastName}`.trim() ||
              (isOwner ? "Renter User" : "Equipment Owner");
            const avatarLetter = fullName.charAt(0).toUpperCase() || "U";

            const displayAmount = parseFloat(
              item.totalAmount || item.rentalAmount || 0,
            );
            const statusInfo = getStatusBadge(item.status);

            const primaryPhoto =
              item.equipment?.photos?.find((p) => p.isPrimary)?.url ||
              item.equipment?.photos?.[0]?.url;

            const isItemProcessing = actionLoadingId === item.id;

            return (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.userInfo}>
                    {targetUser?.profilePhotoUrl ? (
                      <Image
                        source={{ uri: targetUser.profilePhotoUrl }}
                        style={styles.avatarImage}
                      />
                    ) : (
                      <View style={styles.avatarWrapper}>
                        <Text style={styles.avatarText}>{avatarLetter}</Text>
                      </View>
                    )}

                    <View>
                      <View style={styles.nameRow}>
                        <Text style={styles.userName}>{fullName}</Text>
                        {targetUser?.isIdentityVerified && (
                          <Ionicons
                            name="checkmark-circle"
                            size={15}
                            color="#00796B"
                            style={{ marginLeft: 4 }}
                          />
                        )}
                      </View>
                      <Text style={styles.userRole}>
                        {isOwner ? "Renter" : "Equipment Owner"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.earningsContainer}>
                    <Text style={styles.earningsAmount}>
                      ₦{displayAmount.toLocaleString()}
                    </Text>
                    <Text style={styles.earningsSub}>
                      {isOwner ? "TOTAL EARNINGS" : "TOTAL COST"}
                    </Text>
                  </View>
                </View>

                {/* Status Badge */}
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: statusInfo.bgColor },
                  ]}
                >
                  <Ionicons
                    name={statusInfo.icon}
                    size={14}
                    color={statusInfo.textColor}
                  />
                  <Text
                    style={[styles.statusText, { color: statusInfo.textColor }]}
                  >
                    {statusInfo.label}
                  </Text>
                </View>

                {/* Equipment Details */}
                <View style={styles.detailsContainer}>
                  <View style={styles.detailRow}>
                    {primaryPhoto ? (
                      <Image
                        source={{ uri: primaryPhoto }}
                        style={styles.equipThumb}
                      />
                    ) : (
                      <Ionicons
                        name="construct-outline"
                        size={16}
                        color="#64748B"
                      />
                    )}
                    <View style={{ flex: 1 }}>
                      <Text style={styles.detailTitle} numberOfLines={1}>
                        {item.equipment?.title || "Equipment"}
                      </Text>
                      <Text style={styles.detailSub}>
                        {item.equipment?.brand || ""}{" "}
                        {item.equipment?.model || ""}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons
                      name="calendar-outline"
                      size={16}
                      color="#64748B"
                    />
                    <Text style={styles.detailText}>
                      {formatDate(item.startDate)} - {formatDate(item.endDate)}
                    </Text>
                  </View>

                  {item.depositAmount && (
                    <View style={styles.detailRow}>
                      <Ionicons
                        name="shield-checkmark-outline"
                        size={16}
                        color="#64748B"
                      />
                      <Text style={styles.detailText}>
                        Deposit: ₦
                        {parseFloat(item.depositAmount).toLocaleString()}
                      </Text>
                    </View>
                  )}
                </View>

                {/* OWNER ACTIONS: Show Approve Button when request is pending */}
                {isOwner && (item.status === "pending" || !item.status) && (
                  <View style={styles.actionRow}>
                    {isItemProcessing ? (
                      <ActivityIndicator size="small" color="#0B2554" />
                    ) : (
                      <TouchableOpacity
                        style={styles.approveButton}
                        onPress={() => handleApprove(item.id)}
                      >
                        <Text style={styles.approveButtonText}>
                          Approve Request
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}

                {/* RENTER ACTIONS: Show Checkout Link strictly for renters */}
                {!isOwner && (
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.checkoutButton}
                      onPress={() => handleProceedToCheckout(item)}
                    >
                      <Text style={styles.checkoutButtonText}>
                        Proceed to Checkout
                      </Text>
                      <Ionicons
                        name="arrow-forward-outline"
                        size={16}
                        color="#FFFFFF"
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={48} color="#94A3B8" />
            <Text style={styles.emptyTitle}>
              {isOwner ? "No Incoming Requests" : "No Booking Requests Sent"}
            </Text>
            <Text style={styles.emptySub}>
              {isOwner
                ? "You currently have no incoming rental requests to review."
                : "You haven't requested any equipment rentals yet."}
            </Text>
          </View>
        )}
      </ScrollView>

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
    color: "#0B2554",
    fontFamily: "pBold",
  },
  pageSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
    lineHeight: 16,
    fontFamily: "mRegular",
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
    color: "#0B2554",
    fontFamily: "mBold",
  },
  activeControlBtnText: {
    color: "#FFFFFF",
  },
  sectionTitle: {
    fontSize: 12,
    color: "#0B2554",
    letterSpacing: 0.5,
    marginBottom: 12,
    fontFamily: "mBold",
  },
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
    marginBottom: 10,
  },
  userInfo: {
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
  avatarImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "pBold",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    fontSize: 14,
    color: "#0B2554",
    fontFamily: "pSemiBold",
  },
  userRole: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
    fontFamily: "mRegular",
  },
  earningsContainer: {
    alignItems: "flex-end",
  },
  earningsAmount: {
    fontSize: 15,
    color: "#00796B",
    fontFamily: "pBold",
  },
  earningsSub: {
    fontSize: 9,
    color: "#94A3B8",
    marginTop: 2,
    fontFamily: "mBold",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
    marginBottom: 10,
  },
  statusText: {
    fontSize: 10,
    fontFamily: "mBold",
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 10,
    gap: 8,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  equipThumb: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  detailTitle: {
    fontSize: 13,
    color: "#0B2554",
    fontFamily: "mBold",
  },
  detailSub: {
    fontSize: 10,
    color: "#64748B",
    fontFamily: "mRegular",
  },
  detailText: {
    fontSize: 12,
    color: "#334155",
    flex: 1,
    fontFamily: "mMedium",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
    justifyContent: "center",
    alignItems: "center",
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
    fontFamily: "mBold",
  },
  checkoutButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#00796B",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  checkoutButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "mBold",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    color: "#0B2554",
    marginTop: 12,
    fontFamily: "pBold",
  },
  emptySub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
    textAlign: "center",
    fontFamily: "mRegular",
  },
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
    color: "#0B2554",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingBottom: 8,
    fontFamily: "mBold",
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
    fontFamily: "mMedium",
  },
  dropdownItemTextSelected: {
    color: "#0B2554",
    fontFamily: "mBold",
  },
});
