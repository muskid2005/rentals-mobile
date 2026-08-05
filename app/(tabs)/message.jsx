import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Replace with your actual API base URL and token dynamic logic
const API_BASE_URL = "https://your-api-domain.com";
const AUTH_TOKEN = "YOUR_BEARER_TOKEN";

export default function ChatScreen({ route, navigation }) {
  // Pass conversationId, recipient, equipment via route params if available
  const {
    conversationId = "123",
    recipientName = "Sarah Okoro",
    equipment = null,
  } = route?.params || {};

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const flatListRef = useRef(null);

  // 1. Fetch Messages & Mark as Read
  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/conversations/${conversationId}/messages?page=1&limit=20`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            "Content-Type": "application/json",
            Accept: "application/json", // Force server to return JSON
          },
        },
      );

      // Read response as text first to inspect non-JSON responses
      const rawText = await response.text();

      if (!response.ok) {
        console.error(`HTTP Error ${response.status}:`, rawText);
        return;
      }

      const data = JSON.parse(rawText);
      setMessages(data.messages || data.data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      await fetch(`${API_BASE_URL}/conversations/${conversationId}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  // 2. Setup Polling Interval (Every 3 seconds)
  useEffect(() => {
    fetchMessages();
    markAsRead();

    const intervalId = setInterval(() => {
      fetchMessages();
    }, 3000);

    return () => clearInterval(intervalId);
  }, [conversationId]);

  // 3. Send Text Message
  const handleSendMessage = async () => {
    if (!inputText.trim() || sending) return;

    const messageText = inputText.trim();
    setInputText("");
    setSending(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/conversations/${conversationId}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            body: messageText,
          }),
        },
      );

      if (response.ok) {
        fetchMessages(); // Immediately pull new messages
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  // Render individual chat bubbles
  const renderMessageItem = ({ item }) => {
    // Assuming current user has 'isSender: true' or match senderId with authenticated user ID
    const isOutgoing = item.isSender || item.senderId === "currentUser";

    return (
      <View
        style={[
          styles.messageRow,
          isOutgoing ? styles.rowOutgoing : styles.rowIncoming,
        ]}
      >
        <View
          style={[
            styles.bubble,
            isOutgoing ? styles.bubbleOutgoing : styles.bubbleIncoming,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isOutgoing ? styles.textOutgoing : styles.textIncoming,
            ]}
          >
            {item.body || item.text}
          </Text>
        </View>

        <View
          style={[
            styles.metaRow,
            isOutgoing ? styles.metaOutgoing : styles.metaIncoming,
          ]}
        >
          <Text style={styles.timestamp}>
            {item.createdAt
              ? new Date(item.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "09:12 AM"}
          </Text>
          {isOutgoing && (
            <Ionicons
              name="checkmark-done"
              size={14}
              color="#2563EB"
              style={{ marginLeft: 4 }}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header Bar */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation?.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#1E293B" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{recipientName}</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={20} color="#1E293B" />
          </TouchableOpacity>
        </View>

        {/* Active Rental Sub-Header Banner */}
        <View style={styles.rentalBanner}>
          <View style={styles.rentalInfo}>
            <View style={styles.rentalIconPlaceholder}>
              <Ionicons name="construct" size={20} color="#0B3B29" />
            </View>
            <View>
              <Text style={styles.rentalLabel}>ACTIVE RENTAL</Text>
              <Text style={styles.rentalTitle}>
                {equipment?.title || "Caterpillar 305.5E2"}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.detailsButton}>
            <Text style={styles.detailsButtonText}>Details</Text>
            <Ionicons
              name="open-outline"
              size={14}
              color="#FFFFFF"
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
        </View>

        {/* Date Divider */}
        <View style={styles.dateBadgeContainer}>
          <View style={styles.dateBadge}>
            <Text style={styles.dateBadgeText}>Today, Oct 24</Text>
          </View>
        </View>

        {/* Chat List */}
        {loading ? (
          <ActivityIndicator size="large" color="#0B3B29" style={{ flex: 1 }} />
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item, index) =>
              item.id?.toString() || index.toString()
            }
            renderItem={renderMessageItem}
            contentContainerStyle={styles.chatListContent}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            onLayout={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />
        )}

        {/* Bottom Text Input Bar */}
        <View style={styles.inputBar}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor="#94A3B8"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
          </View>
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || sending}
          >
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
  },

  headerTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },

  headerTitle: {
    fontSize: 18,
    color: "#0F172A",
    fontFamily: "pBold",
  },

  // Rental Banner
  rentalBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
  },

  rentalInfo: {
    flexDirection: "row",
    alignItems: "center",
  },

  rentalIconPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  rentalLabel: {
    fontSize: 10,
    color: "#64748B",
    letterSpacing: 0.5,
    fontFamily: "mBold",
  },

  rentalTitle: {
    fontSize: 14,
    color: "#1E293B",
    fontFamily: "pSemiBold",
  },

  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0B3B29",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },

  detailsButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "mSemiBold",
  },

  // Date Badge
  dateBadgeContainer: {
    alignItems: "center",
    marginVertical: 14,
  },

  dateBadge: {
    backgroundColor: "#E2E8F0",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },

  dateBadgeText: {
    fontSize: 12,
    color: "#64748B",
    fontFamily: "mRegular",
  },

  // Messages Stream
  chatListContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  messageRow: {
    marginBottom: 12,
    maxWidth: "80%",
  },

  rowIncoming: {
    alignSelf: "flex-start",
  },

  rowOutgoing: {
    alignSelf: "flex-end",
  },

  bubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  bubbleIncoming: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  bubbleOutgoing: {
    backgroundColor: "#0B3B29",
    borderTopRightRadius: 4,
  },

  messageText: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: "mRegular",
  },

  textIncoming: {
    color: "#1E293B",
  },

  textOutgoing: {
    color: "#FFFFFF",
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  metaIncoming: {
    alignSelf: "flex-start",
  },

  metaOutgoing: {
    alignSelf: "flex-end",
  },

  timestamp: {
    fontSize: 11,
    color: "#94A3B8",
    fontFamily: "mRegular",
  },

  // Input Bar
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderColor: "#E2E8F0",
  },

  inputContainer: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 10 : 4,
    marginRight: 10,
    maxHeight: 100,
  },

  textInput: {
    fontSize: 15,
    color: "#1E293B",
    fontFamily: "mRegular",
  },

  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#0B3B29",
    alignItems: "center",
    justifyContent: "center",
  },

  sendButtonDisabled: {
    backgroundColor: "#94A3B8",
  },
});