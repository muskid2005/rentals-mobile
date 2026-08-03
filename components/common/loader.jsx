import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";

export default function Loader({ visible }) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#E8A325" />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});
