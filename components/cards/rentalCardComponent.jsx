import { Image, StyleSheet, Text, View } from "react-native";
import CustomButton from "../common/buttonComponent";

export default function RentalCard({
  title,
  owner,
  dateRange,
  status,
  imageUri,
  onViewDetails,
}) {
  return (
    <View style={styles.card}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder} />
      )}

      <View style={styles.detailsContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <Text style={styles.ownerText}>
          Owner: <Text style={styles.ownerName}>{owner}</Text>
        </Text>

        <Text style={styles.dateText}>{dateRange}</Text>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{status}</Text>
        </View>

        <CustomButton
          name="View Details"
          onPress={onViewDetails}
          style={styles.buttonStyle}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#E2E2E2",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#000000",
    padding: 12,
    marginVertical: 8,
    width: "80%",
    alignSelf: "center",
  },
  imagePlaceholder: {
    width: 110,
    height: "100%",
    minHeight: 140,
    backgroundColor: "#8E8E93",
    borderRadius: 12,
  },
  image: {
    width: 110,
    height: "100%",
    minHeight: 140,
    borderRadius: 12,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },
  ownerText: {
    fontSize: 12,
    color: "#555555",
    marginTop: 2,
  },
  ownerName: {
    fontWeight: "500",
    color: "#333333",
  },
  dateText: {
    fontSize: 12,
    color: "#666666",
    marginTop: 2,
  },
  statusBadge: {
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: "#FFFFFF",
    marginTop: 6,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#000000",
  },
  buttonStyle: {
    width: "100%",
    height: 38,
    borderRadius: 8,
    backgroundColor: "#1C1C1E",
  },
});
