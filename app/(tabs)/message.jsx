import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
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
import SafeArea from "../../components/common/safeArea";
import Sidebar from "../../components/common/sideBar";
import HeaderBar from "../../components/layout/headerComponents";
import { useUserStore } from "../../store/useStore";

export default function MessageScreen() {
  const { user, apiFetch } = useUserStore();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all"); // 'all' | 'unread'
  const [searchQuery, setSearchQuery] = useState("");

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const { response, error } = await apiFetch("/conversations", {
        method: "GET",
      });

      if (response) {
        const parsedData =
          typeof response.json === "function"
            ? await response.json()
            : response;

        if (parsedData?.data) {
          setConversations(parsedData.data);
        } else {
          setConversations([]);
        }
      } else {
        setConversations([]);
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleOpenChat = (item) => {
    router.push({
      pathname: "/messageChat",
      params: {
        id: item.id,
        equipmentId: item.equipmentId,
        participantOneId: item.participantOneId,
        participantTwoId: item.participantTwoId,
      },
    });
  };

  // Filter conversations by tab (all/unread) and search text (name/message)
  const filteredConversations = conversations.filter((item) => {
    const otherParticipant =
      item.participantOneId === user?.id
        ? item.participantTwo
        : item.participantOne;

    const fullName = `${otherParticipant?.firstName || ""} ${
      otherParticipant?.lastName || ""
    }`.toLowerCase();

    const lastMessage = (item.lastMessagePreview || "").toLowerCase();
    const query = searchQuery.toLowerCase().trim();

    const matchesTab =
      activeFilter === "unread" ? (item.unreadCount || 0) > 0 : true;

    const matchesSearch =
      fullName.includes(query) || lastMessage.includes(query);

    return matchesTab && matchesSearch;
  });

  // Calculate unread total count for badge indicator
  const totalUnread = conversations.reduce(
    (acc, curr) => acc + (curr.unreadCount || 0),
    0,
  );

  const renderConversationCard = (item, index) => {
    const otherParticipant =
      item.participantOneId === user?.id
        ? item.participantTwo
        : item.participantOne;

    const avatarUrl =
      otherParticipant?.profilePhotoUrl || "https://via.placeholder.com/150";

    const fullName = `${otherParticipant?.firstName || "User"} ${
      otherParticipant?.lastName || ""
    }`.trim();

    const lastMessage = item.lastMessagePreview || "No messages yet";

    const messageDate = item.lastMessageAt || item.updatedAt || item.createdAt;
    const formattedTime = messageDate
      ? new Date(messageDate).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

    return (
      <TouchableOpacity
        key={item.id || index.toString()}
        style={styles.chatCard}
        onPress={() => handleOpenChat(item)}
      >
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />

        <View style={styles.chatInfo}>
          <View style={styles.cardHeader}>
            <Text style={styles.userName}>{fullName}</Text>
            <Text style={styles.timestamp}>{formattedTime}</Text>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {lastMessage}
            </Text>

            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeArea>
      <HeaderBar
        name="Messages"
        image={
          user?.profilePhotoUrl && user?.profilePhotoUrl !== ""
            ? { uri: user?.profilePhotoUrl }
            : require("../../assets/images/profile.jpg")
        }
        onPress={() => setMenuOpen(true)}
        onNotificationPress={() => router.push("/NotificationsScreen")}
      />

      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#94A3B8"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterTab,
              activeFilter === "all" && styles.activeFilterTab,
            ]}
            onPress={() => setActiveFilter("all")}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === "all" && styles.activeFilterText,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterTab,
              activeFilter === "unread" && styles.activeFilterTab,
            ]}
            onPress={() => setActiveFilter("unread")}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === "unread" && styles.activeFilterText,
              ]}
            >
              Unread
            </Text>
            {totalUnread > 0 && (
              <View
                style={[
                  styles.filterBadge,
                  activeFilter === "unread" && styles.activeFilterBadge,
                ]}
              >
                <Text
                  style={[
                    styles.filterBadgeText,
                    activeFilter === "unread" && styles.activeFilterBadgeText,
                  ]}
                >
                  {totalUnread}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#0B3B29" />
          </View>
        ) : (
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {filteredConversations.length > 0 ? (
              filteredConversations.map((item, index) =>
                renderConversationCard(item, index),
              )
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {searchQuery
                    ? "No matching conversations"
                    : activeFilter === "unread"
                      ? "No unread messages"
                      : "No conversations found"}
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>

      <Sidebar
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        role="owner"
        onNavigate={(routeId) => {
          setMenuOpen(false);
          router.replace(routeId);
        }}
      />
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    // marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: "#e9e9e9",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
    fontFamily: "mRegular",
  },
  filterContainer: {
    flexDirection: "row",
    // paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#F1F5F9",
    gap: 8,
  },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#e9e9e9",
  },
  activeFilterTab: {
    backgroundColor: "#0B3B29",
  },
  filterText: {
    fontSize: 13,
    color: "#64748B",
    fontFamily: "pSemiBold",
  },
  activeFilterText: {
    color: "#FFFFFF",
  },
  filterBadge: {
    marginLeft: 6,
    backgroundColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  activeFilterBadge: {
    backgroundColor: "#22C55E",
  },
  filterBadgeText: {
    fontSize: 10,
    color: "#475569",
    fontFamily: "mBold",
  },
  activeFilterBadgeText: {
    color: "#FFFFFF",
  },
  loaderContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    flex: 1,
    width: "100%",
  },
  listContent: {
    width: "100%",
    // paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 30,
  },
  chatCard: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E2E8F0",
  },
  chatInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  userName: {
    fontSize: 15,
    color: "#0F172A",
    fontFamily: "pSemiBold",
  },
  timestamp: {
    fontSize: 11,
    color: "#94A3B8",
    fontFamily: "mRegular",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessage: {
    flex: 1,
    fontSize: 13,
    color: "#64748B",
    fontFamily: "mRegular",
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: "#22C55E",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  unreadText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontFamily: "mBold",
  },
  emptyContainer: {
    paddingTop: 40,
    alignItems: "center",
    width: "100%",
  },
  emptyText: {
    fontSize: 14,
    color: "#94A3B8",
    fontFamily: "mRegular",
  },
});
