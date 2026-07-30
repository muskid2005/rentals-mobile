import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  SplashScreen.preventAutoHideAsync();

  const [loaded, error] = useFonts({
    pBold: require("../assets/fonts/static_plusJarkatanSans/PlusJakartaSans-Bold.ttf"),
    pSemiBold: require("../assets/fonts/static_plusJarkatanSans/PlusJakartaSans-SemiBold.ttf"),
    pRegular: require("../assets/fonts/static_plusJarkatanSans/PlusJakartaSans-Regular.ttf"),
    mBold: require("../assets/fonts/static_Manrope/Manrope-Bold.ttf"),
    mSemiBold: require("../assets/fonts/static_Manrope/Manrope-SemiBold.ttf"),
    mRegular: require("../assets/fonts/static_Manrope/Manrope-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
       <Stack.Screen name="Inspection" />
      <Stack.Screen name="RenterSignUp" />
      <Stack.Screen name="components" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
