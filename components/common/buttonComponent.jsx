import { Pressable, StyleSheet, Text } from "react-native";

export default function CustomButton({ name, onPress, style }) {
  return (
    <Pressable onPress={onPress} style={[styles.btn, style]}>
      <Text style={styles.btnText}>{name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btnText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  btn: {
    width: "80%",
    height: 48,
    borderRadius: 12,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
});
