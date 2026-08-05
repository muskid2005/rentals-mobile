import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import SaveArea from "../../components/common/safeArea";
import HeaderBar from "../../components/layout/headerComponents";
import { useUserStore } from "../../store/useStore";

export default function RenterListItemScreen() {
  const apiFetch = useUserStore((state) => state.apiFetch);
  const user = useUserStore((state) => state.user);

  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    setLoading(true);
    const { response, error } = await apiFetch("/equipment", { method: "GET" });

    if (!error && response?.ok) {
      try {
        const result = await response.json();
        setEquipmentList(result.data || []);
      } catch (err) {
        console.log("Error parsing json:", err);
      }
    } else {
      console.log("Error fetching equipment:", error);
    }
    setLoading(false);
  };

  const categories = useMemo(() => {
    const counts = {};
    equipmentList.forEach((item) => {
      if (item.category) {
        counts[item.category] = (counts[item.category] || 0) + 1;
      }
    });

    return Object.keys(counts).map((catName) => ({
      name: catName,
      count: counts[catName],
    }));
  }, [equipmentList]);

  const filteredEquipment = useMemo(() => {
    return equipmentList.filter((item) => {
      const matchesSearch =
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory
        ? item.category === selectedCategory
        : true;

      return matchesSearch && matchesCategory;
    });
  }, [equipmentList, searchQuery, selectedCategory]);

  const isSearching = searchQuery.trim().length > 0;

  return (
    <SaveArea style={styles.mainContainer}>
      <HeaderBar
        name="Browse Equipment"
        image={
          user?.profilePhotoUrl
            ? { uri: user.profilePhotoUrl }
            : require("../../assets/images/cardimage.png")
        }
        onPress={() => {}}
        onNotificationPress={() => router.push("/notifications")}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* SEARCH BAR & FILTER BUTTON */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={18} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search equipment or keywords"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {isSearching && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={18} color="#999" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* HIDE CATEGORIES AND BANNER WHEN SEARCHING */}
        {!isSearching && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>BROWSE BY CATEGORY</Text>
              <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                <Text style={styles.viewAll}>View all</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
            >
              {categories.map((cat, idx) => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.categoryCard,
                      isSelected && styles.categoryCardSelected,
                    ]}
                    onPress={() =>
                      setSelectedCategory(isSelected ? null : cat.name)
                    }
                  >
                    <View style={styles.categoryIconContainer}>
                      <MaterialCommunityIcons
                        name="tools"
                        size={22}
                        color={isSelected ? "#002B49" : "#666"}
                      />
                    </View>
                    <Text style={styles.categoryName} numberOfLines={1}>
                      {cat.name}
                    </Text>
                    <Text style={styles.categoryCount}>{cat.count} Items</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.bannerContainer}>
              <View style={styles.bannerTextContainer}>
                <Text style={styles.bannerTitle}>
                  Need equipment for your next project?
                </Text>
                <Text style={styles.bannerSubtitle}>
                  Rent quality gear from verified owners near you.
                </Text>
                <TouchableOpacity style={styles.bannerBtn}>
                  <Text style={styles.bannerBtnText}>Explore now</Text>
                </TouchableOpacity>
              </View>
              <Image
                source={require("../../assets/images/cardimage.png")}
                style={styles.bannerImage}
                resizeMode="contain"
              />
            </View>
          </>
        )}

        {/* ALL EQUIPMENT TITLE */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {isSearching ? "SEARCH RESULTS" : "ALL EQUIPMENT"}
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#002B49"
            style={{ marginVertical: 20 }}
          />
        ) : (
          <View style={styles.gridContainer}>
            {/* Real Equipment Cards */}
            {filteredEquipment.map((item) => {
              const primaryPhoto =
                item.photos?.find((p) => p.isPrimary)?.url ||
                item.photos?.[0]?.url;

              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.card}
                  activeOpacity={0.8}
                  onPress={() =>
                    router.push({
                      pathname: "/equipment-details",
                      params: { id: item.id },
                    })
                  }
                >
                  {primaryPhoto ? (
                    <Image
                      source={{ uri: primaryPhoto }}
                      style={styles.cardImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.noImageContainer}>
                      <Ionicons
                        name="image-outline"
                        size={32}
                        color="#B0B7C3"
                      />
                      <Text style={styles.noImageText}>No Image Available</Text>
                    </View>
                  )}
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.cardCategory}>
                      {item.category || "General"}
                    </Text>

                    <Text style={styles.cardPrice}>
                      ₦{Number(item.dailyRate || 0).toLocaleString()}{" "}
                      <Text style={styles.perDay}>/ day</Text>
                    </Text>

                    <View style={styles.cardFooter}>
                      <View style={styles.locationContainer}>
                        <Ionicons
                          name="location-outline"
                          size={12}
                          color="#666"
                        />
                        <Text style={styles.locationText} numberOfLines={1}>
                          {item.address || "N/A"}
                        </Text>
                      </View>
                      <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={12} color="#FFD700" />
                        <Text style={styles.ratingText}>4.8</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Invisible Box for Odd Result Counts (1, 3, 5, etc.) */}
            {filteredEquipment.length % 2 !== 0 && (
              <View style={styles.invisibleCard} />
            )}

            {/* Empty State when 0 results are found */}
            {filteredEquipment.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No equipment found.</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SaveArea>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    // flexGrow: 1,
  },
  searchRow: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  filterBtn: {
    width: 44,
    height: 44,
    backgroundColor: "#002B49",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#002B49",
    letterSpacing: 0.5,
  },
  viewAll: {
    fontSize: 12,
    color: "#0056B3",
  },
  categoryScroll: {
    marginBottom: 20,
  },
  categoryCard: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginRight: 10,
    width: 80,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  categoryCardSelected: {
    borderColor: "#002B49",
    backgroundColor: "#E6F0FA",
  },
  categoryIconContainer: {
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 11,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  categoryCount: {
    fontSize: 9,
    color: "#888",
    marginTop: 2,
  },
  bannerContainer: {
    backgroundColor: "#0A192F",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    overflow: "hidden",
  },
  bannerTextContainer: {
    // flex: 1,
    width: "50%",
  },
  bannerTitle: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: "#94A3B8",
    fontSize: 10,
    marginBottom: 10,
  },
  bannerBtn: {
    backgroundColor: "#FFB800",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  bannerBtnText: {
    color: "#000",
    fontSize: 11,
    fontWeight: "bold",
  },
  bannerImage: {
    width: 140,
    height: 100,
    marginLeft: 10,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  card: {
    width: "48%",
    marginBottom: 14,
    backgroundColor: "#FFF",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  invisibleCard: {
    width: "48%",
    opacity: 0,
    pointerEvents: "none",
  },
  cardImage: {
    width: "100%",
    height: 110,
    backgroundColor: "#F3F4F6",
  },
  noImageContainer: {
    height: 110,
    backgroundColor: "#F5F6F8",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },
  noImageText: {
    marginTop: 6,
    fontSize: 11,
    color: "#8A8A8A",
    fontWeight: "500",
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  cardCategory: {
    fontSize: 10,
    color: "#777",
    marginVertical: 2,
  },
  cardPrice: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#002B49",
    marginTop: 4,
  },
  perDay: {
    fontSize: 10,
    fontWeight: "normal",
    color: "#666",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 4,
  },
  locationText: {
    fontSize: 9,
    color: "#666",
    marginLeft: 2,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 2,
  },
  emptyContainer: {
    width: "100%",
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    fontSize: 14,
  },
});
