import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import SafeArea from "../../components/common/safeArea";
import Sidebar from "../../components/common/sideBar";
import HeaderBar from "../../components/layout/headerComponents";

import { useBookingStore } from "../../store/bookingStore";
import { useUserStore } from "../../store/useStore";
import { pickAndUploadProfileImage } from "../../utils/imageUtils";

// Keys for local persistence
const PAYOUT_STORAGE_KEY = "@payout_account_info";
const BUSINESS_STORAGE_KEY = "@business_info";

export default function OwnerProfile() {
  const { user, apiFetch, fetchCurrentUser } = useUserStore();
  const { accepted } = useBookingStore();

  const [uploading, setUploading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Edit User Profile Modal States
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Payout Account State & Modal
  const [payoutInfo, setPayoutInfo] = useState({
    bankName: "GTBank Plc",
    accountNumber: "0123456789",
    accountName: "",
    swiftCode: "GTBINGLA",
    bvn: "*******1234",
    cardNumber: "4456****1234 (VISA)",
  });
  const [editPayoutModal, setEditPayoutModal] = useState(false);
  const [payoutForm, setPayoutForm] = useState({ ...payoutInfo });

  // Business Info State & Modal
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "Smith Rentals LTD",
    businessType: "Rental Service",
    yearsInBusiness: "3+ Years",
    address: "12, Adekunle street, Surulere, Lagos",
    cacNumber: "RC1234567",
    tin: "12345678901",
  });
  const [editBusinessModal, setEditBusinessModal] = useState(false);
  const [businessForm, setBusinessForm] = useState({ ...businessInfo });

  // Compute Name & Dynamic display values
  const fullName =
    user?.firstName || user?.lastName
      ? `${user?.firstName || ""} ${user?.lastName || ""}`.trim()
      : "Guest User";

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "---";

  // Load Persisted Local Storage Data
  useEffect(() => {
    loadLocalData();
  }, []);

  const loadLocalData = async () => {
    try {
      const storedPayout = await AsyncStorage.getItem(PAYOUT_STORAGE_KEY);
      if (storedPayout) {
        setPayoutInfo(JSON.parse(storedPayout));
      }

      const storedBusiness = await AsyncStorage.getItem(BUSINESS_STORAGE_KEY);
      if (storedBusiness) {
        setBusinessInfo(JSON.parse(storedBusiness));
      }
    } catch (e) {
      console.error("Failed to load local profile data", e);
    }
  };

  // Image Upload Handling
  const handleImagePick = async () => {
    setUploading(true);
    const result = await pickAndUploadProfileImage(apiFetch);
    setUploading(false);

    if (result?.success) {
      await fetchCurrentUser();
      Alert.alert("Success", "Profile photo updated!");
    } else if (result?.error !== "Image selection cancelled.") {
      Alert.alert(
        "Upload Failed",
        result?.error || "Failed to update profile photo.",
      );
    }
  };

  // --- Handlers for Profile API Update ---
  const handleOpenEditProfile = () => {
    setFirstName(user?.firstName || "");
    setLastName(user?.lastName || "");
    setPhone(user?.phone || "");
    setEditProfileModal(true);
  };

  const handleSaveProfile = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert("Error", "First and Last Name are required.");
      return;
    }

    setSavingProfile(true);
    const { response, error } = await apiFetch("/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
      }),
    });
    setSavingProfile(false);

    if (error) {
      Alert.alert("Update Failed", error);
    } else {
      await fetchCurrentUser();
      setEditProfileModal(false);
      Alert.alert("Success", "Profile updated successfully!");
    }
  };

  // --- Handlers for Payout Account local persistence ---
  const handleOpenEditPayout = () => {
    setPayoutForm({
      ...payoutInfo,
      accountName: payoutInfo.accountName || fullName,
    });
    setEditPayoutModal(true);
  };

  const handleSavePayout = async () => {
    try {
      await AsyncStorage.setItem(
        PAYOUT_STORAGE_KEY,
        JSON.stringify(payoutForm),
      );
      setPayoutInfo(payoutForm);
      setEditPayoutModal(false);
      Alert.alert("Success", "Payout information updated!");
    } catch (e) {
      Alert.alert("Error", "Failed to save payout info locally.");
    }
  };

  // --- Handlers for Business Info local persistence ---
  const handleOpenEditBusiness = () => {
    setBusinessForm({ ...businessInfo });
    setEditBusinessModal(true);
  };

  const handleSaveBusiness = async () => {
    try {
      await AsyncStorage.setItem(
        BUSINESS_STORAGE_KEY,
        JSON.stringify(businessForm),
      );
      setBusinessInfo(businessForm);
      setEditBusinessModal(false);
      Alert.alert("Success", "Business information updated!");
    } catch (e) {
      Alert.alert("Error", "Failed to save business info locally.");
    }
  };

  return (
    <SafeArea>
      <HeaderBar
        name="Profile"
        image={
          user?.profilePhotoUrl && user?.profilePhotoUrl !== ""
            ? { uri: user?.profilePhotoUrl }
            : require("../../assets/images/profile.jpg")
        }
        onPress={() => setMenuOpen(true)}
        onNotificationPress={() => router.push("/NotificationsScreen")}
      />

      <Sidebar
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        role="owner"
        onNavigate={(routeId) => {
          setMenuOpen(false);
          router.replace(routeId);
        }}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* OWNER CARD */}
        <View style={styles.ownerCard}>
          <View style={styles.ownerHeaderRow}>
            <View>
              <Text style={styles.ownerTitle}>Owner Profile</Text>
              <Text style={styles.ownerSubtitle}>
                Manage your personal and business{"\n"}information
              </Text>
            </View>
            <TouchableOpacity
              style={styles.editProfileBtn}
              onPress={handleOpenEditProfile}
            >
              <Text style={styles.editProfileBtnText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profileInnerCard}>
            <View style={styles.avatarContainer}>
              <Image
                source={
                  user?.profilePhotoUrl && user?.profilePhotoUrl !== ""
                    ? { uri: user?.profilePhotoUrl }
                    : require("../../assets/images/profile.jpg")
                }
                style={styles.avatar}
              />
              <TouchableOpacity
                style={styles.cameraBadge}
                onPress={handleImagePick}
                disabled={uploading}
              >
                {uploading ? (
                  <ActivityIndicator size="small" color="#0B2554" />
                ) : (
                  <Ionicons name="camera-outline" size={14} color="#0B2554" />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.profileDetails}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>{fullName}</Text>
                <View style={styles.verifiedBadge}>
                  <MaterialIcons name="verified" size={12} color="#2E7D32" />
                  <Text style={styles.verifiedText}>Verified Owner</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Feather name="mail" size={12} color="#0B2554" />
                <Text style={styles.infoText}>{user?.email || "---"}</Text>
              </View>

              <View style={styles.infoRow}>
                <Feather name="phone" size={12} color="#0B2554" />
                <Text style={styles.infoText}>{user?.phone || "---"}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={12} color="#0B2554" />
                <Text style={styles.infoText}>Lagos, Nigeria</Text>
              </View>

              <View style={styles.infoRow}>
                <Feather name="calendar" size={12} color="#0B2554" />
                <Text style={styles.infoText}>{formattedDate}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* PAYOUT ACCOUNT INFORMATION */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>PAYOUT ACCOUNT INFORMATION</Text>
            <TouchableOpacity onPress={handleOpenEditPayout}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.gridRow}>
            <View style={[styles.gridBox, styles.grayBox]}>
              <Text style={styles.fieldLabel}>Bank Name</Text>
              <Text style={styles.fieldValueBold}>{payoutInfo.bankName}</Text>

              <Text style={[styles.fieldLabel, { marginTop: 8 }]}>
                Account Number
              </Text>
              <Text style={styles.fieldValueBold}>
                {payoutInfo.accountNumber}
              </Text>

              <Text style={[styles.fieldLabel, { marginTop: 8 }]}>
                Account Name
              </Text>
              <Text style={styles.fieldValueBold}>
                {payoutInfo.accountName || fullName}
              </Text>
            </View>

            <View style={[styles.gridBox, styles.beigeBox]}>
              <Text style={styles.fieldLabel}>Swift Code</Text>
              <Text style={styles.fieldValueBold}>{payoutInfo.swiftCode}</Text>

              <Text style={[styles.fieldLabel, { marginTop: 8 }]}>
                Bank Verification Number (BVN)
              </Text>
              <Text style={styles.fieldValueBold}>{payoutInfo.bvn}</Text>

              <Text style={[styles.fieldLabel, { marginTop: 8 }]}>
                Card Number
              </Text>
              <Text style={styles.fieldValueBold}>{payoutInfo.cardNumber}</Text>
            </View>
          </View>
        </View>

        {/* BUSINESS INFORMATION */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>BUSINESS INFORMATION</Text>
            <TouchableOpacity onPress={handleOpenEditBusiness}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.gridRow}>
            <View style={[styles.gridBox, styles.grayBox]}>
              <Text style={styles.fieldLabel}>Business Name</Text>
              <Text style={styles.fieldValueBold}>
                {businessInfo.businessName}
              </Text>

              <Text style={[styles.fieldLabel, { marginTop: 8 }]}>
                Business Type
              </Text>
              <Text style={styles.fieldValueBold}>
                {businessInfo.businessType}
              </Text>

              <Text style={[styles.fieldLabel, { marginTop: 8 }]}>
                Years in Business
              </Text>
              <Text style={styles.fieldValueBold}>
                {businessInfo.yearsInBusiness}
              </Text>
            </View>

            <View style={[styles.gridBox, styles.beigeBox]}>
              <Text style={styles.fieldLabel}>Address</Text>
              <Text style={styles.fieldValueBold}>{businessInfo.address}</Text>

              <Text style={[styles.fieldLabel, { marginTop: 8 }]}>
                CAC Number
              </Text>
              <Text style={styles.fieldValueBold}>
                {businessInfo.cacNumber}
              </Text>

              <Text style={[styles.fieldLabel, { marginTop: 8 }]}>
                Tax Identification Number (TIN)
              </Text>
              <Text style={styles.fieldValueBold}>{businessInfo.tin}</Text>
            </View>
          </View>
        </View>

        {/* BUSINESS OVERVIEW */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>BUSINESS OVERVIEW</Text>
          </View>

          <View style={styles.gridRow}>
            <View style={[styles.gridBox, styles.grayBox]}>
              <Text style={styles.fieldLabel}>Total Rentals</Text>
              <Text style={styles.fieldValueBold}>{accepted ? 5 : 4}</Text>

              <Text style={[styles.fieldLabel, { marginTop: 8 }]}>
                Completed Rentals
              </Text>
              <Text style={styles.fieldValueBold}>0</Text>

              <Text style={[styles.fieldLabel, { marginTop: 8 }]}>
                Total Earnings
              </Text>
              <Text style={styles.fieldValueBold}>₦0</Text>
            </View>

            <View style={[styles.gridBox, styles.beigeBox]}>
              <Text style={styles.fieldLabel}>Average Rating</Text>
              <Text style={styles.fieldValueBold}>4.8</Text>

              <Text style={[styles.fieldLabel, { marginTop: 8 }]}>
                Disputes
              </Text>
              <Text style={styles.fieldValueBold}>Nil</Text>

              <Text style={[styles.fieldLabel, { marginTop: 8 }]}>Reports</Text>
              <Text style={styles.fieldValueBold}>Nil</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* EDIT USER PROFILE MODAL */}
      <Modal
        visible={editProfileModal}
        transparent
        animationType="fade"
        onRequestClose={() => setEditProfileModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setEditProfileModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Update Profile</Text>

                <Text style={styles.inputLabel}>First Name</Text>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="First Name"
                />

                <Text style={styles.inputLabel}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Last Name"
                />

                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                />

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setEditProfileModal(false)}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={handleSaveProfile}
                    disabled={savingProfile}
                  >
                    {savingProfile ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.saveBtnText}>Save</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* EDIT PAYOUT INFO MODAL */}
      <Modal
        visible={editPayoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setEditPayoutModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setEditPayoutModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <ScrollView
                style={styles.modalContentScroll}
                contentContainerStyle={styles.modalContent}
              >
                <Text style={styles.modalTitle}>Edit Payout Account</Text>

                <Text style={styles.inputLabel}>Bank Name</Text>
                <TextInput
                  style={styles.input}
                  value={payoutForm.bankName}
                  onChangeText={(val) =>
                    setPayoutForm({ ...payoutForm, bankName: val })
                  }
                />

                <Text style={styles.inputLabel}>Account Number</Text>
                <TextInput
                  style={styles.input}
                  value={payoutForm.accountNumber}
                  keyboardType="number-pad"
                  onChangeText={(val) =>
                    setPayoutForm({ ...payoutForm, accountNumber: val })
                  }
                />

                <Text style={styles.inputLabel}>Account Name</Text>
                <TextInput
                  style={styles.input}
                  value={payoutForm.accountName}
                  onChangeText={(val) =>
                    setPayoutForm({ ...payoutForm, accountName: val })
                  }
                />

                <Text style={styles.inputLabel}>Swift Code</Text>
                <TextInput
                  style={styles.input}
                  value={payoutForm.swiftCode}
                  onChangeText={(val) =>
                    setPayoutForm({ ...payoutForm, swiftCode: val })
                  }
                />

                <Text style={styles.inputLabel}>BVN</Text>
                <TextInput
                  style={styles.input}
                  value={payoutForm.bvn}
                  onChangeText={(val) =>
                    setPayoutForm({ ...payoutForm, bvn: val })
                  }
                />

                <Text style={styles.inputLabel}>Card Number</Text>
                <TextInput
                  style={styles.input}
                  value={payoutForm.cardNumber}
                  onChangeText={(val) =>
                    setPayoutForm({ ...payoutForm, cardNumber: val })
                  }
                />

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setEditPayoutModal(false)}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={handleSavePayout}
                  >
                    <Text style={styles.saveBtnText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* EDIT BUSINESS INFO MODAL */}
      <Modal
        visible={editBusinessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setEditBusinessModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setEditBusinessModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <ScrollView
                style={styles.modalContentScroll}
                contentContainerStyle={styles.modalContent}
              >
                <Text style={styles.modalTitle}>Edit Business Info</Text>

                <Text style={styles.inputLabel}>Business Name</Text>
                <TextInput
                  style={styles.input}
                  value={businessForm.businessName}
                  onChangeText={(val) =>
                    setBusinessForm({ ...businessForm, businessName: val })
                  }
                />

                <Text style={styles.inputLabel}>Business Type</Text>
                <TextInput
                  style={styles.input}
                  value={businessForm.businessType}
                  onChangeText={(val) =>
                    setBusinessForm({ ...businessForm, businessType: val })
                  }
                />

                <Text style={styles.inputLabel}>Years in Business</Text>
                <TextInput
                  style={styles.input}
                  value={businessForm.yearsInBusiness}
                  onChangeText={(val) =>
                    setBusinessForm({ ...businessForm, yearsInBusiness: val })
                  }
                />

                <Text style={styles.inputLabel}>Address</Text>
                <TextInput
                  style={styles.input}
                  value={businessForm.address}
                  onChangeText={(val) =>
                    setBusinessForm({ ...businessForm, address: val })
                  }
                />

                <Text style={styles.inputLabel}>CAC Number</Text>
                <TextInput
                  style={styles.input}
                  value={businessForm.cacNumber}
                  onChangeText={(val) =>
                    setBusinessForm({ ...businessForm, cacNumber: val })
                  }
                />

                <Text style={styles.inputLabel}>
                  Tax Identification Number (TIN)
                </Text>
                <TextInput
                  style={styles.input}
                  value={businessForm.tin}
                  onChangeText={(val) =>
                    setBusinessForm({ ...businessForm, tin: val })
                  }
                />

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setEditBusinessModal(false)}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={handleSaveBusiness}
                  >
                    <Text style={styles.saveBtnText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  content: {
    paddingBottom: 40,
    paddingTop: 8,
    gap: 16,
  },

  /* OWNER CARD */
  ownerCard: {
    backgroundColor: "#0B2554",
    borderRadius: 16,
  },
  ownerHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    padding: 16,
  },
  ownerTitle: {
    fontFamily: "pBold",
    fontSize: 18,
    color: "#FFFFFF",
  },
  ownerSubtitle: {
    fontFamily: "pRegular",
    fontSize: 11,
    color: "#E5E7EB",
    marginTop: 4,
    lineHeight: 14,
  },
  editProfileBtn: {
    backgroundColor: "#E8A325",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  editProfileBtnText: {
    fontFamily: "pSemiBold",
    color: "#0B2554",
    fontSize: 12,
  },
  profileInnerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#0B2554",
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 36,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 4,
  },
  profileDetails: {
    flex: 1,
    gap: 6,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
    flexWrap: "wrap",
  },
  userName: {
    fontFamily: "pBold",
    fontSize: 15,
    color: "#0B2554",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFFE0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 2,
  },
  verifiedText: {
    fontFamily: "pSemiBold",
    fontSize: 9,
    color: "#2E7D32",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    fontFamily: "pRegular",
    fontSize: 11,
    color: "#0B2554",
  },

  /* SECTION CARDS */
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#0B2554",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: "pBold",
    fontSize: 13,
    color: "#0B2554",
    letterSpacing: 0.5,
  },
  editText: {
    fontFamily: "pSemiBold",
    fontSize: 12,
    color: "#0B2554",
  },
  gridRow: {
    flexDirection: "row",
    gap: 4,
  },
  gridBox: {
    flex: 1,
    borderRadius: 6,
    padding: 12,
  },
  grayBox: {
    backgroundColor: "#E5E7EB",
  },
  beigeBox: {
    backgroundColor: "#F7EDDB",
  },
  fieldLabel: {
    fontFamily: "pRegular",
    fontSize: 10,
    color: "#0B2554",
  },
  fieldValueBold: {
    fontFamily: "pBold",
    fontSize: 11,
    color: "#0B2554",
    marginTop: 1,
  },

  /* MODAL STYLES */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContentScroll: {
    width: "100%",
    maxHeight: "80%",
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0B2554",
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0B2554",
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#0B2554",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 20,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  cancelBtnText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "600",
  },
  saveBtn: {
    backgroundColor: "#0B2554",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtnText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});