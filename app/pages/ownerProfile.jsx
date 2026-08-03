import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SafeArea from "../../components/common/safeArea";
import HeaderBar from "../../components/layout/headerComponents";

export default function OwnerProfile() {
  return (
    <SafeArea>
      <HeaderBar
        name="Profile"
        image={require("../../assets/images/profile.jpg")}
        notificationCount={5}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.ownerCard}>
          <View style={styles.ownerHeaderRow}>
            <View>
              <Text style={styles.ownerTitle}>Owner Profile</Text>
              <Text style={styles.ownerSubtitle}>
                Manage your personal and business{"\n"}information
              </Text>
            </View>
            <TouchableOpacity style={styles.editProfileBtn}>
              <Text style={styles.editProfileBtnText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profileInnerCard}>
            <View style={styles.avatarContainer}>
              <Image
                source={require("../../assets/images/profile.jpg")}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.cameraBadge}>
                <Ionicons name="camera-outline" size={14} color="#0B2554" />
              </TouchableOpacity>
            </View>

            <View style={styles.profileDetails}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>Jane Smith</Text>
                <View style={styles.verifiedBadge}>
                  <MaterialIcons name="verified" size={12} color="#2E7D32" />
                  <Text style={styles.verifiedText}>Verified Renter</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Feather name="mail" size={12} color="#0B2554" />
                <Text style={styles.infoText}>jane.smith@email.com</Text>
              </View>

              <View style={styles.infoRow}>
                <Feather name="phone" size={12} color="#0B2554" />
                <Text style={styles.infoText}>+234 801 234 5678</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={12} color="#0B2554" />
                <Text style={styles.infoText}>Lagos, Nigeria</Text>
              </View>

              <View style={styles.infoRow}>
                <Feather name="calendar" size={12} color="#0B2554" />
                <Text style={styles.infoText}>Joined on Jan 10, 2025</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>PAYOUT ACCOUNT INFORMATION</Text>
            <TouchableOpacity>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.gridRow}>
            <View style={[styles.gridBox, styles.grayBox]}>
              <Text style={styles.fieldLabel}>Bank Name</Text>
              <Text style={styles.fieldValueBold}>GTBank Plc</Text>

              <Text style={[styles.fieldLabel, { marginTop: 8 }]}>
                Account Number
              </Text>
              <Text style={styles.fieldValueBold}>0123456789</Text>

              <Text style={[styles.fieldLabel, { marginTop: 8 }]}>
                Account Name
              </Text>
              <Text style={styles.fieldValueBold}>Jane Smith</Text>
            </View>

            <View style={[styles.gridBox, styles.beigeBox]}>
              <Text style={styles.fieldLabel}>Swift Code</Text>
              <Text style={styles.fieldValueBold}>GTBINGLA</Text>

              <Text style={[styles.fieldLabel, { marginTop: 8 }]}>
                Bank Verification Number (BVN)
              </Text>
              <Text style={styles.fieldValueBold}>*******1234</Text>

              <Text style={[styles.fieldLabel, { marginTop: 8 }]}>
                Card Number
              </Text>
              <Text style={styles.fieldValueBold}>4456****1234 (VISA)</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>BUSINESS INFORMATION</Text>
            <TouchableOpacity>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.gridRow}>
            <View style={[styles.gridBox, styles.grayBox]}>
              <Text style={styles.fieldLabel}>Business Name</Text>
              <Text style={styles.fieldValueBold}>Smith Rentals LTD</Text>

              <Text style={[styles.fieldLabel, { marginTop: 8 }]}>
                Business Type
              </Text>
              <Text style={styles.fieldValueBold}>Rental Service</Text>

              <Text style={[styles.fieldLabel, { marginTop: 8 }]}>
                Years in Business
              </Text>
              <Text style={styles.fieldValueBold}>3+ Years</Text>
            </View>

            <View style={[styles.gridBox, styles.beigeBox]}>
              <Text style={styles.fieldLabel}>Address</Text>
              <Text style={styles.fieldValueBold}>
                12, Adekunle street, Surulere, Lagos
              </Text>

              <Text style={[styles.fieldLabel, { marginTop: 8 }]}>
                CAC Number
              </Text>
              <Text style={styles.fieldValueBold}>RC1234567</Text>

              <Text style={[styles.fieldLabel, { marginTop: 8 }]}>
                Tax Identification Number (TIN)
              </Text>
              <Text style={styles.fieldValueBold}>12345678901</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>BUSINESS OVERVIEW</Text>
            <TouchableOpacity>
              <Text style={styles.editText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.gridRow}>
            <View style={[styles.gridBox, styles.grayBox]}>
              <Text style={styles.fieldLabel}>Total Rentals</Text>
              <Text style={styles.fieldValueBold}>27</Text>

              <Text style={[styles.fieldLabel, { marginTop: 8 }]}>
                Completed Rentals
              </Text>
              <Text style={styles.fieldValueBold}>24</Text>

              <Text style={[styles.fieldLabel, { marginTop: 8 }]}>
                Total Earnings
              </Text>
              <Text style={styles.fieldValueBold}>₦550,000</Text>
            </View>

            <View style={[styles.gridBox, styles.beigeBox]}>
              <Text style={styles.fieldLabel}>Average Rating</Text>
              <Text style={styles.fieldValueBold}>4.8</Text>

              <Text style={[styles.fieldLabel, { marginTop: 8 }]}>
                Disputes
              </Text>
              <Text style={styles.fieldValueBold}>04</Text>

              <Text style={[styles.fieldLabel, { marginTop: 8 }]}>Reports</Text>
              <Text style={styles.fieldValueBold}>Nil</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
});