import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NotificationCard from "../components/cards/notificationComponent";
import RentalCard from "../components/cards/rentalCardComponent";
import ReviewCard from "../components/cards/reviewCardComponents";
import SavedEquipmentCard from "../components/cards/savedEquipmentsComponent";
import CustomButton from "../components/common/buttonComponent";
import CustomDropdown from "../components/common/dropdownComponent";
import SearchBar from "../components/common/searchComponent";

const data = [
  { label: "Camera Gear", value: "1" },
  { label: "Lighting Equipment", value: "2" },
  { label: "Audio & Microphones", value: "3" },
  { label: "Drones & Accessories", value: "4" },
];

export default function Index() {
  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: 24, alignItems: "center" }}>
          <Text style={{ marginBottom: 8 }}>btn component</Text>
          <CustomButton name="Button" onPress={null} style={null} />
        </View>

        <View style={{ marginTop: 24, alignItems: "center" }}>
          <Text style={{ marginBottom: 8 }}>Dropdown component</Text>
          <CustomDropdown data={data} style={null} label="Location" />
        </View>

        <View style={{ marginTop: 24, alignItems: "center" }}>
          <Text style={{ marginBottom: 8 }}>search component</Text>
          <SearchBar
            name="Button"
            onChangeText={null}
            style={null}
            style={null}
            value={null}
            placeholder="Camera"
          />
        </View>

        <View style={{ marginTop: 24, alignItems: "center" }}>
          <Text style={{ marginBottom: 8 }}>notification component</Text>
          <NotificationCard
            title="Return request received"
            description="Lorem ipsum pharetra habitant mi volutpat ullamcorper"
            time="2 hours ago"
            unread={true}
          />
        </View>

        <View style={{ marginTop: 24, alignItems: "center" }}>
          <Text style={{ marginBottom: 8 }}>rental card component</Text>
          <RentalCard
            title="Godox Studio Light Set"
            owner="Tunde A."
            dateRange="Jul 23 – Jul 27, 2026"
            status="Due Today" // e.g., "Active", "Due Today", "Completed"
            imageUri={null}
            onViewDetails={null}
          />
        </View>

        <View style={{ marginTop: 24, alignItems: "center" }}>
          <Text style={{ marginBottom: 8 }}>SavedEquipment component</Text>
          <SavedEquipmentCard
            title="Canon EOS R6"
            price="₦12,000/day"
            rating="4.8"
            imageUri={null}
            isFavorite={false}
            onPress={null}
            onFavoritePress={null}
          />
        </View>

        <View style={{ marginTop: 24, alignItems: "center" }}>
          <Text style={{ marginBottom: 8 }}>review component</Text>
          <ReviewCard
            name="Tolu Adeyemi"
            badgeText="Verified Renter"
            rating="5"
            timeAgo="2 Weeks Ago"
            comment="Great equipment and excellent Service. The owner was very helpful and responsive."
            itemName="Canon R6 Camera"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
