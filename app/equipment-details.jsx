import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { WebView } from "react-native-webview";
import SaveArea from "../components/common/safeArea";
import HeaderBar from "../components/layout/headerComponents";
import { useUserStore } from "../store/useStore";

export default function EquipmentDetailsScreen() {
  const { id } = useLocalSearchParams();
  const apiFetch = useUserStore((state) => state.apiFetch);
  const user = useUserStore((state) => state.user);
  const { width } = useWindowDimensions();

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState(true);
  const isOwner = user?.lastName?.toLowerCase() === "verified";

  // Availability Modal State
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [availabilityData, setAvailabilityData] = useState(null);

  useEffect(() => {
    fetchEquipmentDetail();
  }, [id]);

  const fetchEquipmentDetail = async () => {
    setLoading(true);
    const { response, error } = await apiFetch("/equipment", { method: "GET" });

    if (!error && response?.ok) {
      try {
        const result = await response.json();
        setInfo(result);
        const list = result.data || result || [];
        const found = list.find((item) => String(item.id) === String(id));
        setEquipment(found || null);
      } catch (err) {
        console.log("Error parsing json:", err);
      }
    } else {
      console.log("Error fetching equipment details:", error);
    }
    setLoading(false);
  };

  // Handle Availability Check API Endpoint
  const handleCheckAvailability = async () => {
    Alert.alert("Check Availability", "This feature is not yet implemented.");
    // if (!equipment?.id) return;
    // setCheckingAvailability(true);

    // const { response, error } = await apiFetch(
    //   `/equipment/${equipment.id}/availability`,
    //   { method: "GET" },
    // );

    // setCheckingAvailability(false);

    // if (!error && response?.ok) {
    //   try {
    //     const result = await response.json();
    //     const data = result.data || result;

    //     // Checks if payload returns isAvailable or boolean structure
    //     const availableStatus =
    //       typeof data.isAvailable === "boolean"
    //         ? data.isAvailable
    //         : typeof data === "boolean"
    //           ? data
    //           : true; // Default fallback to true if status is positive

    //     setIsAvailable(availableStatus);
    //     setAvailabilityData(data);
    //     setModalVisible(true);
    //   } catch (err) {
    //     console.log("Error parsing availability endpoint response:", err);
    //     // Fallback default modal view on parse issue
    //     setIsAvailable(false);
    //     setModalVisible(true);
    //   }
    // } else {
    //   console.log("Error fetching availability:", error);
    //   setIsAvailable(false);
    //   setModalVisible(true);
    // }
  };

  // ------------------------------------------------------------------
  async function handleMessage() {
    setLoading(true);
    const targetEquipmentId = id;
    const recipientId = info.data[1]?.ownerId;

    try {
      // 1. Check existing conversations first
      const { response: listRes } = await apiFetch(
        "/conversations?page=1&limit=50",
        {
          method: "GET",
        },
      );

      if (listRes) {
        const listData =
          typeof listRes.json === "function" ? await listRes.json() : listRes;
        const conversations = listData?.data || [];

        // 2. Look for an existing chat matching this equipment and owner
        const existingChat = conversations.find(
          (chat) =>
            chat.equipmentId === targetEquipmentId &&
            (chat.participantOneId === recipientId ||
              chat.participantTwoId === recipientId),
        );

        // 3. If found, route directly to it without creating a duplicate
        if (existingChat) {
          router.push({
            pathname: "/messageChat",
            params: {
              id: existingChat.id,
              equipmentId: existingChat.equipmentId,
              participantOneId: existingChat.participantOneId,
              participantTwoId: existingChat.participantTwoId,
              lastMessageAt: existingChat.lastMessageAt,
              lastMessagePreview: existingChat.lastMessagePreview,
              createdAt: existingChat.createdAt,
              updatedAt: existingChat.updatedAt,
            },
          });
          setLoading(false);
          return;
        }
      }

      // 4. Otherwise, create a new one if none exists
      const { response, error } = await apiFetch("/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId: recipientId,
          equipmentId: targetEquipmentId,
        }),
      });

      if (error) {
        console.log("Error:", error);
        setLoading(false);
        return;
      }

      const apiResponse =
        typeof response.json === "function" ? await response.json() : response;

      router.push({
        pathname: "/messageChat",
        params: {
          id: apiResponse.data.id,
          equipmentId: apiResponse.data.equipmentId,
          participantOneId: apiResponse.data.participantOneId,
          participantTwoId: apiResponse.data.participantTwoId,
          lastMessageAt: apiResponse.data.lastMessageAt,
          lastMessagePreview: apiResponse.data.lastMessagePreview,
          createdAt: apiResponse.data.createdAt,
          updatedAt: apiResponse.data.updatedAt,
        },
      });
    } catch (err) {
      console.log("Error handling message flow:", err);
    } finally {
      setLoading(false);
    }
  }
  // ----------------------------------------------------------------

  // Leaflet HTML
  const renderLeafletMap = (lat, lng) => {
    const latitude = Number(lat) || 7.3775;
    const longitude = Number(lng) || 3.947;

    return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
          <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
          <style>
            body, html, #map { height: 100%; margin: 0; padding: 0; width: 100%; }
            .leaflet-container { background: #f4f7fc; }
            .leaflet-control-attribution { display: none !important; }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            window.map = L.map('map', { zoomControl: false, dragging: false, touchZoom: false }).setView([${latitude}, ${longitude}], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19
            }).addTo(window.map);

            window.marker = L.marker([${latitude}, ${longitude}]).addTo(window.map);
          </script>
        </body>
        </html>
      `;
  };

  if (loading) {
    return (
      <SaveArea style={styles.mainContainer}>
        <HeaderBar
          name="Equipment Details"
          onPress={() => router.back()}
          onNotificationPress={() => router.push("/notifications")}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#002B49" />
        </View>
      </SaveArea>
    );
  }

  if (!equipment) {
    return (
      <SaveArea style={styles.mainContainer}>
        <HeaderBar
          name="Equipment Details"
          image={
            user?.profilePhotoUrl
              ? { uri: user.profilePhotoUrl }
              : require("../assets/images/cardimage.png")
          }
          onPress={() => router.back()}
          onNotificationPress={() => router.push("/notifications")}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.notFoundText}>Equipment not found.</Text>
        </View>
      </SaveArea>
    );
  }

  const primaryPhoto =
    equipment.photos?.find((p) => p.isPrimary)?.url ||
    equipment.photos?.[0]?.url;

  return (
    <SaveArea>
      <HeaderBar
        name="Equipment Details"
        image={
          user?.profilePhotoUrl
            ? { uri: user.profilePhotoUrl }
            : require("../assets/images/cardimage.png")
        }
        onPress={() => router.back()}
        onNotificationPress={() => router.push("/notifications")}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { width: width - 48 }]}
      >
        {/* TOP EQUIPMENT IMAGE */}
        <View style={styles.imageContainer}>
          {primaryPhoto ? (
            <Image
              source={{ uri: primaryPhoto }}
              style={styles.equipmentImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.noImageContainer}>
              <Ionicons name="image-outline" size={48} color="#B0B7C3" />
              <Text style={styles.noImageText}>No Image Available</Text>
            </View>
          )}
        </View>

        {/* VERIFIED BADGE & ID */}
        <View style={styles.badgeRow}>
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#2E7D32" />
            <Text style={styles.verifiedText}>VERIFIED</Text>
          </View>
          <Text style={styles.idText}>
            ID #
            {equipment.id
              ? String(equipment.id).slice(0, 7).toUpperCase()
              : "N/A"}
          </Text>
        </View>

        {/* TITLE & SHORT SUBTITLE */}
        <Text style={styles.titleText}>{equipment.title}</Text>
        <Text style={styles.subtitleText}>
          {equipment.description ||
            "Projecting powerful, clear sound to a large crowd while maintaining consistent audio quality throughout the venue."}
        </Text>

        {/* DAILY RATE & WEEKLY RATE CARDS */}
        <View style={styles.rateRow}>
          <View style={styles.rateCard}>
            <Text style={styles.rateLabel}>DAILY RATE</Text>
            <Text style={styles.rateValue}>
              ₦{Number(equipment.dailyRate || 0).toLocaleString()}{" "}
              <Text style={styles.rateUnit}>/day</Text>
            </Text>
          </View>

          <View style={styles.rateCard}>
            <Text style={styles.rateLabel}>WEEKLY RATE</Text>
            <Text style={styles.rateValue}>
              ₦{Number(equipment.weeklyRate || 0).toLocaleString()}{" "}
              <Text style={styles.rateUnit}>/day</Text>
            </Text>
          </View>
        </View>

        {/* SECURITY DEPOSIT BANNER */}
        <View style={styles.depositCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.depositLabel}>SECURITY DEPOSIT</Text>
            <Text style={styles.depositValue}>
              ₦{Number(equipment.securityDepositAmount || 0).toLocaleString()}
            </Text>
          </View>
          <Ionicons
            name="information-circle-outline"
            size={22}
            color="#64748B"
          />
        </View>

        {/* ABOUT SECTION */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>ABOUT</Text>
          <Text style={styles.aboutText}>
            {equipment.description ||
              "Distribute sound evenly from the front row to the back row. Reduce dead spots and excessive reflections, increase sound throw distance while maintaining clarity."}
          </Text>
        </View>

        {/* KEY SPECIFICATIONS */}
        <View style={styles.specsCard}>
          <Text style={styles.specsTitle}>KEY SPECIFICATIONS</Text>
          <View style={styles.specsRow}>
            <View style={styles.specBox}>
              <Text style={styles.specLabel}>FREQUENCY</Text>
              <Text style={styles.specValue}>
                {equipment.brand || "55Hz-180Hz"}
              </Text>
            </View>

            <View style={styles.specBox}>
              <Text style={styles.specLabel}>PEAK SPL</Text>
              <Text style={styles.specValue}>
                {equipment.model || "Up to 137dB"}
              </Text>
            </View>

            <View style={styles.specBox}>
              <Text style={styles.specLabel}>COVERAGE</Text>
              <Text style={styles.specValue}>
                {equipment.condition || "Horizontal Coverage"}
              </Text>
            </View>
          </View>
        </View>

        {/* PICKUP LOCATION SECTION */}
        <View style={styles.sectionContainerMap}>
          <View style={styles.locationHeaderRow}>
            <Text style={styles.sectionTitle}>PICK UP LOCATION</Text>
            <TouchableOpacity>
              <Text style={styles.viewMapText}>View Map</Text>
            </TouchableOpacity>
          </View>

          {/* LEAFLET MAP VIEW WITH ADDRESS OVERLAY */}
          <View style={styles.mapCard}>
            <WebView
              originWhitelist={["*"]}
              source={{
                html: renderLeafletMap(equipment.latitude, equipment.longitude),
              }}
              style={styles.webViewMap}
              scrollEnabled={false}
            />
            <View style={styles.addressOverlay}>
              <Ionicons name="location" size={14} color="#0F382C" />
              <Text style={styles.addressOverlayText} numberOfLines={1}>
                {equipment.address || "Ikeja, Lagos (3.2 miles away)"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* FULL-WIDTH FOOTER ACTION BUTTONS */}
      {!isOwner && (
        <View style={[styles.footerRowContainer, { width: width }]}>
          <TouchableOpacity
            style={styles.messageBtn}
            onPress={() => handleMessage()}
          >
            <Ionicons name="chatbubble-outline" size={16} color="#002B49" />
            <Text style={styles.messageBtnText}>MESSAGE</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.availabilityBtn}
            onPress={handleCheckAvailability}
            disabled={checkingAvailability}
          >
            {checkingAvailability ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.availabilityBtnText}>Book Equipment</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* AVAILABILITY STATUS MODAL POPUP */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View
              style={[
                styles.modalIconContainer,
                isAvailable ? styles.bgSuccess : styles.bgDanger,
              ]}
            >
              <Ionicons
                name={isAvailable ? "checkmark-circle" : "close-circle"}
                size={40}
                color={isAvailable ? "#166534" : "#991B1B"}
              />
            </View>

            <Text style={styles.modalTitle}>
              {isAvailable ? "Equipment Available!" : "Equipment Unavailable"}
            </Text>

            <Text style={styles.modalDescription}>
              {isAvailable
                ? "This item is currently available for rental. You can proceed directly to checkout to complete your booking."
                : "Sorry, this item is currently booked or unavailable for the selected timeframe."}
            </Text>

            <View style={styles.modalActionRow}>
              {/* Cancel Button */}
              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  isAvailable ? styles.modalBtnSecondary : styles.modalBtnFull,
                ]}
                onPress={() => setModalVisible(false)}
              >
                <Text
                  style={[
                    styles.modalBtnText,
                    isAvailable
                      ? styles.modalBtnTextSecondary
                      : styles.modalBtnTextPrimary,
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              {/* Continue to Checkout Button (Shown only if available) */}
              {isAvailable && (
                <TouchableOpacity
                  style={[styles.modalBtn, styles.modalBtnPrimary]}
                  onPress={() => {
                    setModalVisible(false);
                    router.push({
                      pathname: "/checkout",
                      params: { id: equipment.id },
                    });
                  }}
                >
                  <Text style={styles.modalBtnTextPrimary}>
                    Continue to Checkout
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SaveArea>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundText: {
    fontSize: 14,
    color: "#64748B",
  },
  scrollContent: {
    // paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 28,
  },
  imageContainer: {
    width: "100%",
    height: 260,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#E2E8F0",
    marginBottom: 20,
  },
  equipmentImage: {
    width: "100%",
    height: "100%",
  },
  noImageContainer: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    marginTop: 8,
    fontSize: 12,
    color: "#94A3B8",
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    gap: 4,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#166534",
  },
  idText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
    lineHeight: 26,
  },
  subtitleText: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 20,
    marginBottom: 20,
  },
  rateRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 16,
  },
  rateCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  rateLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  rateValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#002B49",
  },
  rateUnit: {
    fontSize: 12,
    fontWeight: "normal",
    color: "#64748B",
  },
  depositCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  depositLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#475569",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  depositValue: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionContainerMap: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#002B49",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 20,
  },
  specsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 24,
  },
  specsTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#002B49",
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  specsRow: {
    flexDirection: "row",
    gap: 10,
  },
  specBox: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  specLabel: {
    fontSize: 9,
    color: "#64748B",
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "center",
  },
  specValue: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
  },
  locationHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  viewMapText: {
    fontSize: 12,
    color: "#002B49",
    fontWeight: "600",
  },
  mapCard: {
    height: 180,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  webViewMap: {
    flex: 1,
  },
  addressOverlay: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  addressOverlayText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
    flex: 1,
  },
  footerRowContainer: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    gap: 12,
  },
  messageBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#002B49",
    gap: 6,
  },
  messageBtnText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#002B49",
  },
  availabilityBtn: {
    flex: 1,
    backgroundColor: "#002B49",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
  availabilityBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  bgSuccess: {
    backgroundColor: "#DCFCE7",
  },
  bgDanger: {
    backgroundColor: "#FEE2E2",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 24,
  },
  modalActionRow: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBtnFull: {
    width: "100%",
    backgroundColor: "#002B49",
  },
  modalBtnPrimary: {
    backgroundColor: "#002B49",
  },
  modalBtnSecondary: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  modalBtnTextPrimary: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  modalBtnTextSecondary: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "700",
  },
});
