import { AntDesign } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SavedEquipmentCard({
  title,
  price,
  rating,
  imageUri,
  isFavorite,
  onPress,
  onFavoritePress,
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}

        <TouchableOpacity style={styles.heartButton} onPress={onFavoritePress}>
          <FontAwesome
            name={isFavorite ? "heart" : "heart-o"}
            size={14}
            color="#000000"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.price}>{price}</Text>

      <View style={styles.ratingRow}>
        <Text style={styles.ratingText}>{rating}</Text>
        <AntDesign
          name="star"
          size={12}
          color="#000000"
          style={styles.starIcon}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    maxWidth: "45%",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 1,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#8E8E93",
    marginBottom: 8,
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#8E8E93",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  heartButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
  },
  price: {
    fontSize: 12,
    color: "#666666",
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333333",
  },
  starIcon: {
    marginLeft: 4,
  },
});
