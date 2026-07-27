import { Tabs } from "expo-router";

export default function TabBar() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="booking" />
      <Tabs.Screen name="listItem" />
      <Tabs.Screen name="message" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
