import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
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
import { useUserStore } from "../../store/useStore";
import { pickAndUploadProfileImage } from "../../utils/imageUtils";

function InfoField({ label, value, isFirst }) {
  return (
    <View style={!isFirst && styles.fieldSpacing}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValueBold}>{value}</Text>
    </View>
  );
}

function InfoSection({
  title,
  actionText,
  onActionPress,
  leftFields,
  rightFields,
}) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity onPress={onActionPress}>
          <Text style={styles.editText}>{actionText}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.gridRow}>
        <View style={[styles.gridBox, styles.grayBox]}>
          {leftFields.map((field, index) => (
            <InfoField
              key={index}
              label={field.label}
              value={field.value}
              isFirst={index === 0}
            />
          ))}
        </View>

        <View style={[styles.gridBox, styles.beigeBox]}>
          {rightFields.map((field, index) => (
            <InfoField
              key={index}
              label={field.label}
              value={field.value}
              isFirst={index === 0}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

export default function RenterProfile() {
  const { user, apiFetch, fetchCurrentUser } = useUserStore();
  const [uploading, setUploading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Modals Visibility
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [editPaymentModal, setEditPaymentModal] = useState(false);
  const [editRentalModal, setEditRentalModal] = useState(false);

  // Loading States
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);
  const [savingRental, setSavingRental] = useState(false);

  // Profile Form State
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [phone, setPhone] = useState(user?.phone || "");

  // Payment Form State
  const [paymentForm, setPaymentForm] = useState({
    cardholder: "John Doe",
    cardNumber: "**** **** **** 3256",
    expiryDate: "08/28",
    billingAddress: "Lagos, Nigeria",
  });

  // Rental Preference Form State
  const [rentalForm, setRentalForm] = useState({
    preferredEquipment: "Cameras",
    pickupLocation: "Lekki, Lagos",
    rentalFrequency: "Frequent",
  });

  const fName = user?.firstName ? user.firstName.toUpperCase() : "";
  const lName = user?.lastName ? user.lastName.toUpperCase() : "";
  const fullName = fName && lName ? `${fName} ${lName}` : "Guest User";

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "---";

  const handleImagePick = async () => {
    setUploading(true);
    const result = await pickAndUploadProfileImage(apiFetch);
    setUploading(false);

    if (result.success) {
      await fetchCurrentUser();
      Alert.alert("Success", "Profile photo updated!");
    } else if (result.error !== "Image selection cancelled.") {
      Alert.alert("Upload Failed", result.error);
    }
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

  const handleSavePayment = async () => {
    setSavingPayment(true);
    setTimeout(() => {
      setSavingPayment(false);
      setEditPaymentModal(false);
    }, 1000);
  };

  const handleSaveRental = async () => {
    setSavingRental(true);
    setTimeout(() => {
      setSavingRental(false);
      setEditRentalModal(false);
    }, 1000);
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
        role="renter"
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
        {/* RENTER CARD */}
        <View style={styles.renterCard}>
          <View style={styles.renterHeaderRow}>
            <View>
              <Text style={styles.renterTitle}>Renter Profile</Text>
              <Text style={styles.renterSubtitle}>
                Manage your rental activities and account{"\n"}information
              </Text>
            </View>
            <TouchableOpacity
              style={styles.editProfileBtn}
              onPress={() => setEditProfileModal(true)}
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
                  <Text style={styles.verifiedText}>Verified Renter</Text>
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

        {/* PAYMENT METHOD SECTION */}
        <InfoSection
          title="PAYMENT METHOD"
          actionText="Edit"
          onActionPress={() => setEditPaymentModal(true)}
          leftFields={[
            {
              label: "Preferred Payment Method",
              value: paymentForm.cardNumber,
            },
            { label: "Cardholder", value: paymentForm.cardholder },
            { label: "Billing Address", value: paymentForm.billingAddress },
          ]}
          rightFields={[
            { label: "Payment Status", value: "Verified" },
            { label: "Default Card", value: "Visa" },
            { label: "Expiry Date", value: paymentForm.expiryDate },
          ]}
        />

        {/* RENTAL INFORMATION SECTION */}
        <InfoSection
          title="RENTAL INFORMATION"
          actionText="Edit"
          onActionPress={() => setEditRentalModal(true)}
          leftFields={[
            {
              label: "Preferred Equipment",
              value: rentalForm.preferredEquipment,
            },
            { label: "Rental Frequency", value: rentalForm.rentalFrequency },
            { label: "Total Rentals", value: "18" },
          ]}
          rightFields={[
            {
              label: "Preferred Pickup Location",
              value: rentalForm.pickupLocation,
            },
            { label: "Active Rentals", value: "02" },
            { label: "Completed Rentals", value: "16" },
          ]}
        />

        {/* RENTAL OVERVIEW SECTION */}
        <InfoSection
          title="RENTAL OVERVIEW"
          actionText="View All"
          onActionPress={() => {}}
          leftFields={[
            { label: "Total Rentals", value: "18" },
            { label: "Completed Rentals", value: "16" },
            { label: "Saved Equipment", value: "24" },
          ]}
          rightFields={[
            { label: "Average Rating", value: "4.9" },
            { label: "Pending Requests", value: "01" },
            { label: "Favorite Categories", value: "Cameras" },
          ]}
        />
      </ScrollView>

      {/* EDIT PROFILE MODAL */}
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

      {/* EDIT PAYMENT METHOD MODAL */}
      <Modal
        visible={editPaymentModal}
        transparent
        animationType="fade"
        onRequestClose={() => setEditPaymentModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setEditPaymentModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <ScrollView
                style={styles.modalContentScroll}
                contentContainerStyle={styles.modalContent}
              >
                <Text style={styles.modalTitle}>Edit Payment Method</Text>

                <Text style={styles.inputLabel}>Cardholder Name</Text>
                <TextInput
                  style={styles.input}
                  value={paymentForm.cardholder}
                  onChangeText={(val) =>
                    setPaymentForm({ ...paymentForm, cardholder: val })
                  }
                />

                <Text style={styles.inputLabel}>Card Number</Text>
                <TextInput
                  style={styles.input}
                  value={paymentForm.cardNumber}
                  keyboardType="number-pad"
                  onChangeText={(val) =>
                    setPaymentForm({ ...paymentForm, cardNumber: val })
                  }
                />

                <Text style={styles.inputLabel}>Expiry Date</Text>
                <TextInput
                  style={styles.input}
                  value={paymentForm.expiryDate}
                  placeholder="MM/YY"
                  onChangeText={(val) =>
                    setPaymentForm({ ...paymentForm, expiryDate: val })
                  }
                />

                <Text style={styles.inputLabel}>Billing Address</Text>
                <TextInput
                  style={styles.input}
                  value={paymentForm.billingAddress}
                  onChangeText={(val) =>
                    setPaymentForm({ ...paymentForm, billingAddress: val })
                  }
                />

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setEditPaymentModal(false)}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={handleSavePayment}
                    disabled={savingPayment}
                  >
                    {savingPayment ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.saveBtnText}>Save</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* EDIT RENTAL INFORMATION MODAL */}
      <Modal
        visible={editRentalModal}
        transparent
        animationType="fade"
        onRequestClose={() => setEditRentalModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setEditRentalModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <ScrollView
                style={styles.modalContentScroll}
                contentContainerStyle={styles.modalContent}
              >
                <Text style={styles.modalTitle}>Edit Rental Preferences</Text>

                <Text style={styles.inputLabel}>Preferred Equipment</Text>
                <TextInput
                  style={styles.input}
                  value={rentalForm.preferredEquipment}
                  onChangeText={(val) =>
                    setRentalForm({ ...rentalForm, preferredEquipment: val })
                  }
                />

                <Text style={styles.inputLabel}>Preferred Pickup Location</Text>
                <TextInput
                  style={styles.input}
                  value={rentalForm.pickupLocation}
                  onChangeText={(val) =>
                    setRentalForm({ ...rentalForm, pickupLocation: val })
                  }
                />

                <Text style={styles.inputLabel}>Rental Frequency</Text>
                <TextInput
                  style={styles.input}
                  value={rentalForm.rentalFrequency}
                  onChangeText={(val) =>
                    setRentalForm({ ...rentalForm, rentalFrequency: val })
                  }
                />

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setEditRentalModal(false)}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={handleSaveRental}
                    disabled={savingRental}
                  >
                    {savingRental ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.saveBtnText}>Save</Text>
                    )}
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

  /* RENTER CARD */
  renterCard: {
    backgroundColor: "#0B2554",
    borderRadius: 16,
  },
  renterHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    padding: 16,
  },
  renterTitle: {
    fontFamily: "pBold",
    fontSize: 18,
    color: "#FFFFFF",
  },
  renterSubtitle: {
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
  fieldSpacing: {
    marginTop: 8,
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
