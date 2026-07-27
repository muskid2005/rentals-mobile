import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import SaveArea from "../components/common/safeArea";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      // only use this line to reset the onboarding flag for testing purposes
      await AsyncStorage.removeItem("hasSeenOnboarding");
      const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");

      setTimeout(() => {
        if (hasSeenOnboarding === null) {
          router.replace("/onboarding");
        } else {
          router.replace("/login");
        }
      }, 2000);
    } catch (error) {
      router.replace("/login");
    }
  };

  return (
    <SaveArea backgroundColor="#F2F6FF">
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Image
            source={require("../assets/images/splash-icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>
            <Text style={styles.titleDark}>Trust</Text>
            <Text style={styles.titleGold}>Lend</Text>
          </Text>

          <Text style={styles.tagline}>
            Rent with Confidence{"\n"}Lend with Trust.
          </Text>
        </View>

        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color="#1B254B" />
        </View>
      </View>
    </SaveArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justify: "space-between",
    alignItems: "center",
  },
  centerContent: {
    flex: 1,
    justify: "center",
    alignItems: "center",
    marginTop: 200,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: -0.5,
  },
  titleDark: {
    color: "#0B2554",
  },
  titleGold: {
    color: "#E8A325",
  },
  tagline: {
    fontSize: 14,
    color: "#4A5568",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 20,
    fontWeight: "500",
  },
  loaderContainer: {
    paddingBottom: 40,
  },
});
