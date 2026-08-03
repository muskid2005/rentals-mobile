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
  const [userRole, setUserRole] = useState("owner");
  const [listingCount, setListingCount] = useState(0);
  const [earning, setEarning] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [rentCount, setRentCount] = useState(4);
  const [bookingData, setBookingData] = useState(null);
  const [bookingData2, setBookingData2] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const fetchListingsCount = async () => {
        const { apiFetch } = useUserStore.getState();
        const { response, error } = await apiFetch("/equipment/my");
        const { response: bookingRes, error: bookingErr } =
          await apiFetch("/owner/bookings");
        const { response: earningRes, error: earningErr } =
          await apiFetch("/earnings");

        if (error || bookingErr || earningErr) {
          Alert.alert("Error", error || bookingErr || earningErr);
          return;
        }

        try {
          const result = await response.json();
          const earningResult = await earningRes.json();
          const bookingResult = await bookingRes.json();
          const length = result.data?.length || 0;
          setBookingData(bookingResult.data[2]);
          setBookingData2(bookingResult.data[1]);
          setListingCount(length);
          setEarning(earningResult.data?.totalEarnings || 0);
          setBookingCount(bookingResult.data?.length || 0);
        } catch (err) {
          Alert.alert("Error", err.message || "Failed to fetch data.");
        }
      };

      fetchListingsCount();
    }, []),
  );

  function handleAcceptBooking() {
    setAccepted(true);
    setRentCount((prev) => prev + 1);
    Alert.alert("Booking Accepted", "You have accepted the booking request.");
  }

  function handleRejectBooking() {
    setAccepted(false);
    setRentCount((prev) => prev - 1);
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
        role="owner"
        onNavigate={(routeId) => {
          setMenuOpen(false);
          router.replace(routeId);
          // console.log("Navigating to:", routeId);
        }}
      />

      <ScrollView
        style={[styles.container, { width: width }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsRow}>
          <View
            style={[
              styles.statCard,
              styles.darkCard,
              { backgroundColor: "#0B2554" },
            ]}
          >
            <Text style={styles.statLabelDark}>Active Rentals</Text>
            <Text style={[styles.statValueDark, { color: "#FFFF" }]}>
              {rentCount}
            </Text>
            <Text style={[styles.statSubDark, { color: "#FFFF" }]}>
              Items out right now
            </Text>
          </View>

          <View style={[styles.statCard, styles.lightCard]}>
            <Text style={styles.statLabel}>Active Listings</Text>
            <Text style={styles.statValue}>{listingCount}</Text>
            <Text style={styles.statSub}>2 awaiting your response</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.orangeCard]}>
            <Text style={styles.statLabelDark}>Total Earnings</Text>
            <Text style={styles.statValueDark}>{earning.toLocaleString()}</Text>
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
              {accepted ? bookingCount - 1 : bookingCount.toLocaleString()}
            </Text>
            <Text style={styles.statSub}>Releasing in 2 days</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>PENDING BOOKING REQUESTS</Text>
            <TouchableOpacity onPress={() => router.push("/booking")}>
              <Text style={styles.link}>View all &gt;</Text>
            </TouchableOpacity>
          </View>

          {accepted === false ? (
            <View style={styles.requestRow}>
              <Image
                source={require("../../assets/images/buildozer.png")}
                style={styles.itemImage}
              />
              <View style={styles.requestInfo}>
                <Text style={styles.itemName}>
                  {bookingData?.equipment.title}
                </Text>
                <View>
                  <Text
                    style={styles.requestSub}
                  >{`Requested by ${bookingData?.renter.firstName}`}</Text>
                  <Text style={styles.requestDates}>
                    {`${bookingData?.startDate} to ${bookingData?.endDate}`}
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
                  {bookingData2?.equipment.title}
                </Text>
                <View>
                  <Text style={styles.requestSub}>{`Requested by John`}</Text>
                  <Text style={styles.requestDates}>
                    {`${bookingData2?.startDate} to ${bookingData2?.endDate}`}
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
                  {bookingData?.equipment?.title}
                </Text>
                <View>
                  <Text style={styles.requestSub}>
                    {`renter: ${bookingData?.renter?.firstName || ""}`}
                  </Text>
                </View>
              </View>
              <Text
                style={styles.returnDate}
              >{`Returns Jul ${bookingData?.endDate.split("-")[2]}`}</Text>
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
            <Text style={styles.returnDate}>Returns Jul 25</Text>
          </View>

          <View style={styles.rentalRow}>
            <Image
              source={require("../../assets/images/Nikkon.png")}
              style={styles.itemImage}
            />
            <View style={styles.requestInfo}>
              <Text style={styles.itemName}>Nikon Z30</Text>
              <Text style={styles.requestSub}>Renter: Tobi A.</Text>
            </View>
            <Text style={styles.returnDate}>Returns Jul 27</Text>
          </View>
        </View>

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
                <View style={styles.verticalLine} />
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineHeader}>
                  <Text style={styles.returnTag}>RETURN </Text>
                  <Text style={styles.timelineTitle}>DJI RS 3 Gimbal</Text>
                </Text>
                <Text style={styles.timelineSub}>
                  Daniel T. · Today · 3:00 PM
                </Text>
              </View>
            </View>

            <View style={styles.timelineItem}>
              <View style={styles.timelineLeftColumn}>
                <View style={[styles.dot, styles.pickupDot]} />
                <View style={styles.verticalLine} />
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineHeader}>
                  <Text style={styles.pickupTag}>PICKUP </Text>
                  <Text style={styles.timelineTitle}>Nikon Z30</Text>
                </Text>
                <Text style={styles.timelineSub}>
                  Ama K. · Tomorrow · 9:00 AM
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
                  <Text style={styles.timelineTitle}>Sony FX3</Text>
                </Text>
                <Text style={styles.timelineSub}>
                  Esioma M. · Jul 25 · 11:00 AM
                </Text>
              </View>
            </View>
          </View>
        </View>
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
