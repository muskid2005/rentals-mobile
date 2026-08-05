import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import SafeArea from "../components/common/safeArea";
import Sidebar from "../components/common/sideBar";
import HeaderBar from "../components/layout/headerComponents";
import { useUserStore } from "../store/useStore";

export default function ReviewsScreen() {
  const { user, apiFetch } = useUserStore();
  const { width } = useWindowDimensions();

  // Check if user is owner
  const isOwner = user?.lastName?.toLowerCase() === "verified";

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(5.0);

  // Initial code's dummy reviews for owners
  const dummyReviews = [
    {
      id: "dummy-1",
      name: "Rita",
      verified: true,
      timeAgo: "2 days Ago",
      stars: 5,
      comment:
        "Excellent heavy equipment and amazing service! The owner was very helpful throughout the rental process.",
      item: "MAX VAT 5075A BULLDOZER",
      category: "good",
    },
    {
      id: "dummy-2",
      name: "John",
      verified: true,
      timeAgo: "5 days Ago",
      stars: 5,
      comment:
        "Great experience renting this camera! Everything was handled smoothly and in perfect condition.",
      item: "CAMERA A06G",
      category: "good",
    },
  ];

  useEffect(() => {
    if (isOwner) {
      fetchReviews();
    } else {
      setLoading(false);
    }
  }, [isOwner]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { response, error } = await apiFetch("/reviews/user/", {
        method: "GET",
      });

      if (!error && response?.ok) {
        const data = await response.json();
        const fetchedList = Array.isArray(data)
          ? data
          : data?.data || data?.reviews || [];

        if (fetchedList.length > 0) {
          const formatted = fetchedList.map((item, index) => ({
            id: item.id || item._id || String(index),
            name:
              item.reviewerName ||
              item.user?.fullName ||
              item.user?.firstName ||
              "Anonymous User",
            verified: true,
            timeAgo: item.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : "Recently",
            stars: item.rating || 5,
            comment: item.comment || item.review || "No comment provided.",
            item:
              item.booking?.equipment?.title ||
              item.equipmentName ||
              "Equipment Item",
            category: (item.rating || 5) >= 4 ? "good" : "fair",
          }));

          setReviews(formatted);
          const totalStars = formatted.reduce(
            (acc, curr) => acc + curr.stars,
            0,
          );
          const avg = (totalStars / formatted.length).toFixed(1);
          setAverageRating(Number(avg) || 5.0);
        } else {
          setReviews(dummyReviews);
          setAverageRating(5.0);
        }
      } else {
        setReviews(dummyReviews);
        setAverageRating(5.0);
      }
    } catch (err) {
      setReviews(dummyReviews);
      setAverageRating(5.0);
    } finally {
      setLoading(false);
    }
  };

  const ratingDistribution = [
    { star: 5, percentage: 100 },
    { star: 4, percentage: 0 },
    { star: 3, percentage: 0 },
    { star: 2, percentage: 0 },
    { star: 1, percentage: 0 },
  ];

  const filteredReviews = reviews.filter((r) => {
    if (activeTab === "good") return r.category === "good";
    if (activeTab === "fair") return r.category === "fair";
    return true;
  });

  return (
    <SafeArea>
      <HeaderBar
        name="Reviews"
        image={
          user?.profilePhotoUrl && user?.profilePhotoUrl !== ""
            ? { uri: user?.profilePhotoUrl }
            : require("../assets/images/profile.jpg")
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

      {isOwner ? (
        /* ================= OWNER VIEW (INITIAL CODE) ================= */
        <ScrollView
          style={[styles.container, { width }]}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Filter Pills */}
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[
                styles.filterPill,
                activeTab === "all" && styles.activeFilterPill,
              ]}
              onPress={() => setActiveTab("all")}
            >
              <Text
                style={[
                  styles.filterPillText,
                  activeTab === "all" && styles.activeFilterPillText,
                ]}
              >
                All Reviews ({reviews.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterPill,
                activeTab === "good" && styles.activeFilterPill,
              ]}
              onPress={() => setActiveTab("good")}
            >
              <Text
                style={[
                  styles.filterPillText,
                  activeTab === "good" && styles.activeFilterPillText,
                ]}
              >
                Good ({reviews.filter((r) => r.category === "good").length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterPill,
                activeTab === "fair" && styles.activeFilterPill,
              ]}
              onPress={() => setActiveTab("fair")}
            >
              <Text
                style={[
                  styles.filterPillText,
                  activeTab === "fair" && styles.activeFilterPillText,
                ]}
              >
                Fair ({reviews.filter((r) => r.category === "fair").length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Overall Rating Card */}
          <View style={styles.overallCard}>
            <Text style={styles.overallTitle}>OVERALL RATING</Text>
            <View style={styles.ratingContent}>
              {/* Left Score Section */}
              <View style={styles.scoreSection}>
                <Text style={styles.scoreText}>{averageRating.toFixed(1)}</Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name="star"
                      size={14}
                      color="#E8A325"
                      style={{ marginRight: 2 }}
                    />
                  ))}
                </View>
                <Text style={styles.reviewCountText}>
                  {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </Text>
              </View>

              {/* Vertical Divider */}
              <View style={styles.divider} />

              {/* Right Distribution Section */}
              <View style={styles.distributionSection}>
                {ratingDistribution.map((item) => (
                  <View key={item.star} style={styles.progressRow}>
                    <Text style={styles.starLabel}>{item.star}</Text>
                    <Ionicons
                      name="star"
                      size={10}
                      color="#E8A325"
                      style={styles.starIcon}
                    />
                    <View style={styles.progressBarBg}>
                      <View
                        style={[
                          styles.progressBarFill,
                          { width: `${item.percentage}%` },
                        ]}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Loading Spinner or Review List */}
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#0B2554"
              style={{ marginTop: 20 }}
            />
          ) : (
            filteredReviews.map((item) => (
              <View key={item.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.userInfoRow}>
                    <View style={styles.avatarFallback}>
                      <Text style={styles.avatarFallbackText}>
                        {item.name ? item.name.charAt(0).toUpperCase() : "U"}
                      </Text>
                    </View>

                    <View style={styles.userDetails}>
                      <View style={styles.nameBadgeRow}>
                        <Text style={styles.userName}>{item.name}</Text>
                        {item.verified && (
                          <View style={styles.verifiedBadge}>
                            <Ionicons
                              name="checkmark-circle"
                              size={12}
                              color="#2E7D32"
                            />
                            <Text style={styles.verifiedText}>
                              Verified Renter
                            </Text>
                          </View>
                        )}
                      </View>

                      <View style={styles.starsAndDateRow}>
                        <View style={styles.starsRow}>
                          {[...Array(item.stars)].map((_, i) => (
                            <Ionicons
                              key={i}
                              name="star"
                              size={12}
                              color="#E8A325"
                              style={{ marginRight: 1 }}
                            />
                          ))}
                        </View>
                        <Text style={styles.timeAgoText}>{item.timeAgo}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <Text style={styles.commentText}>{item.comment}</Text>
                <Text style={styles.itemTag}>{item.item}</Text>
              </View>
            ))
          )}
        </ScrollView>
      ) : (
        /* ================= NON-OWNER VIEW ================= */
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbox-ellipses-outline" size={64} color="#CBD5E1" />
          <Text style={styles.emptyText}>
            You have submitted no reviews yet
          </Text>
        </View>
      )}
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  content: {
    paddingBottom: 30,
    paddingTop: 12,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DCE6F7",
    backgroundColor: "#FFFFFF",
  },
  activeFilterPill: {
    backgroundColor: "#0B2554",
    borderColor: "#0B2554",
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748B",
  },
  activeFilterPillText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  overallCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  overallTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0B2554",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  ratingContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  scoreSection: {
    alignItems: "center",
    paddingRight: 16,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0B2554",
  },
  starsRow: {
    flexDirection: "row",
    marginVertical: 4,
  },
  reviewCountText: {
    fontSize: 11,
    color: "#64748B",
  },
  divider: {
    width: 1,
    height: "80%",
    backgroundColor: "#E2E8F0",
    marginRight: 16,
  },
  distributionSection: {
    flex: 1,
    gap: 4,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  starLabel: {
    fontSize: 11,
    color: "#64748B",
    width: 10,
    textAlign: "right",
  },
  starIcon: {
    marginHorizontal: 4,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: "#F1F5F9",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#E8A325",
    borderRadius: 3,
  },
  reviewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  reviewHeader: {
    marginBottom: 8,
  },
  userInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarFallback: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0B2554",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarFallbackText: {
    fontWeight: "700",
    color: "#FFFFFF",
    fontSize: 14,
  },
  userDetails: {
    flex: 1,
  },
  nameBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  userName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0B2554",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 3,
  },
  verifiedText: {
    fontSize: 9,
    fontWeight: "600",
    color: "#2E7D32",
  },
  starsAndDateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  timeAgoText: {
    fontSize: 10,
    color: "#94A3B8",
  },
  commentText: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
    marginBottom: 6,
  },
  itemTag: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0B2554",
  },
  /* Non-Owner Empty State Styles */
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: 80,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 16,
    textAlign: "center",
  },
});
