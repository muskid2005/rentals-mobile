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

function InfoField({ label, value, isFirst }) {
  return (
    <View style={!isFirst && styles.fieldSpacing}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValueBold}>{value}</Text>
    </View>
  );
}

function InfoSection({ title, actionText, leftFields, rightFields }) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity onPress={()=>{
        
        }}>
          <Text style={styles.actionText}>{actionText}</Text>
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
  return (
    <SafeArea>
      <HeaderBar
        name="Profile"
        image={require("../../assets/images/profile2.jpg")}
        notificationCount={5}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.renterCard}>
          <View style={styles.renterHeaderRow}>
            <View>
              <Text style={styles.renterTitle}>Renter Profile</Text>
              <Text style={styles.renterSubtitle}>
                Manage your rental activities and account{"\n"}information
              </Text>
            </View>
            <TouchableOpacity style={styles.editProfileBtn}>
              <Text style={styles.editProfileBtnText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profileInnerCard}>
            <View style={styles.avatarContainer}>
              <Image
                source={require("../../assets/images/profile2.jpg")}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.cameraBadge}>
                <Ionicons name="camera-outline" size={14} color="#0B2554" />
              </TouchableOpacity>
            </View>

            <View style={styles.profileDetails}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>John Doe</Text>
                <View style={styles.verifiedBadge}>
                  <MaterialIcons name="verified" size={12} color="#2E7D32" />
                  <Text style={styles.verifiedText}>Verified Renter</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Feather name="mail" size={12} color="#0B2554" />
                <Text style={styles.infoText}>johndoe45@email.com</Text>
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
                <Text style={styles.infoText}>Joined on May 12, 2025</Text>
              </View>
            </View>
          </View>
        </View>

        <InfoSection
          title="PAYMENT METHOD"
          actionText="Edit"
          leftFields={[
            { label: "Preferred Payment Method", value: "Visa ****3256" },
            { label: "Cardholder", value: "John Doe" },
            { label: "Billing Address", value: "Lagos, Nigeria" },
          ]}
          rightFields={[
            { label: "Payment Status", value: "Verified" },
            { label: "Default Card", value: "Visa" },
            { label: "Expiry Date", value: "08/28" },
          ]}
        />

        <InfoSection
          title="RENTAL INFORMATION"
          actionText="Edit"
          leftFields={[
            { label: "Preferred Equipment", value: "Cameras" },
            { label: "Rental Frequency", value: "Frequent" },
            { label: "Total Rentals", value: "18" },
          ]}
          rightFields={[
            { label: "Preferred Pickup Location", value: "Lekki, Lagos" },
            { label: "Active Rentals", value: "02" },
            { label: "Completed Rentals", value: "16" },
          ]}
        />

        <InfoSection
          title="RENTAL OVERVIEW"
          actionText="View All"
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  renterSubtitle: {
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
    color: "#0B2554",
    fontSize: 12,
    fontWeight: "600",
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
    fontSize: 15,
    fontWeight: "bold",
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
    fontSize: 9,
    color: "#2E7D32",
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    fontSize: 11,
    color: "#0B2554",
  },

  /* REUSABLE SECTION CARDS */
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
    fontSize: 13,
    fontWeight: "bold",
    color: "#0B2554",
    letterSpacing: 0.5,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
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
    fontSize: 10,
    color: "#0B2554",
  },
  fieldValueBold: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0B2554",
    marginTop: 1,
  },
});
