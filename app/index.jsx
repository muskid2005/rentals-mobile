import { router } from "expo-router";
import { Text, View } from "react-native";
import CustomButton from "../components/common/buttonComponent";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <CustomButton
        onPress={() => router.push("/components")}
        name="componets ->"
      />
       <CustomButton
        onPress={() => router.push("/RenterSignUp")}
        name="SignUp ->"
      />
    </View>
  );
}
