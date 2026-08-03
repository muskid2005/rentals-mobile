import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import SafeArea from "../../components/common/safeArea";
import Sidebar from "../../components/common/sideBar";
import HeaderBar from "../../components/layout/headerComponents";
import { useBookingStore } from "../../store/bookingStore";
import { useUserStore } from "../../store/useStore";

export default function dashboard() {
  const { user } = useUserStore();
  const { apiFetch } = useUserStore.getState();
  const { accepted, setAccepted, fetchBookings } = useBookingStore();
  const { width } = useWindowDimensions();
  const [menuOpen, setMenuOpen] = useState(false);

  // OWNER ROLE CHECK VIA LAST NAME
  const isOwner = user?.lastName?.toLowerCase() === "verified";

  // Owner Data States (Realistic Initial Fallbacks)
  const [listingCount, setListingCount] = useState(0);
  const [earning, setEarning] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [rentCount, setRentCount] = useState(0);
  const [bookingData, setBookingData] = useState(null);
  const [bookingData2, setBookingData2] = useState(null);

  // Renter States (Realistic Realistic Fallbacks)
  const [walletBalance, setWalletBalance] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [completedRentals, setCompletedRentals] = useState(0);
  const [upcomingPickups, setUpcomingPickups] = useState(1);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const { apiFetch } = useUserStore.getState();

        if (isOwner) {
          // Fetch Owner Data with safe fallback parsing
          try {
            const { response: listRes } = await apiFetch("/equipment/my");
            const { response: bookingRes } = await apiFetch("/owner/bookings");
            const { response: earningRes } = await apiFetch("/earnings");

            if (listRes?.ok) {
              const res = await listRes.json();
              setListingCount(res.data?.length || 0);
            }
            if (earningRes?.ok) {
              const earnRes = await earningRes.json();
              setEarning(earnRes.data?.totalEarnings || 0);
            }
            if (bookingRes?.ok) {
              const bookRes = await bookingRes.json();
              setBookingData(bookRes.data?.[0] || null);
              setBookingData2(bookRes.data?.[1] || null);
              setBookingCount(bookRes.data?.length || 0);
            }
          } catch (err) {
            // Keep clean defaults on backend failure
          }
        } else {
          // Fetch Renter Data with safe fallback parsing
          try {
            const { response: walletRes } = await apiFetch("/wallet");
            const { response: bookingsRes } = await apiFetch("/renter/bookings");

            if (walletRes?.ok) {
              const walletData = await walletRes.json();
              setWalletBalance(walletData.data?.balance || 0);
            }
            if (bookingsRes?.ok) {
              const bData = await bookingsRes.json();
              setBookingCount(bData.data?.length || 0);
            }
          } catch (err) {
            // Keep clean defaults on backend failure
          }
        }
      };

      fetchData();
    }, [isOwner]),
  );

  function handleAcceptBooking() {
    setAccepted(true);
    setRentCount((prev) => prev + 1);
    Alert.alert("Booking Accepted", "You have accepted the booking request.");
  }

  function handleRejectBooking() {
    setAccepted(false);
    setRentCount((prev) => Math.max(0, prev - 1));
    Alert.alert("Booking Rejected", "You have rejected the booking request.");
  }

  return (
    <SafeArea>
      <HeaderBar
        name="Dashboard"
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
        role={isOwner ? "owner" : "renter"}
        onNavigate={(routeId) => {
          setMenuOpen(false);
          router.replace(routeId);
        }}
      />

      <ScrollView
        style={[styles.container, { width: width }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {isOwner ? (
          /* ======================================================== */
          /*                       OWNER VIEW                         */
          /* ======================================================== */
          <>
            <View style={styles.statsRow}>
              <View
                style={[
                  styles.statCard,
                  styles.darkCard,
                  { backgroundColor: "#0B2554" },
                ]}
              >
                <Text style={styles.statLabelDark}>Active Rentals</Text>
                <Text style={[styles.statValueDark, { color: "#FFFFFF" }]}>
                  {rentCount}
                </Text>
                <Text style={[styles.statSubDark, { color: "#FFFFFF" }]}>
                  Items out right now
                </Text>
              </View>

              <View style={[styles.statCard, styles.lightCard]}>
                <Text style={styles.statLabel}>Active Listings</Text>
                <Text style={styles.statValue}>{listingCount}</Text>
                <Text style={styles.statSub}>Listings published</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={[styles.statCard, styles.orangeCard]}>
                <Text style={styles.statLabelDark}>Total Earnings</Text>
                <Text style={styles.statValueDark}>
                  ₦{earning.toLocaleString()}
                </Text>
                <Text style={styles.statSubDark}>NGN · all listings</Text>
              </View>

              <View style={[styles.statCard, styles.lightCard]}>
                <View style={styles.bookingsHeader}>
                  <Text style={styles.statLabel}>Bookings</Text>
                  <TouchableOpacity>
                    <Text style={[styles.link, { fontSize: 8 }]}>
                      Booking History &gt;
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.statValue}>
                  {accepted ? Math.max(0, bookingCount - 1) : bookingCount}
                </Text>
                <Text style={styles.statSub}>Total requests received</Text>
              </View>
            </View>

            {/* PENDING BOOKING REQUESTS */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  PENDING BOOKING REQUESTS
                </Text>
                <TouchableOpacity onPress={() => router.push("/booking")}>
                  <Text style={styles.link}>View all &gt;</Text>
                </TouchableOpacity>
              </View>

              {!accepted ? (
                <View style={styles.requestRow}>
                  <Image
                    source={require("../../assets/images/buildozer.png")}
                    style={styles.itemImage}
                  />
                  <View style={styles.requestInfo}>
                    <Text style={styles.itemName}>
                      {bookingData?.equipment?.title || "Caterpillar Excavator"}
                    </Text>
                    <View>
                      <Text style={styles.requestSub}>
                        {`Requested by ${bookingData?.renter?.firstName || "Alex"}`}
                      </Text>
                      <Text style={styles.requestDates}>
                        {`${bookingData?.startDate || "2026-08-01"} to ${bookingData?.endDate || "2026-08-05"}`}
                      </Text>
                    </View>

                    <View style={styles.actionsRow}>
                      <TouchableOpacity
                        style={styles.acceptButton}
                        onPress={handleAcceptBooking}
                      >
                        <Text style={styles.acceptText}>Accept</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.declineButton}>
                        <Text style={styles.declineText}>Decline</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => router.push("/booking")}>
                        <Text style={styles.link}>View details</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : (
                <View style={styles.requestRow}>
                  <Image
                    source={require("../../assets/images/image.png")}
                    style={styles.itemImage}
                  />
                  <View style={styles.requestInfo}>
                    <Text style={styles.itemName}>
                      {bookingData2?.equipment?.title || "Sony FX3 Camera"}
                    </Text>
                    <View>
                      <Text style={styles.requestSub}>Requested by John</Text>
                      <Text style={styles.requestDates}>
                        {`${bookingData2?.startDate || "2026-08-12"} to ${bookingData2?.endDate || "2026-08-15"}`}
                      </Text>
                    </View>

                    <View style={styles.actionsRow}>
                      <TouchableOpacity
                        style={styles.acceptButton}
                        onPress={handleAcceptBooking}
                      >
                        <Text style={styles.acceptText}>Accept</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.declineButton}>
                        <Text style={styles.declineText}>Decline</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => router.push("/booking")}>
                        <Text style={styles.link}>View details</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* ACTIVE RENTALS */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>ACTIVE RENTALS</Text>
                <TouchableOpacity onPress={handleRejectBooking}>
                  <Text style={styles.link}>View all &gt;</Text>
                </TouchableOpacity>
              </View>

              {accepted && (
                <View style={styles.rentalRow}>
                  <Image
                    source={require("../../assets/images/buildozer.png")}
                    style={styles.itemImage}
                  />
                  <View style={styles.requestInfo}>
                    <Text style={styles.itemName}>
                      {bookingData?.equipment?.title || "Heavy Bulldozer"}
                    </Text>
                    <View>
                      <Text style={styles.requestSub}>
                        {`Renter: ${bookingData?.renter?.firstName || "Alex"}`}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.returnDate}>
                    {`Returns Aug ${bookingData?.endDate ? bookingData.endDate.split("-")[2] : "10"}`}
                  </Text>
                </View>
              )}

              <View style={styles.rentalRow}>
                <Image
                  source={require("../../assets/images/Sony.png")}
                  style={styles.itemImage}
                />
                <View style={styles.requestInfo}>
                  <Text style={styles.itemName}>Sony FX3</Text>
                  <Text style={styles.requestSub}>Renter: Esa M.</Text>
                </View>
                <Text style={styles.returnDate}>Returns Aug 05</Text>
              </View>
            </View>

            {/* TIMELINE */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>UPCOMING PICKUPS & RETURNS</Text>
                <TouchableOpacity>
                  <Text style={styles.link}>View all &gt;</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.timelineContainer}>
                <View style={styles.timelineItem}>
                  <View style={styles.timelineLeftColumn}>
                    <View style={[styles.dot, styles.pickupDot]} />
                    <View style={styles.verticalLine} />
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineHeader}>
                      <Text style={styles.pickupTag}>PICKUP </Text>
                      <Text style={styles.timelineTitle}>Canon EOS R50</Text>
                    </Text>
                    <Text style={styles.timelineSub}>
                      Emmanuel A. · Today · 10:00 AM
                    </Text>
                  </View>
                </View>

                <View style={styles.timelineItem}>
                  <View style={styles.timelineLeftColumn}>
                    <View style={[styles.dot, styles.returnDot]} />
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineHeader}>
                      <Text style={styles.returnTag}>RETURN </Text>
                      <Text style={styles.timelineTitle}>DJI RS 3 Gimbal</Text>
                    </Text>
                    <Text style={styles.timelineSub}>
                      Daniel T. · Tomorrow · 3:00 PM
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </>
        ) : (
          /* ======================================================== */
          /*                      RENTER VIEW                         */
          /* ======================================================== */
          <>
            {/* My Wallet Banner */}
            <View style={styles.renterWalletCard}>
              <Text style={styles.walletTitle}>My Wallet</Text>
              <View style={styles.walletInnerBox}>
                <Text style={styles.walletLabel}>Wallet Balance</Text>
                <Text style={styles.walletAmount}>
                  ₦{walletBalance.toLocaleString()}
                </Text>
                <TouchableOpacity
                  style={styles.addFundsBtn}
                  onPress={() => router.push("/wallet")}
                >
                  <Text style={styles.addFundsText}>Add Funds</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.daysRow}>
                {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                  <Text key={i} style={styles.dayText}>
                    {day}
                  </Text>
                ))}
              </View>
            </View>

            {/* Renter Stats Row 1 */}
            <View style={styles.statsRow}>
              <View
                style={[
                  styles.statCard,
                  styles.darkCard,
                  { backgroundColor: "#0B2554" },
                ]}
              >
                <Text style={styles.statLabelDark}>Active Rentals</Text>
                <Text style={[styles.statValueDark, { color: "#FFFFFF" }]}>
                  01
                </Text>
                <Text style={[styles.statSubDark, { color: "#FFFFFF" }]}>
                  Items you have now
                </Text>
              </View>

              <View style={[styles.statCard, styles.lightCard]}>
                <Text style={styles.statLabel}>Upcoming Pickups</Text>
                <Text style={styles.statValue}>
                  {String(upcomingPickups).padStart(2, "0")}
                </Text>
                <Text style={styles.statSub}>Pickup Scheduled</Text>
              </View>
            </View>

            {/* Renter Stats Row 2 */}
            <View style={styles.statsRow}>
              <View style={[styles.statCard, styles.orangeCard]}>
                <Text style={styles.statLabelDark}>Total Spent</Text>
                <Text style={styles.statValueDark}>
                  ₦{totalSpent.toLocaleString()}
                </Text>
                <Text style={styles.statSubDark}>All time</Text>
              </View>

              <TouchableOpacity
                style={[styles.statCard, styles.lightCard]}
                onPress={() => router.push("/booking")}
              >
                <View style={styles.bookingsHeader}>
                  <Text style={styles.statLabel}>Completed Rentals</Text>
                  <Text style={styles.link}>&gt;</Text>
                </View>
                <Text style={styles.statValue}>
                  {String(completedRentals).padStart(2, "0")}
                </Text>
                <Text style={styles.statSub}>Past orders</Text>
              </TouchableOpacity>
            </View>

            {/* YOUR ACTIVE RENTALS */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>YOUR ACTIVE RENTALS</Text>
                <TouchableOpacity onPress={() => router.push("/booking")}>
                  <Text style={styles.link}>View all &gt;</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.rentalRow}>
                <Image
                  source={require("../../assets/images/Sony.png")}
                  style={styles.itemImage}
                />
                <View style={styles.requestInfo}>
                  <Text style={styles.itemName}>Canon EOS R50</Text>
                  <Text style={styles.requestSub}>Owner: Tunde A.</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.returnDate}>Returns Aug 08</Text>
                  <Text style={styles.daysLeftText}>5 days left</Text>
                </View>
              </View>
            </View>

            {/* UPCOMING PICKUPS & RETURNS */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  UPCOMING PICKUPS & RETURNS
                </Text>
                <TouchableOpacity onPress={() => router.push("/booking")}>
                  <Text style={styles.link}>View all &gt;</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.timelineContainer}>
                <View style={styles.timelineItem}>
                  <View style={styles.timelineLeftColumn}>
                    <View style={[styles.dot, styles.pickupDot]} />
                    <View style={styles.verticalLine} />
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineHeader}>
                      <Text style={styles.pickupTag}>PICKUP </Text>
                      <Text style={styles.timelineTitle}>DJI Mini Drone</Text>
                    </Text>
                    <Text style={styles.timelineSub}>
                      Tunde A. (Owner) · Tomorrow · 10:00 AM
                    </Text>
                  </View>
                </View>

                <View style={styles.timelineItem}>
                  <View style={styles.timelineLeftColumn}>
                    <View style={[styles.dot, styles.returnDot]} />
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineHeader}>
                      <Text style={styles.returnTag}>RETURN </Text>
                      <Text style={styles.timelineTitle}>Canon EOS R50</Text>
                    </Text>
                    <Text style={styles.timelineSub}>
                      Yosi T. (Owner) · Aug 08 · 11:30 AM
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  backdrop: { flex: 1 },
  sidebarWrapper: { width: "80%", height: "100%" },
  timelineContainer: {
    paddingLeft: 4,
  },
  timelineItem: {
    flexDirection: "row",
    minHeight: 48,
  },
  timelineLeftColumn: {
    alignItems: "center",
    width: 20,
    marginRight: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },
  pickupDot: {
    backgroundColor: "#0B2554",
  },
  returnDot: {
    backgroundColor: "#E8A325",
  },
  verticalLine: {
    width: 1,
    flex: 1,
    backgroundColor: "#E5EAF2",
    marginVertical: 2,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 16,
  },
  timelineHeader: {
    fontSize: 13,
    lineHeight: 18,
  },
  pickupTag: {
    fontWeight: "bold",
    color: "#0B2554",
  },
  returnTag: {
    fontWeight: "bold",
    color: "#E8A325",
  },
  timelineTitle: {
    fontWeight: "600",
    color: "#0B2554",
  },
  timelineSub: {
    fontSize: 11,
    color: "#8A8AA0",
    marginTop: 2,
  },
  container: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    paddingHorizontal: 24,
  },
  content: {
    paddingBottom: 20,
    paddingTop: 10,
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
    fontWeight: "600",
  },
  daysLeftText: {
    fontSize: 11,
    color: "#2563EB",
    marginTop: 2,
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

  /* RENTER WALLET STYLES */
  renterWalletCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5EAF2",
  },
  walletTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0B2554",
    marginBottom: 10,
  },
  walletInnerBox: {
    backgroundColor: "#0B2554",
    borderRadius: 12,
    padding: 16,
  },
  walletLabel: {
    color: "#CBD5E1",
    fontSize: 12,
  },
  walletAmount: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
    marginVertical: 8,
  },
  addFundsBtn: {
    backgroundColor: "#E8A325",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
    marginTop: 4,
  },
  addFundsText: {
    color: "#0B2554",
    fontWeight: "700",
    fontSize: 13,
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingHorizontal: 12,
  },
  dayText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
  },
});