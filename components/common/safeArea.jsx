import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SaveArea({ children, style }) {
  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[styles.container, style]}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
    backgroundColor: "#f2f7ff",
  },
});
