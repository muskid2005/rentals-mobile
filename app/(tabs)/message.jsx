import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useUserStore } from "../../store/useStore"; // Adjust path if needed

export default function SeedReviewsScreen() {
  const { apiFetch } = useUserStore();

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // John's Review Data
  const [johnBookingId, setJohnBookingId] = useState(
    "9afb57a8-76e7-4f08-81d6-9e147d655b64",
  );
  const [johnRating, setJohnRating] = useState("5");
  const [johnComment, setJohnComment] = useState(
    "Great experience renting this equipment! Everything was handled smoothly.",
  );

  async function checkEquipment() {
    const { response, error } = await apiFetch("/equipment/my");
    const result = await response.json();
    console.log(result.data);
  }

  // Rita's Review Data
  const [ritaBookingId, setRitaBookingId] = useState(
    "ce5c0322-9ef1-463a-8f2d-e70336505644",
  );
  const [ritaRating, setRitaRating] = useState("5");
  const [ritaComment, setRitaComment] = useState(
    "Excellent equipment and amazing service. Highly recommended!",
  );

  const handleSubmitSequential = async () => {
    if (!johnBookingId.trim() || !ritaBookingId.trim()) {
      Alert.alert("Error", "Please enter Booking IDs for both John and Rita.");
      return;
    }

    setLoading(true);
    setStatusMessage("Starting submissions...");

    const reviews = [
      {
        name: "John",
        bookingId: johnBookingId.trim(),
        rating: Number(johnRating) || 5,
        comment: johnComment.trim(),
      },
      {
        name: "Rita",
        bookingId: ritaBookingId.trim(),
        rating: Number(ritaRating) || 5,
        comment: ritaComment.trim(),
      },
    ];

    let successCount = 0;
    const errors = [];

    // Sequential Loop: Waits for item 1 to complete before starting item 2
    for (let i = 0; i < reviews.length; i++) {
      const item = reviews[i];
      setStatusMessage(`[${i + 1}/2] Submitting ${item.name}'s review...`);

      try {
        const { response, error } = await apiFetch("/reviews", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId: item.bookingId,
            rating: item.rating,
            comment: item.comment,
          }),
        });

        if (error) {
          errors.push(`${item.name}: ${error}`);
        } else if (response.ok) {
          successCount++;
        } else {
          const resJson = await response.json().catch(() => ({}));
          errors.push(`${item.name}: ${resJson.message || "Failed to submit"}`);
        }
      } catch (err) {
        errors.push(`${item.name}: ${err.message}`);
      }
    }

    setLoading(false);
    setStatusMessage("");

    if (successCount === 2) {
      Alert.alert(
        "Success!",
        "Both reviews were successfully saved to the API!",
      );
    } else {
      Alert.alert(
        "Result",
        `Submitted ${successCount}/2 reviews.\n\nErrors:\n` + errors.join("\n"),
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Sequential Review Seeder</Text>
        <Text style={styles.subtitle}>
          Submits John's review first, waits for the API response, then submits
          Rita's review.
        </Text>

        {/* JOHN CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>1. John's Review</Text>

          <Text style={styles.label}>John's Booking ID *</Text>
          <TextInput
            style={styles.input}
            placeholder="Paste John's Booking ID"
            value={johnBookingId}
            onChangeText={setJohnBookingId}
          />

          <Text style={styles.label}>Rating (1-5)</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={johnRating}
            onChangeText={setJohnRating}
          />

          <Text style={styles.label}>Comment</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={3}
            value={johnComment}
            onChangeText={setJohnComment}
          />
        </View>

        {/* RITA CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>2. Rita's Review</Text>

          <Text style={styles.label}>Rita's Booking ID *</Text>
          <TextInput
            style={styles.input}
            placeholder="Paste Rita's Booking ID"
            value={ritaBookingId}
            onChangeText={setRitaBookingId}
          />

          <Text style={styles.label}>Rating (1-5)</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={ritaRating}
            onChangeText={setRitaRating}
          />

          <Text style={styles.label}>Comment</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={3}
            value={ritaComment}
            onChangeText={setRitaComment}
          />
        </View>

        {statusMessage !== "" && (
          <Text style={styles.statusText}>{statusMessage}</Text>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmitSequential}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Submit Reviews One-By-One</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#4B5563", marginTop: 10 }]}
          onPress={checkEquipment}
        >
          <Text style={styles.buttonText}>Check My Equipment</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F5F7" },
  content: { padding: 20, gap: 16 },
  title: { fontSize: 22, fontWeight: "bold", color: "#0B2554" },
  subtitle: { fontSize: 13, color: "#64748B", marginBottom: 8 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0B2554",
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#0B2554",
    backgroundColor: "#FAFAFA",
  },
  textArea: { height: 60, textAlignVertical: "top" },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#E8A325",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#0B2554",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
});
