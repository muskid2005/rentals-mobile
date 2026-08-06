import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import SafeArea from "../components/common/safeArea";
import { useUserStore } from "../store/useStore";

export default function ChatScreen() {
  const { width } = useWindowDimensions();
  const {
    id: conversationId,
    equipmentId,
    participantOneId,
    participantTwoId,
  } = useLocalSearchParams();

  const { user, apiFetch } = useUserStore();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const scrollViewRef = useRef(null);

  // Keyboard Event Listeners
  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // Mark conversation as read
  const markAsRead = async () => {
    if (!conversationId) return;

    try {
      await apiFetch(`/conversations/${conversationId}/read`, {
        method: "PATCH",
      });
    } catch (err) {
      console.error("Error marking conversation as read:", err);
    }
  };

  // Fetch conversation messages
  const fetchMessages = async () => {
    if (!conversationId) return;

    try {
      const { response } = await apiFetch(
        `/conversations/${conversationId}/messages?page=1&limit=100`,
        { method: "GET" },
      );

      if (response) {
        const parsedData =
          typeof response.json === "function"
            ? await response.json()
            : response;

        if (parsedData?.data) {
          const fetchedMessages = Array.isArray(parsedData.data)
            ? [...parsedData.data].reverse()
            : [];
          setMessages(fetchedMessages);
        }
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    markAsRead();
  }, [conversationId]);

  // Send message handler
  const handleSendMessage = async () => {
    if (!inputText.trim() || sending || !conversationId) return;

    const messageText = inputText.trim();
    setInputText("");
    setSending(true);

    const tempId = Date.now().toString();
    const tempMessage = {
      id: tempId,
      body: messageText,
      senderId: user?.id,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      const { response, error } = await apiFetch(
        `/conversations/${conversationId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            body: messageText,
          }),
        },
      );

      if (error) {
        console.error("Failed to send message:", error);
      } else if (response) {
        const parsedData =
          typeof response.json === "function"
            ? await response.json()
            : response;

        if (parsedData?.data) {
          setMessages((prev) =>
            prev.map((msg) => (msg.id === tempId ? parsedData.data : msg)),
          );
        }
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setSending(false);
    }
  };

  const handleViewDetails = () => {
    if (equipmentId) {
      router.push({
        pathname: "/equipment-details",
        params: { id: equipmentId },
      });
    }
  };

  const renderMessageItem = (item, index) => {
    const isOutgoing = item.senderId === user?.id || item.isSender;
    const key = item.id?.toString() || index.toString();

    return (
      <View
        key={key}
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
            {item.body}
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
              : ""}
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
    <SafeArea style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header Bar */}
        <View style={[styles.header, { width: width }]}>
          <TouchableOpacity onPress={() => router.replace("/message")}>
            <Ionicons name="arrow-back" size={24} color="#1E293B" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Conversation</Text>
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
                {equipmentId
                  ? `Equipment #${equipmentId.slice(0, 8)}`
                  : "Equipment Inquiry"}
              </Text>
            </View>
          </View>
          {equipmentId && (
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={handleViewDetails}
            >
              <Text style={styles.detailsButtonText}>Details</Text>
              <Ionicons
                name="open-outline"
                size={14}
                color="#FFFFFF"
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Messages List Area */}
        <View style={styles.chatArea}>
          {loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#0B3B29" />
            </View>
          ) : (
            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={[
                styles.chatListContent,
                { paddingBottom: keyboardHeight > 0 ? 80 : 90 },
              ]}
              onContentSizeChange={() =>
                scrollViewRef.current?.scrollToEnd({ animated: true })
              }
            >
              {messages.map((item, index) => renderMessageItem(item, index))}
            </ScrollView>
          )}
        </View>

        {/* Dynamic / Absolute Bottom Input Bar */}
        <View
          style={[
            styles.inputBar,
            keyboardHeight > 0
              ? { bottom: keyboardHeight }
              : styles.inputBarAbsolute,
          ]}
        >
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
              (!inputText.trim() || sending) && styles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="send" size={18} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
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
  chatArea: {
    flex: 1,
  },
  chatListContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
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
  inputBar: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderColor: "#E2E8F0",
  },
  inputBarAbsolute: {
    bottom: 0,
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
