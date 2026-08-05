import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import SafeArea from "../components/common/safeArea";
import HeaderBar from "../components/layout/headerComponents";
import { useUserStore } from "../store/useStore";

export default function OwnerEquipmentDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { user, apiFetch, deleteData } = useUserStore();
  const { width } = useWindowDimensions();

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchEquipmentDetails();
    }
  }, [id]);

  const fetchEquipmentDetails = async () => {
    setLoading(true);
    try {
      const { response, error } = await apiFetch(`/equipment/${id}`, {
        method: "GET",
      });

      if (!error && response?.ok) {
        const data = await response.json();
        setEquipment(data?.data || data);
      }
    } catch (err) {
      Alert.alert(
        "Error",
        err?.message || "Failed to fetch equipment details.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEquipment = () => {
    Alert.alert(
      "Delete Listing",
      "Are you sure you want to delete this equipment? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeleting(true);
            const { success, error } = await deleteData("/equipment", id);
            setDeleting(false);

            if (success) {
              Alert.alert("Success", "Equipment deleted successfully.", [
                {
                  text: "OK",
                  onPress: () => router.back(),
                },
              ]);
            } else {
              Alert.alert("Error", error || "Failed to delete equipment.");
            }
          },
        },
      ],
    );
  };

  const formatCurrency = (amount) => {
    const num = parseFloat(amount || 0);
    return `₦${num.toLocaleString("en-NG")}`;
  };

  if (loading) {
    return (
      <SafeArea>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0B2554" />
        </View>
      </SafeArea>
    );
  }

  if (!equipment) {
    return (
      <SafeArea>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Equipment details not found.</Text>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeArea>
    );
  }

  const photos = equipment.photos || [];
  const contentWidth = width - 32;

  return (
    <SafeArea>
      <HeaderBar
        name="Equipment Details"
        image={
          user?.profilePhotoUrl
            ? { uri: user.profilePhotoUrl }
            : require("../assets/images/profile.jpg")
        }
        onPress={() => router.back()}
        onNotificationPress={() => router.push("/NotificationsScreen")}
      />

      <ScrollView
        style={{ flex: 1, width: "100%" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Image Gallery */}
        <View style={[styles.imageContainer, { width: contentWidth }]}>
          {photos.length > 0 ? (
            <Image
              source={{ uri: photos[activeImageIndex]?.url || photos[0]?.url }}
              style={[styles.mainImage, { width: contentWidth }]}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.imagePlaceholder, { width: contentWidth }]}>
              <Ionicons name="image-outline" size={48} color="#94A3B8" />
              <Text style={styles.placeholderText}>No Images Available</Text>
            </View>
          )}

          {/* Thumbnail Strip */}
          {photos.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.thumbnailStrip}
            >
              {photos.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setActiveImageIndex(idx)}
                  style={[
                    styles.thumbnailWrapper,
                    activeImageIndex === idx && styles.activeThumbnail,
                  ]}
                >
                  <Image source={{ uri: item.url }} style={styles.thumbnail} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Title & Rates */}
        <View style={styles.sectionCard}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={styles.titleText}>{equipment.title}</Text>
              <Text style={styles.idText}>
                ID: TL-{equipment.id?.toString().slice(-5) || "N/A"}
              </Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {equipment.status || "Active"}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.rateGrid}>
            <View style={styles.rateBox}>
              <Text style={styles.rateLabel}>Daily Rate</Text>
              <Text style={styles.rateValue} numberOfLines={1}>
                {formatCurrency(equipment.dailyRate)}
              </Text>
            </View>
            {equipment.weeklyRate ? (
              <View style={styles.rateBox}>
                <Text style={styles.rateLabel}>Weekly Rate</Text>
                <Text style={styles.rateValue} numberOfLines={1}>
                  {formatCurrency(equipment.weeklyRate)}
                </Text>
              </View>
            ) : null}
            {equipment.monthlyRate ? (
              <View style={styles.rateBox}>
                <Text style={styles.rateLabel}>Monthly Rate</Text>
                <Text style={styles.rateValue} numberOfLines={1}>
                  {formatCurrency(equipment.monthlyRate)}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Performance Overview (Owner Stats) */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Listing Performance</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Ionicons name="cash-outline" size={20} color="#16A34A" />
              <Text style={styles.statNumber} numberOfLines={1}>
                {formatCurrency(equipment.totalEarnings || 0)}
              </Text>
              <Text style={styles.statLabel}>Total Earned</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="eye-outline" size={20} color="#2563EB" />
              <Text style={styles.statNumber} numberOfLines={1}>
                {equipment.views || 0}
              </Text>
              <Text style={styles.statLabel}>Views</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="repeat-outline" size={20} color="#D97706" />
              <Text style={styles.statNumber} numberOfLines={1}>
                {equipment.totalRentals || 0}
              </Text>
              <Text style={styles.statLabel}>Times Rented</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            {equipment.description ||
              "No description provided for this equipment listing."}
          </Text>
        </View>

        {/* Owner Management Actions */}
        <View style={styles.actionCard}>
          <Text style={styles.sectionTitle}>Manage Listing</Text>

          <TouchableOpacity
            style={styles.primaryActionBtn}
            onPress={() =>
              router.push({
                pathname: "/EditEquipmentScreen",
                params: { id: equipment.id },
              })
            }
          >
            <Ionicons name="create-outline" size={18} color="#FFFFFF" />
            <Text style={styles.primaryActionText}>Edit Details & Pricing</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryActionBtn}>
            <Ionicons name="calendar-outline" size={18} color="#0B2554" />
            <Text style={styles.secondaryActionText}>
              Manage Availability Calendar
            </Text>
          </TouchableOpacity>

          <View style={styles.rowActions}>
            <TouchableOpacity style={styles.outlineBtn}>
              <Ionicons name="pause-circle-outline" size={16} color="#D97706" />
              <Text style={[styles.outlineBtnText, { color: "#D97706" }]}>
                Pause Listing
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.outlineBtn, { borderColor: "#EF4444" }]}
              onPress={handleDeleteEquipment}
              disabled={deleting}
            >
              {deleting ? (
                <ActivityIndicator size="small" color="#EF4444" />
              ) : (
                <>
                  <Ionicons name="trash-outline" size={16} color="#EF4444" />
                  <Text style={[styles.outlineBtnText, { color: "#EF4444" }]}>
                    Delete
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },
  errorText: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 12,
  },
  backBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#0B2554",
    borderRadius: 8,
  },
  backBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  scrollContent: {
    // paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    alignItems: "stretch",
  },
  imageContainer: {
    marginBottom: 16,
    alignSelf: "center",
    borderRadius: 12,
  },
  mainImage: {
    height: 220,
    borderRadius: 12,
    backgroundColor: "#E2E8F0",
  },
  imagePlaceholder: {
    height: 220,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 12,
    color: "#94A3B8",
  },
  thumbnailStrip: {
    flexDirection: "row",
    marginTop: 10,
    width: "100%",
  },
  thumbnailWrapper: {
    marginRight: 8,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "transparent",
  },
  activeThumbnail: {
    borderColor: "#0B2554",
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 14,
    width: "100%",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  idText: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#16A34A",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 12,
  },
  rateGrid: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
  },
  rateBox: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  rateLabel: {
    fontSize: 10,
    color: "#64748B",
    fontWeight: "600",
  },
  rateValue: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
  },
  statBox: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  statNumber: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 4,
  },
  statLabel: {
    fontSize: 9,
    color: "#64748B",
    marginTop: 2,
    textAlign: "center",
  },
  descriptionText: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
  },
  actionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 10,
    width: "100%",
  },
  primaryActionBtn: {
    flexDirection: "row",
    backgroundColor: "#0B2554",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
  },
  primaryActionText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  secondaryActionBtn: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
  },
  secondaryActionText: {
    color: "#0B2554",
    fontSize: 13,
    fontWeight: "700",
  },
  rowActions: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
    marginTop: 4,
  },
  outlineBtn: {
    flex: 1,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  outlineBtnText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
