import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import SafeArea from "../components/common/safeArea";
import HeaderBar from "../components/layout/headerComponents";
import { useUserStore } from "../store/useStore";

export default function CheckoutScreen() {
  const params = useLocalSearchParams();
  const { user, apiFetch } = useUserStore();

  const bookingId = params.bookingId;
  const equipmentId = params.equipmentId;
  const title = params.title || "Equipment";
  const imageUri = params.image || "";

  const dailyRate = Number(params.dailyRate || 0);
  const rentalAmount = Number(params.rentalAmount || 0);
  const securityDeposit = Number(params.depositAmount || 0);
  const totalAmount = Number(params.totalAmount || 0);

  const startDate = params.startDate || "";
  const endDate = params.endDate || "";

  const ownerName = params.ownerName || params.vendorName || "Verified Owner";

  const [loading, setLoading] = useState(false);
  const [paystackUrl, setPaystackUrl] = useState(null);

  const parseErrorMessage = (result) => {
    if (!result) return "Could not initialize payment. Please try again.";
    if (typeof result === "string") return result;

    if (
      typeof result.error === "object" &&
      typeof result.error?.message === "string"
    ) {
      return result.error.message;
    }
    if (typeof result.message === "string") return result.message;
    if (typeof result.error === "string") return result.error;
    if (typeof result.data?.message === "string") return result.data.message;

    if (typeof result.error === "object") return JSON.stringify(result.error);
    if (typeof result.message === "object")
      return JSON.stringify(result.message);

    return "Could not initialize payment. Please try again.";
  };

  const handleContinuePayment = async () => {
    if (!bookingId) {
      Alert.alert(
        "Error",
        "Missing booking reference. Please try booking again.",
      );
      return;
    }

    setLoading(true);

    try {
      const payload = {
        bookingId: String(bookingId),
        type: "deposit",
      };

      const { response, error } = await apiFetch("/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (error) {
        console.log("Payment Initialization Error:", error);
        const netErr =
          typeof error === "string" ? error : JSON.stringify(error);
        Alert.alert("Error", netErr || "Could not connect to payment server.");
        setLoading(false);
        return;
      }

      const result =
        typeof response?.json === "function" ? await response.json() : response;

      const authorizationUrl =
        result?.data?.authorizationUrl || result?.authorizationUrl;

      if (authorizationUrl) {
        setPaystackUrl(authorizationUrl);
      } else {
        const errorMsg = parseErrorMessage(result);
        Alert.alert("Payment Error", errorMsg);
      }
    } catch (err) {
      console.log("Error executing payment initialization:", err);
      const catchMsg =
        err?.message && typeof err.message === "string"
          ? err.message
          : JSON.stringify(err);
      Alert.alert("Error", catchMsg);
    } finally {
      setLoading(false);
    }
  };

  // Monitor Paystack WebView Navigation
  const handleWebViewStateChange = (navState) => {
    const url = navState.url.toLowerCase();

    // Check for success or completion callback
    if (
      url.includes("callback") ||
      url.includes("success") ||
      url.includes("trxref")
    ) {
      setPaystackUrl(null);
      Alert.alert(
        "Payment Successful",
        "Your booking payment has been processed!",
      );
      router.replace("/booking");
    }
    // Expanded keywords for cancel/close actions
    else if (
      url.includes("cancel") ||
      url.includes("close") ||
      url.includes("abort") ||
      url.includes("error")
    ) {
      setPaystackUrl(null);
      Alert.alert("Payment Cancelled", "The transaction was not completed.");
    }
  };

  if (paystackUrl) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View style={{ paddingTop: 40, backgroundColor: "#FFFFFF" }}>
          <HeaderBar
            name="Paystack Payment"
            onPress={() => setPaystackUrl(null)}
          />
        </View>
        <WebView
          source={{ uri: paystackUrl }}
          style={{ flex: 1 }}
          onNavigationStateChange={handleWebViewStateChange}
          startInLoadingState
          renderLoading={() => (
            <ActivityIndicator
              size="large"
              color="#0B2554"
              style={styles.webLoader}
            />
          )}
        />
      </View>
    );
  }

  return (
    <SafeArea style={styles.mainContainer}>
      <HeaderBar
        name="Checkout"
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
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.card}>
          <View style={styles.itemRow}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.itemImage} />
            ) : (
              <View style={styles.noImage}>
                <Ionicons name="camera-outline" size={32} color="#94A3B8" />
              </View>
            )}

            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>{title}</Text>

              <View style={styles.vendorRow}>
                <Text style={styles.vendorName}>{ownerName}</Text>
                <View style={styles.verifiedTag}>
                  <MaterialIcons name="verified" size={10} color="#166534" />
                  <Text style={styles.verifiedTagText}>Verified Owner</Text>
                </View>
              </View>

              <Text style={styles.itemRate}>
                ₦{dailyRate.toLocaleString()}{" "}
                <Text style={styles.rateUnit}>/day</Text>
              </Text>
            </View>
          </View>

          {startDate && endDate && (
            <View style={styles.datesContainer}>
              <Ionicons name="calendar-outline" size={14} color="#64748B" />
              <Text style={styles.datesText}>
                Rental Period: {startDate} to {endDate}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionHeader}>PAYMENT METHOD</Text>

          <View style={styles.singleMethodRow}>
            <View style={styles.radioCircleActive}>
              <View style={styles.radioDot} />
            </View>
            <Ionicons
              name="card-outline"
              size={20}
              color="#0B2554"
              style={styles.methodIcon}
            />
            <View style={styles.methodDetails}>
              <Text style={styles.methodText}>Debit / Credit Card</Text>
              <Text style={styles.methodSubtext}>
                Secured via Paystack Checkout
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionHeader}>PAYMENT SUMMARY</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Rent Fee</Text>
            <Text style={styles.summaryVal}>
              ₦{rentalAmount.toLocaleString()}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Security Deposit</Text>
            <Text style={styles.summaryVal}>
              ₦{securityDeposit.toLocaleString()}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalVal}>₦{totalAmount.toLocaleString()}</Text>
          </View>

          <Text style={styles.disclaimerText}>
            Your Security Deposit is held securely and will be fully refunded
            after the item is returned in good condition.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleContinuePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.primaryBtnText}>Continue To Payment</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 36,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: "row",
    gap: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
  },
  noImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0B2554",
  },
  vendorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  vendorName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  verifiedTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  verifiedTagText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#166534",
  },
  itemRate: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0B2554",
    marginTop: 8,
  },
  rateUnit: {
    fontSize: 11,
    fontWeight: "normal",
    color: "#64748B",
  },
  datesContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  datesText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "800",
    color: "#64748B",
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  singleMethodRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  radioCircleActive: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#0B2554",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#0B2554",
  },
  methodIcon: {
    marginRight: 10,
  },
  methodDetails: {
    flex: 1,
  },
  methodText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  methodSubtext: {
    fontSize: 11,
    fontWeight: "500",
    color: "#64748B",
    marginTop: 2,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: "500",
    color: "#64748B",
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 10,
  },
  totalLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "800",
    color: "#0B2554",
  },
  totalVal: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0B2554",
  },
  disclaimerText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#94A3B8",
    marginTop: 12,
    lineHeight: 14,
  },
  primaryBtn: {
    backgroundColor: "#0B2554",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  cancelBtn: {
    alignItems: "center",
    paddingVertical: 8,
  },
  cancelBtnText: {
    color: "#EF4444",
    fontSize: 13,
    fontWeight: "700",
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  webLoader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
