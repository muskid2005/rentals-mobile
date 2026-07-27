import { StyleSheet, TextInput, View } from "react-native";

export default function InputBar({
  value,
  onChangeText,
  keyboardType,
  placeholder,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={styles.input}
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8E8E93"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#0b255477",
    borderRadius: 24,
    paddingHorizontal: 12,
    height: 36,
    alignSelf: "center",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
  },
});
