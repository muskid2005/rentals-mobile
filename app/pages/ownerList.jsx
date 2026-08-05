import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { WebView } from "react-native-webview";
import Loader from "../../components/common/loader";
import { postEquipmentJob } from "../../services/equipmentApi";

import SafeArea from "../../components/common/safeArea";
import Sidebar from "../../components/common/sideBar";
import HeaderBar from "../../components/layout/headerComponents";
import { useUserStore } from "../../store/useStore";

export default function OwnerListItemScreen() {
  const { user } = useUserStore();
  const { width } = useWindowDimensions();
  const webViewRef = useRef(null);

  // Navigation & Drawer State
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Photo Upload State (Array of URI strings)
  const [photos, setPhotos] = useState([]);

  // Form State
  const [equipmentTitle, setEquipmentTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Construction");
  const [description, setDescription] = useState("");

  // Technical Specs
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [weight, setWeight] = useState("");
  const [maxDepth, setMaxDepth] = useState("");

  // Rental Terms
  const [dailyRate, setDailyRate] = useState("");
  const [weeklyRate, setWeeklyRate] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [deliveryAvailable, setDeliveryAvailable] = useState(false);

  // Map & Location State
  const [searchAddress, setSearchAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [coords, setCoords] = useState({
    latitude: 6.5244, // Default center (Lagos)
    longitude: 3.3792,
  });
  const [condition, setCondition] = useState("Good");
  // const [pickupAddress, setPickupAddress] = useState("");

  const categories = [
    { id: "Construction", label: "Construction", icon: "construct-outline" },
    { id: "Media Gear", label: "Media Gear", icon: "videocam-outline" },
    { id: "Farming", label: "Farming", icon: "leaf-outline" },
    { id: "Others", label: "Others", icon: "ellipsis-horizontal-outline" },
  ];

  // Pick Image Handler using expo-image-picker
  const handlePickImage = async (indexToReplace = null) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      const selectedUri = result.assets[0].uri;

      setPhotos((prevPhotos) => {
        const newPhotos = [...prevPhotos];
        if (indexToReplace !== null && indexToReplace < newPhotos.length) {
          newPhotos[indexToReplace] = selectedUri;
        } else if (newPhotos.length < 4) {
          newPhotos.push(selectedUri);
        }
        return newPhotos;
      });
    }
  };

  // Remove Photo Handler
  const handleRemovePhoto = (indexToRemove) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Free Geocoding Search via OpenStreetMap Nominatim
  const handleSearchLocation = async () => {
    if (!searchAddress.trim()) {
      Alert.alert(
        "Empty Search",
        "Please enter an address or location to search.",
      );
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchAddress,
        )}`,
        {
          headers: {
            "User-Agent": "TrustLendApp/1.0",
            "Accept-Language": "en",
          },
        },
      );

      if (!response.ok) {
        Alert.alert(
          "Search Error",
          "Unable to fetch location details. Please try again.",
        );
        return;
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const newLat = parseFloat(data[0].lat);
        const newLng = parseFloat(data[0].lon);

        setCoords({ latitude: newLat, longitude: newLng });

        // Animate map & move marker
        const updateScript = `
        if (window.map && window.marker) {
          window.map.setView([${newLat}, ${newLng}], 14);
          window.marker.setLatLng([${newLat}, ${newLng}]);
        }
        true;
      `;
        webViewRef.current?.injectJavaScript(updateScript);
      } else {
        Alert.alert(
          "Location Not Found",
          "No matching location was found. Try a different address.",
        );
      }
    } catch (error) {
      Alert.alert(
        "Network Error",
        "Could not connect to the map service. Please check your internet connection.",
      );
    } finally {
      setIsSearching(false);
    }
  };
  // OpenStreetMap + Leaflet HTML Content
  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body, html, #map { height: 100%; margin: 0; padding: 0; width: 100%; }
        .leaflet-container { background: #f4f7fc; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        window.map = L.map('map', { zoomControl: false }).setView([${coords.latitude}, ${coords.longitude}], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo(window.map);

        window.marker = L.marker([${coords.latitude}, ${coords.longitude}], { draggable: true }).addTo(window.map);

        function updatePosition(lat, lng) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'LOCATION_SELECTED',
            latitude: lat,
            longitude: lng
          }));
        }

        window.marker.on('dragend', function (e) {
          var position = window.marker.getLatLng();
          updatePosition(position.lat, position.lng);
        });

        window.map.on('click', function(e) {
          window.marker.setLatLng(e.latlng);
          updatePosition(e.latlng.lat, e.latlng.lng);
        });
      </script>
    </body>
    </html>
  `;

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "LOCATION_SELECTED") {
        setCoords({
          latitude: data.latitude,
          longitude: data.longitude,
        });
        console.log("Updated Pin Coordinates:", data.latitude, data.longitude);
      }
    } catch (e) {
      console.log("Error parsing map message:", e);
    }
  };

  // -------------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------

  const handleSubmit = async () => {
    setIsLoading(true);

    const payload = {
      title: equipmentTitle,
      description: description,
      category: selectedCategory,
      brand: brand,
      model: model,
      condition: condition,
      dailyRate: dailyRate,
      weeklyRate: weeklyRate,
      securityDepositAmount: securityDeposit,
      address: searchAddress,
      latitude: coords.latitude,
      longitude: coords.longitude,
    };

    const result = await postEquipmentJob(payload, photos);

    setIsLoading(false);

    if (result.success) {
      Alert.alert("Success", result.message);
      router.replace("/dashboard");
    }
  };

  // -------------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------------

  return (
    <SafeArea>
      {isLoading && <Loader />}

      <HeaderBar
        name="Add Equipment"
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
        style={[styles.container, { width }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* MEDIA LIBRARY SECTION */}
        <Text style={styles.sectionHeading}>MEDIA LIBRARY</Text>

        <View style={styles.mediaContainerWrapper}>
          {/* Main Cover Photo Box */}
          {photos[0] ? (
            <View style={styles.previewBoxMain}>
              <Image source={{ uri: photos[0] }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.deleteBadge}
                onPress={() => handleRemovePhoto(0)}
              >
                <Ionicons name="close" size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.uploadMainBox}
              onPress={() => handlePickImage()}
            >
              <View style={styles.cameraCircle}>
                <Ionicons name="camera-outline" size={24} color="#00796B" />
              </View>
              <Text style={styles.uploadTitle}>Add Photo</Text>
              <Text style={styles.uploadSub}>Recommended 1600x900px</Text>
            </TouchableOpacity>
          )}

          {/* Sub Photos Row */}
          <View style={styles.subPhotosRow}>
            {[1, 2, 3].map((slotIndex) => {
              const photoUri = photos[slotIndex];
              return photoUri ? (
                <View key={slotIndex} style={styles.subPhotoPreviewBox}>
                  <Image
                    source={{ uri: photoUri }}
                    style={styles.previewImage}
                  />
                  <TouchableOpacity
                    style={styles.deleteBadgeSub}
                    onPress={() => handleRemovePhoto(slotIndex)}
                  >
                    <Ionicons name="close" size={12} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  key={slotIndex}
                  style={styles.subPhotoBox}
                  onPress={() => handlePickImage(slotIndex)}
                >
                  <Ionicons name="add" size={20} color="#CBD5E1" />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* EQUIPMENT TITLE */}
        <Text style={styles.sectionHeading}>EQUIPMENT TITLE</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Caterpillar 305.5E2 Mini Excavator"
          placeholderTextColor="#94A3B8"
          value={equipmentTitle}
          onChangeText={setEquipmentTitle}
        />

        {/* CATEGORY */}
        <Text style={styles.sectionHeading}>CATEGORY</Text>
        <View style={styles.categoryGrid}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryCard,
                  isSelected && styles.categoryCardSelected,
                ]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Ionicons
                  name={cat.icon}
                  size={18}
                  color={isSelected ? "#FFFFFF" : "#0B2554"}
                />
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextSelected,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* DETAILED DESCRIPTION */}
        <Text style={styles.sectionHeading}>DETAILED DESCRIPTION</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe your equipment's condition, features, and any specific rental terms..."
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />
        <View style={styles.charCountRow}>
          <Text style={styles.charCountText}>
            Be specific to build trust with renters.
          </Text>
          <Text style={styles.charCountText}>{description.length} / 2000</Text>
        </View>

        {/* TECHNICAL SPECIFICATIONS */}
        <Text style={styles.sectionHeading}>TECHNICAL SPECIFICATIONS</Text>

        <View style={styles.twoColumnRow}>
          <View style={styles.halfColumn}>
            <Text style={styles.fieldLabel}>Brand</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Sony"
              placeholderTextColor="#94A3B8"
              value={brand}
              onChangeText={setBrand}
            />
          </View>
          <View style={styles.halfColumn}>
            <Text style={styles.fieldLabel}>Model</Text>
            <TextInput
              style={styles.input}
              placeholder="Z30"
              placeholderTextColor="#94A3B8"
              value={model}
              onChangeText={setModel}
            />
          </View>
        </View>

        <View style={styles.twoColumnRow}>
          <View style={styles.halfColumn}>
            <Text style={styles.fieldLabel}>WEIGHT (KG)</Text>
            <TextInput
              style={styles.input}
              placeholder="5400"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
          </View>
          <View style={styles.halfColumn}>
            <Text style={styles.fieldLabel}>MAX DEPTH (M)</Text>
            <TextInput
              style={styles.input}
              placeholder="3.8"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={maxDepth}
              onChangeText={setMaxDepth}
            />
          </View>
        </View>

        {/* RENTAL TERMS */}
        <View style={styles.iconHeadingRow}>
          <Ionicons name="cash-outline" size={18} color="#0B2554" />
          <Text style={[styles.sectionHeading, { marginBottom: 0 }]}>
            RENTAL TERMS
          </Text>
        </View>

        <View style={[styles.twoColumnRow, { marginTop: 12 }]}>
          <View style={styles.halfColumn}>
            <Text style={styles.fieldLabel}>DAILY RATE (₦)</Text>
            <TextInput
              style={styles.input}
              placeholder="250"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={dailyRate}
              onChangeText={setDailyRate}
            />
          </View>
          <View style={styles.halfColumn}>
            <Text style={styles.fieldLabel}>WEEKLY RATE (₦)</Text>
            <TextInput
              style={styles.input}
              placeholder="1200"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={weeklyRate}
              onChangeText={setWeeklyRate}
            />
          </View>
        </View>

        <Text style={styles.fieldLabel}>SECURITY DEPOSIT (₦)</Text>
        <TextInput
          style={styles.input}
          placeholder="5000"
          placeholderTextColor="#94A3B8"
          keyboardType="numeric"
          value={securityDeposit}
          onChangeText={setSecurityDeposit}
        />

        {/* OVERALL CONDITION SELECTOR */}
        <View style={styles.cardSection}>
          <Text style={styles.fieldLabel}>OVERALL CONDITION</Text>
          <View style={styles.conditionRow}>
            {["Good", "Fair", "Excellent"].map((item) => {
              const isSelected = condition === item;
              return (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.conditionBtn,
                    isSelected && styles.conditionBtnActive,
                  ]}
                  onPress={() => setCondition(item)}
                >
                  <Text
                    style={[
                      styles.conditionBtnText,
                      isSelected && styles.conditionBtnTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.toggleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleTitle}>Delivery Available</Text>
            <Text style={styles.toggleSub}>
              You offer drop-off and pick-up services
            </Text>
          </View>
          <Switch
            value={deliveryAvailable}
            onValueChange={setDeliveryAvailable}
            trackColor={{ false: "#CBD5E1", true: "#0B2554" }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* PICKUP LOCATION & SEARCH MAP */}
        <View style={styles.iconHeadingRow}>
          <Ionicons name="location-outline" size={18} color="#0B2554" />
          <Text style={[styles.sectionHeading, { marginBottom: 0 }]}>
            PICKUP LOCATION
          </Text>
        </View>

        <View style={styles.searchBoxContainer}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search address and press enter..."
            placeholderTextColor="#94A3B8"
            value={searchAddress}
            onChangeText={setSearchAddress}
            onSubmitEditing={handleSearchLocation}
            returnKeyType="search"
          />
          {isSearching ? (
            <ActivityIndicator size="small" color="#0B2554" />
          ) : (
            <TouchableOpacity onPress={handleSearchLocation}>
              <Ionicons name="arrow-forward" size={18} color="#0B2554" />
            </TouchableOpacity>
          )}
        </View>

        {/* MAP CONTAINER */}
        <View style={styles.mapContainer}>
          <WebView
            ref={webViewRef}
            originWhitelist={["*"]}
            source={{ html: mapHtml }}
            style={styles.mapWebView}
            onMessage={handleWebViewMessage}
            scrollEnabled={false}
          />
          <View style={styles.mapOverlayPill}>
            <Text style={styles.mapOverlayText}>
              Drag pin or tap map to set precise position
            </Text>
          </View>
        </View>

        {/* AVAILABILITY */}
        <View style={styles.iconHeadingRow}>
          <Ionicons name="calendar-outline" size={18} color="#0B2554" />
          <Text style={[styles.sectionHeading, { marginBottom: 0 }]}>
            AVAILABILITY
          </Text>
        </View>

        <View style={styles.availabilityCard}>
          <View style={styles.availabilityHeaderRow}>
            <Text style={styles.availabilityLabel}>Availability Status</Text>
            <View style={styles.availableBadge}>
              <Text style={styles.availableBadgeText}>Available</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.datePickerButton}>
            <Ionicons name="calendar-clear-outline" size={16} color="#0B2554" />
            <Text style={styles.datePickerButtonText}>
              Set Custom Date Ranges
            </Text>
          </TouchableOpacity>
        </View>

        {/* IDENTITY VERIFIED BANNER */}
        <View style={styles.infoBannerCard}>
          <Ionicons name="shield-checkmark" size={20} color="#00796B" />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Identity Verified Listings</Text>
            <Text style={styles.bannerSub}>
              Clear descriptions and high-quality photos increase your booking
              rate by up to 40% on TrustLend.
            </Text>
          </View>
        </View>

        {/* BOTTOM BUTTONS */}
        <View style={styles.bottomButtonsRow}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleSubmit}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.draftButton}>
            <Text style={styles.draftButtonText}>Save as Draft</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F4F7FC",
    paddingHorizontal: 16,
  },
  content: {
    paddingTop: 16,
    paddingBottom: 40,
  },

  sectionHeading: {
    fontFamily: "pBold",
    fontSize: 12,
    color: "#0B2554",
    letterSpacing: 0.5,
    marginTop: 16,
    marginBottom: 8,
  },

  iconHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
    marginBottom: 8,
  },

  /* Wrapped Media Library */

  mediaContainerWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  uploadMainBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    height: 130,
    alignItems: "center",
    justifyContent: "center",
  },

  cameraCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0F2F1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },

  uploadTitle: {
    fontFamily: "pSemiBold",
    fontSize: 13,
    color: "#0B2554",
  },

  uploadSub: {
    fontFamily: "mRegular",
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 2,
  },

  previewBoxMain: {
    height: 130,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },

  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  deleteBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  subPhotosRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  subPhotoBox: {
    flex: 1,
    height: 60,
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },

  subPhotoPreviewBox: {
    flex: 1,
    height: 60,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },

  deleteBadgeSub: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Inputs */

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: "mRegular",
    fontSize: 13,
    color: "#0B2554",
  },

  textArea: {
    height: 90,
  },

  charCountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },

  charCountText: {
    fontFamily: "mRegular",
    fontSize: 10,
    color: "#94A3B8",
  },

  /* Category Grid */

  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  categoryCard: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 8,
  },

  categoryCardSelected: {
    backgroundColor: "#0B2554",
    borderColor: "#0B2554",
  },

  categoryText: {
    fontFamily: "mSemiBold",
    fontSize: 12,
    color: "#0B2554",
  },

  categoryTextSelected: {
    color: "#FFFFFF",
  },

  /* Two Columns */

  twoColumnRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },

  halfColumn: {
    flex: 1,
  },

  fieldLabel: {
    fontFamily: "pBold",
    fontSize: 12,
    color: "#0B2554",
    letterSpacing: 0.5,
    marginBottom: 12,
  },

  /* Toggle */

  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  toggleTitle: {
    fontFamily: "pSemiBold",
    fontSize: 13,
    color: "#0B2554",
  },

  toggleSub: {
    fontFamily: "mRegular",
    fontSize: 10,
    color: "#64748B",
    marginTop: 2,
  },

  /* Search */

  searchBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
    marginBottom: 10,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 10,
    marginLeft: 8,
    fontFamily: "mRegular",
    fontSize: 13,
    color: "#0B2554",
  },

  mapContainer: {
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    position: "relative",
  },

  mapWebView: {
    flex: 1,
  },

  mapOverlayPill: {
    position: "absolute",
    bottom: 12,
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  mapOverlayText: {
    fontFamily: "mSemiBold",
    fontSize: 11,
    color: "#0B2554",
  },

  /* Availability */

  availabilityCard: {
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  availabilityHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  availabilityLabel: {
    fontFamily: "pSemiBold",
    fontSize: 13,
    color: "#0B2554",
  },

  availableBadge: {
    backgroundColor: "#00796B",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },

  availableBadgeText: {
    fontFamily: "mSemiBold",
    color: "#FFFFFF",
    fontSize: 10,
  },

  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 8,
  },

  datePickerButtonText: {
    fontFamily: "mSemiBold",
    fontSize: 12,
    color: "#0B2554",
  },

  /* Info Banner */

  infoBannerCard: {
    flexDirection: "row",
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },

  bannerTitle: {
    fontFamily: "pBold",
    fontSize: 12,
    color: "#00796B",
  },

  bannerSub: {
    fontFamily: "mRegular",
    fontSize: 10,
    color: "#475569",
    marginTop: 2,
    lineHeight: 14,
  },

  /* Bottom */

  bottomButtonsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },

  continueButton: {
    flex: 1,
    backgroundColor: "#0B2554",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },

  continueButtonText: {
    color: "#FFFFFF",
    fontFamily: "pBold",
    fontSize: 13,
  },

  draftButton: {
    flex: 1,
    backgroundColor: "#E8A325",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },

  draftButtonText: {
    color: "#0B2554",
    fontFamily: "pBold",
    fontSize: 13,
  },

  cardSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  conditionRow: {
    flexDirection: "row",
    gap: 10,
  },

  conditionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  conditionBtnActive: {
    borderColor: "#0B2554",
    borderWidth: 1.5,
    backgroundColor: "#FFFFFF",
  },

  conditionBtnText: {
    fontFamily: "mMedium",
    fontSize: 13,
    color: "#94A3B8",
  },

  conditionBtnTextActive: {
    fontFamily: "pBold",
    color: "#0B2554",
  },
});
