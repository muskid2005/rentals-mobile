import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function CustomButton({ name, onPress, style, activeOpacity }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.btn, style]}
      activeOpacity={activeOpacity}
    >
      <Text style={styles.btnText}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btnText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  btn: {
    width: "100%",
    height: 48,
    borderRadius: 12,
    backgroundColor: "#0B2554",
    justifyContent: "center",
    alignItems: "center",
  },
});
