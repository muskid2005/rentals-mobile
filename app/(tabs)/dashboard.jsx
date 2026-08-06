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

export default function Dashboard() {
  const { user } = useUserStore();
  const { accepted, setAccepted } = useBookingStore();
  const { width } = useWindowDimensions();
  const [menuOpen, setMenuOpen] = useState(false);

  // OWNER ROLE CHECK VIA LAST NAME
  const isOwner = user?.lastName?.toLowerCase() === "verified";

  // Owner Data States
  const [listingCount, setListingCount] = useState(0);
  const [earning, setEarning] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [rentCount, setRentCount] = useState(0);
  const [bookingData, setBookingData] = useState(null);
  const [bookingData2, setBookingData2] = useState(null);

  // Renter States
  const [walletBalance, setWalletBalance] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [completedRentals, setCompletedRentals] = useState(0);
  const [upcomingPickups, setUpcomingPickups] = useState(0);
  const [activeRentalData, setActiveRentalData] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const { apiFetch } = useUserStore.getState();

        if (isOwner) {
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
              const bookings = bookRes.data || [];
              setBookingData(bookings[0] || null);
              setBookingData2(bookings[1] || null);
              setBookingCount(bookings.length);
            }
          } catch (err) {
            // Defaults remain 0 / null
          }
        } else {
          try {
            const { response: walletRes } = await apiFetch("/wallet");
            const { response: bookingsRes } =
              await apiFetch("/renter/bookings");

            if (walletRes?.ok) {
              const walletData = await walletRes.json();
              setWalletBalance(walletData.data?.balance || 0);
              setTotalSpent(walletData.data?.totalSpent || 0);
            }
            if (bookingsRes?.ok) {
              const bData = await bookingsRes.json();
              const bookings = bData.data || [];

              const active = bookings.find(
                (b) => b.status === "active" || b.status === "approved",
              );
              const completed = bookings.filter(
                (b) => b.status === "completed",
              ).length;
              const upcoming = bookings.filter((b) => b.status === "upcoming");

              setActiveRentalData(active || null);
              setCompletedRentals(completed);
              setUpcomingPickups(upcoming.length);
              setUpcomingEvents(upcoming);
            }
          } catch (err) {
            // Defaults remain 0 / null
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
              <View style={[styles.statCard, styles.darkCard]}>
                <Text style={styles.statLabelDark}>Active Rentals</Text>
                <Text style={styles.statValueDark}>{rentCount}</Text>
                <Text style={styles.statSubDark}>Items out right now</Text>
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
                  <TouchableOpacity onPress={() => router.push("/booking")}>
                    <Text style={[styles.link, { fontSize: 10 }]}>
                      View history &gt;
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.statValue}>{bookingCount}</Text>
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

              {bookingData ? (
                <View style={{ paddingBottom: 12 }}>
                  <View style={styles.requestRow}>
                    <Image
                      source={
                        bookingData?.equipment?.imageUrl
                          ? { uri: bookingData.equipment.imageUrl }
                          : require("../../assets/images/buildozer.png")
                      }
                      style={styles.itemImage}
                    />
                    <View style={styles.requestInfo}>
                      <Text style={styles.itemName}>
                        {bookingData?.equipment?.title || "Equipment"}
                      </Text>
                      <Text style={styles.requestSub}>
                        Requested by{" "}
                        {bookingData?.renter?.firstName || "Renter"}
                      </Text>
                      <Text style={styles.requestDates}>
                        {`${bookingData?.startDate || ""} to ${bookingData?.endDate || ""}`}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={styles.acceptButton}
                      onPress={handleAcceptBooking}
                    >
                      <Text style={styles.acceptText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.declineButton}
                      onPress={handleRejectBooking}
                    >
                      <Text style={styles.declineText}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    No pending booking requests
                  </Text>
                </View>
              )}
            </View>

            {/* ACTIVE RENTALS */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>ACTIVE RENTALS</Text>
                <TouchableOpacity onPress={() => router.push("/booking")}>
                  <Text style={styles.link}>View all &gt;</Text>
                </TouchableOpacity>
              </View>

              {rentCount > 0 ? (
                <View style={styles.rentalRow}>
                  <Image
                    source={require("../../assets/images/buildozer.png")}
                    style={styles.itemImage}
                  />
                  <View style={styles.requestInfo}>
                    <Text style={styles.itemName}>Heavy Excavator</Text>
                    <Text style={styles.requestSub}>Active Renter</Text>
                  </View>
                  <Text style={styles.returnDate}>In Progress</Text>
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    No active rentals currently
                  </Text>
                </View>
              )}
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
              <View style={[styles.statCard, styles.darkCard]}>
                <Text style={styles.statLabelDark}>Active Rentals</Text>
                <Text style={styles.statValueDark}>
                  {activeRentalData ? "01" : "00"}
                </Text>
                <Text style={styles.statSubDark}>Items you have now</Text>
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

              {activeRentalData ? (
                <View style={styles.rentalRow}>
                  <Image
                    source={
                      activeRentalData?.equipment?.imageUrl
                        ? { uri: activeRentalData.equipment.imageUrl }
                        : require("../../assets/images/buildozer.png")
                    }
                    style={styles.itemImage}
                  />
                  <View style={styles.requestInfo}>
                    <Text style={styles.itemName}>
                      {activeRentalData?.equipment?.title || "Equipment"}
                    </Text>
                    <Text style={styles.requestSub}>
                      Owner:{" "}
                      {activeRentalData?.owner?.firstName || "Verified Owner"}
                    </Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.returnDate}>
                      Returns {activeRentalData?.endDate || "N/A"}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyTitle}>No Active Rentals</Text>
                  <Text style={styles.emptySub}>
                    When you rent equipment, your active bookings will show up
                    here.
                  </Text>
                </View>
              )}
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

              {upcomingEvents.length > 0 ? (
                <View style={styles.timelineContainer}>
                  {upcomingEvents.map((item, index) => (
                    <View key={index} style={styles.timelineItem}>
                      <View style={styles.timelineLeftColumn}>
                        <View style={[styles.dot, styles.pickupDot]} />
                        {index < upcomingEvents.length - 1 && (
                          <View style={styles.verticalLine} />
                        )}
                      </View>
                      <View style={styles.timelineContent}>
                        <Text style={styles.timelineHeader}>
                          <Text style={styles.pickupTag}>PICKUP </Text>
                          <Text style={styles.timelineTitle}>
                            {item?.equipment?.title || "Equipment"}
                          </Text>
                        </Text>
                        <Text style={styles.timelineSub}>
                          {`${item?.owner?.firstName || "Owner"} · ${item?.startDate || ""}`}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyTitle}>No Upcoming Schedule</Text>
                  <Text style={styles.emptySub}>
                    Your scheduled pick-ups and returns will appear here.
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    width: "100%",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10,
  },

  /* TIMELINE */
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
    fontFamily: "mRegular",
  },
  pickupTag: {
    color: "#0B2554",
    fontFamily: "mBold",
  },
  returnTag: {
    color: "#E8A325",
    fontFamily: "mBold",
  },
  timelineTitle: {
    color: "#0B2554",
    fontFamily: "mSemiBold",
  },
  timelineSub: {
    fontSize: 11,
    color: "#8A8AA0",
    marginTop: 2,
    fontFamily: "mRegular",
  },

  /* STAT CARDS */
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
    fontFamily: "mMedium",
  },
  statLabelDark: {
    fontSize: 13,
    color: "#FFFFFF",
    fontFamily: "mMedium",
  },

  statValue: {
    fontSize: 28,
    color: "#0B2554",
    marginVertical: 4,
    fontFamily: "pBold",
  },
  statValueDark: {
    fontSize: 28,
    color: "#FFFFFF",
    marginVertical: 4,
    fontFamily: "pBold",
  },

  statSub: {
    fontSize: 12,
    color: "#0B2554",
    fontFamily: "mRegular",
  },
  statSubDark: {
    fontSize: 12,
    color: "#E2E8F0",
    fontFamily: "mRegular",
  },

  bookingsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  /* SECTION CARDS */
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E5EAF2",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 13,
    color: "#0B2554",
    letterSpacing: 0.5,
    fontFamily: "mBold",
  },
  link: {
    fontSize: 12,
    color: "#0B2554",
    fontFamily: "mSemiBold",
  },

  /* RENTAL ROWS & REQUESTS */
  requestRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  rentalRow: {
    flexDirection: "row",
    alignItems: "center",
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
    gap: 4,
  },
  itemName: {
    fontSize: 15,
    color: "#0B2554",
    fontFamily: "pSemiBold",
  },
  requestSub: {
    fontSize: 12,
    color: "#64748B",
    fontFamily: "mRegular",
  },
  requestDates: {
    fontSize: 12,
    color: "#64748B",
    fontFamily: "mRegular",
  },
  returnDate: {
    fontSize: 12,
    color: "#0B2554",
    fontFamily: "mMedium",
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
    fontSize: 13,
    fontFamily: "mSemiBold",
  },
  declineButton: {
    backgroundColor: "#E8A325",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  declineText: {
    color: "#0B2554",
    fontSize: 13,
    fontFamily: "mSemiBold",
  },

  /* EMPTY STATES */
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  emptyTitle: {
    fontSize: 13,
    color: "#0B2554",
    fontFamily: "mSemiBold",
    marginBottom: 2,
  },
  emptySub: {
    fontSize: 11,
    color: "#94A3B8",
    fontFamily: "mRegular",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 12,
    color: "#94A3B8",
    fontFamily: "mRegular",
  },

  /* RENTER WALLET */
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
    color: "#0B2554",
    marginBottom: 10,
    fontFamily: "mBold",
  },
  walletInnerBox: {
    backgroundColor: "#0B2554",
    borderRadius: 12,
    padding: 16,
  },
  walletLabel: {
    color: "#CBD5E1",
    fontSize: 12,
    fontFamily: "mRegular",
  },
  walletAmount: {
    color: "#FFFFFF",
    fontSize: 26,
    marginVertical: 8,
    fontFamily: "pBold",
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
    fontSize: 13,
    fontFamily: "mSemiBold",
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
    fontFamily: "mMedium",
  },
});
