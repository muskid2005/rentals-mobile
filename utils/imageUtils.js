import * as ImagePicker from "expo-image-picker";

export const pickAndUploadProfileImage = async (apiFetch) => {
  try {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      return {
        success: false,
        error: "Permission to access media library is required.",
      };
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return { success: false, error: "Image selection cancelled." };
    }

    const selectedAsset = result.assets[0];
    const imageUri = selectedAsset.uri;
    const filename = imageUri.split("/").pop() || "profile-photo.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const fileType = match
      ? `image/${match[1] === "jpg" ? "jpeg" : match[1]}`
      : "image/jpeg";

    const formData = new FormData();
    // 🟢 Key fixed to 'photo' to match API curl
    formData.append("photo", {
      uri: imageUri,
      name: filename,
      type: fileType,
    });

    // 🟢 Endpoint fixed to '/users/me/profile-photo'
    const { response, error: networkError } = await apiFetch(
      "/users/me/profile-photo",
      {
        method: "PATCH",
        body: formData,
        headers: {
          // 🟢 Crucial: forces fetch to auto-generate proper multipart boundary
          "Content-Type": undefined,
        },
      },
    );

    if (networkError) {
      return { success: false, error: networkError };
    }

    const json = await response.json();

    if (response.ok && json.success) {
      return { success: true, data: json.data || json };
    } else {
      return {
        success: false,
        error: json.message || "Failed to upload image.",
      };
    }
  } catch (err) {
    return {
      success: false,
      error: err.message || "An unexpected error occurred during image upload.",
    };
  }
};
