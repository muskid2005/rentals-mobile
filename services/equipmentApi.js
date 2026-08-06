import { Alert, Platform } from "react-native";
import { BASE_URL } from "../config/api";
import { useUserStore } from "../store/useStore";

export const postEquipmentJob = async (equipmentData, selectedPhotos = []) => {
  try {
    const { apiFetch, getValidAccessToken } = useUserStore.getState();

    // 1. Create Equipment Listing
    const { response: createResponse, error: createError } = await apiFetch(
      "/equipment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: equipmentData.title,
          description: equipmentData.description,
          category: equipmentData.category,
          brand: equipmentData.brand || "",
          model: equipmentData.model || "",
          condition: equipmentData.condition || "Good",
          dailyRate: Number(equipmentData.dailyRate) || 0,
          weeklyRate: Number(equipmentData.weeklyRate) || 0,
          securityDepositAmount:
            Number(equipmentData.securityDepositAmount) || 0,
          address: equipmentData.address || "",
          latitude: Number(equipmentData.latitude) || 0,
          longitude: Number(equipmentData.longitude) || 0,
        }),
      },
    );

    if (createError) {
      Alert.alert("Error", createError);
      return { success: false, message: createError };
    }

    const createResult = await createResponse.json();

    if (!createResponse.ok || !createResult?.data?.id) {
      const errorMsg =
        createResult?.message || "Failed to create equipment listing.";
      Alert.alert("Listing Error", errorMsg);
      return { success: false, message: errorMsg };
    }

    const equipmentId = createResult.data.id;

    // 2. Upload Equipment Photos (Multipart FormData)
    if (selectedPhotos && selectedPhotos.length > 0) {
      const formData = new FormData();

      selectedPhotos.forEach((photoUri, index) => {
        // Fix iOS URI pathing if needed
        const cleanUri =
          Platform.OS === "ios" ? photoUri.replace("file://", "") : photoUri;

        const filename = photoUri.split("/").pop() || `photo_${index}.jpg`;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        formData.append("photos", {
          uri: Platform.OS === "android" ? photoUri : cleanUri,
          name: filename,
          type: type,
        });
      });

      const token = await getValidAccessToken();

      const uploadResponse = await fetch(
        `${BASE_URL}/equipment/${equipmentId}/photos`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            // DO NOT set 'Content-Type': 'multipart/form-data' here!
          },
          body: formData,
        },
      );

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok) {
        Alert.alert(
          "Photo Upload Warning",
          uploadResult?.message ||
            "Equipment created, but photo upload failed.",
        );
      }
    }

    return {
      success: true,
      equipment: createResult.data,
      message: "Equipment listing posted successfully!",
    };
  } catch (error) {
    const catchMsg = error.message || "An unexpected error occurred.";
    Alert.alert("System Error", catchMsg);
    return { success: false, message: catchMsg };
  }
};
