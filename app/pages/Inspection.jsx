import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const CHECKLIST_ITEMS = [
  { id: "body", label: "Physical body / casing" },
  { id: "lens", label: "Lens / glass surfaces" },
  { id: "accessories", label: "Accessories included" },
  { id: "battery", label: "Battery & Charger" },
  { id: "parts", label: "All original parts present" },
];

export default function Inspection() {
  const [checkedItems, setCheckedItems] = useState({});
  const [condition, setCondition] = useState(null);
  const [notes, setNotes] = useState("");

  const toggleCheck = (id) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleConfirmReturn = () => {
    console.log({ checkedItems, condition, notes });
  };

  const handleReportDamage = () => {
    console.log("Report damage pressed");
  };

  return (
    <KeyboardAvoidingView style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={24} color="#0B2554" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Return Inspection</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.itemRow}>
            <Image
              source={require("../../assets/images/Cannon.png")}
              style={styles.itemImage}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>Canon EOS R50</Text>
              <Text style={styles.itemSubtitle}>Digital Camera</Text>
              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>Returned - Today</Text>
              </View>
            </View>
          </View>

          <View style={styles.renterRow}>
            <Image
              source={require("../../assets/images/inspectionProfilePic.png")}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.renterName}>Peace D.</Text>
              <View style={styles.verifiedPill}>
                <Ionicons name="checkmark-circle" size={12} color="#0B2554" />
                <Text style={styles.verifiedPillText}>Verified Renter</Text>
              </View>
            </View>
            <Text style={styles.renterLabel}>Renter</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>RENTAL PERIOD</Text>
          <View style={styles.periodRow}>
            <View style={styles.periodColumn}>
              <Text style={styles.periodLabel}>Picked up</Text>
              <Text style={styles.periodValue}>Jul 18</Text>
            </View>
            <View style={styles.periodDivider} />
            <View style={styles.periodColumn}>
              <Text style={styles.periodLabel}>Returned</Text>
              <Text style={styles.periodValue}>Jul 22</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>CONDITION CHECKLIST</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {CHECKLIST_ITEMS.map((item) => {
            const checked = !!checkedItems[item.id];
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.checklistRow}
                onPress={() => toggleCheck(item.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    checked && styles.checkboxChecked,
                  ]}
                >
                  {checked && (
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  )}
                </View>
                <Text style={styles.checklistLabel}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>PHOTO EVIDENCE</Text>
          <View style={styles.photoRow}>
            <Image
              source={require("../../assets/images/Cannon2.png")}
              style={styles.photoThumb}
            />
            <Image
              source={require("../../assets/images/Cannon3.png")}
              style={styles.photoThumb}
            />
            <TouchableOpacity style={styles.addPhotoBox}>
              <Ionicons name="add" size={22} color="#0B2554" />
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>OVERALL CONDITION</Text>
          <View style={styles.conditionRow}>
            {["Good", "Fair", "Damaged"].map((option) => {
              const selected = condition === option;
              return (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.conditionButton,
                    selected && styles.conditionButtonSelected,
                  ]}
                  onPress={() => setCondition(option)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.conditionButtonText,
                      selected && styles.conditionButtonTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>INSPECTION NOTES</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Type a message..."
            placeholderTextColor="#9AA5B1"
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </View>

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmReturn}
        >
          <Text style={styles.confirmButtonText}>Confirm Return</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.reportButton}
          onPress={handleReportDamage}
        >
          <Text style={styles.reportButtonText}>Report Damage</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F2F7FF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "#F2F7FF",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0B2554",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: "#F2F7FF",
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0B2554",
  },
  itemSubtitle: {
    fontSize: 13,
    color: "#5B6B85",
    marginTop: 2,
    marginBottom: 8,
  },
  statusPill: {
    alignSelf: "flex-start",
    backgroundColor: "#F2F7FF",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusPillText: {
    fontSize: 12,
    color: "#0B2554",
    fontWeight: "600",
  },
  renterRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F2F7FF",
    paddingTop: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#F2F7FF",
  },
  renterName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0B2554",
  },
  verifiedPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#F4B942",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 4,
  },
  verifiedPillText: {
    fontSize: 11,
    color: "#0B2554",
    fontWeight: "600",
    marginLeft: 4,
  },
  renterLabel: {
    fontSize: 13,
    color: "#5B6B85",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0B2554",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seeAll: {
    fontSize: 13,
    color: "#0B2554",
    fontWeight: "600",
    marginBottom: 12,
  },
  periodRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  periodColumn: {
    flex: 1,
  },
  periodDivider: {
    width: 1,
    height: 36,
    backgroundColor: "#E3EAF5",
    marginHorizontal: 16,
  },
  periodLabel: {
    fontSize: 12,
    color: "#5B6B85",
    marginBottom: 4,
  },
  periodValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0B2554",
  },
  checklistRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#C7D2E3",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  checkboxChecked: {
    backgroundColor: "#0B2554",
    borderColor: "#0B2554",
  },
  checklistLabel: {
    fontSize: 14,
    color: "#0B2554",
  },
  photoRow: {
    flexDirection: "row",
  },
  photoThumb: {
    width: 88,
    height: 88,
    borderRadius: 10,
    backgroundColor: "#F2F7FF",
    marginRight: 10,
  },
  addPhotoBox: {
    width: 88,
    height: 88,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#C7D2E3",
    alignItems: "center",
    justifyContent: "center",
  },
  addPhotoText: {
    fontSize: 11,
    color: "#0B2554",
    marginTop: 4,
  },
  conditionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  conditionButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#DBDEE5",
    alignItems: "center",
  },
  conditionButtonSelected: {
    backgroundColor: "#FFFFFF",
    borderColor: "#0B2554",
  },
  conditionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#DBDEE5",
  },
  conditionButtonTextSelected: {
    color: "#0B2554",
  },
  notesInput: {
    minHeight: 60,
    borderWidth: 1,
    borderColor: "#C7D2E3",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: "#0B2554",
    textAlignVertical: "top",
  },
  confirmButton: {
    backgroundColor: "#0B2554",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  reportButton: {
    backgroundColor: "#F4B942",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  reportButtonText: {
    color: "#0B2554",
    fontSize: 15,
    fontWeight: "700",
  },
});