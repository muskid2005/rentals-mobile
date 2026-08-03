import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

import { router } from "expo-router";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import SafeArea from "../components/common/safeArea";

export default function RenterSignUp() {
  const [role, setRole] = useState("renter");
  const [agreed, setAgreed] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleCreateAccount = () => {
    if (!agreed) {
      alert("Please agree to the Terms & Conditions and Privacy Policy");
      return;
    }
    console.log({ role, fullName, email, phone, password });
  };

  return (
    <SafeArea>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          marginTop: 22,
          gap: 8,
          marginBottom: 12,
        }}
      >
        <Image
          source={require("../assets/images/splash-icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <View>
          <Text style={styles.title}>
            <Text style={styles.titleDark}>Trust</Text>
            <Text style={styles.titleGold}>Lend</Text>
          </Text>
        </View>
      </View>
      <View style={{ marginBottom: 32 }}>
        <Text style={styles.headerTitle}>Welcome</Text>
        <Text style={styles.headerSubtitle}>
          Sign up to create your account
        </Text>
      </View>
      <View style={styles.container}>
        <View style={styles.toggleRow}>
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              backgroundColor: "#F0F0F0",
              borderRadius: 20,
              padding: 2,
              width: "100%",
            }}
          >
            <TouchableOpacity
              style={[
                styles.toggleButton,
                { backgroundColor: role === "renter" ? "#0B2554" : "#F0F0F0" },
              ]}
              onPress={() => setRole("renter")}
            >
              <Text
                style={[
                  styles.toggleText,
                  { color: role === "renter" ? "#FFFFFF" : "#0B2554" },
                ]}
              >
                I'm a Renter
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                { backgroundColor: role === "owner" ? "#0B2554" : "#F0F0F0" },
              ]}
              onPress={() => setRole("owner")}
            >
              <Text
                style={[
                  styles.toggleText,
                  { color: role === "owner" ? "#FFFFFF" : "#0B2554" },
                ]}
              >
                I'm an Owner
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#C4CDDD"
          value={fullName}
          onChangeText={setFullName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#C4CDDD"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#C4CDDD"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#C4CDDD"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#C4CDDD"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <View style={styles.checkboxRow}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              agreed && { backgroundColor: "#E8A325", borderColor: "#E8A325" },
            ]}
            onPress={() => setAgreed(!agreed)}
          >
            {agreed && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
          </TouchableOpacity>

          <Text style={styles.termsText}>
            I agree to the{" "}
            <Text style={styles.termsHighlight}>Terms & Conditions</Text> and{" "}
            <Text style={styles.termsHighlight}>Privacy Policy</Text>
          </Text>
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateAccount}
        >
          <Text style={styles.createButtonText}>Create Account</Text>
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.loginHighlight}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontFamily: "pBold",
    fontSize: 22,
    color: "#0B2554",
    textAlign: "center",
  },
  headerSubtitle: {
    fontFamily: "pRegular",
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
    textAlign: "center",
  },
  title: {
    marginTop: 4,
  },
  titleDark: {
    fontFamily: "pBold",
    fontSize: 32,
    color: "#0B2554",
  },
  titleGold: {
    fontFamily: "pBold",
    fontSize: 32,
    color: "#E8A325",
  },
  logo: {
    width: 48,
    height: 48,
    marginBottom: 12,
  },
  container: {
    flex: 1,
    alignItems: "center",
    marginBottom: 300,
  },
  toggleRow: {
    flexDirection: "row",
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleText: {
    fontFamily: "pSemiBold",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 18,
  },
  input: {
    width: 344,
    height: 44,
    backgroundColor: "#FCFDFF",
    borderRadius: 16,
    paddingHorizontal: 12,
    marginBottom: 14,
    fontFamily: "pRegular",
    fontSize: 14,
    color: "#0B2554",
    borderWidth: 1,
    borderColor: "#E5E9F2",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    width: 344,
    marginTop: 6,
    marginBottom: 20,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#C4CDDD",
    marginRight: 8,
    marginLeft: 8,
    alignItems: "center",
    justify: "center",
  },
  termsText: {
    flex: 1,
    fontFamily: "pRegular",
    fontSize: 12,
    color: "#0B2554",
  },
  termsHighlight: {
    fontFamily: "pSemiBold",
    color: "#E8A325",
  },
  createButton: {
    width: 335,
    height: 48,
    backgroundColor: "#0B2554",
    borderRadius: 16,
    alignItems: "center",
    justify: "center",
    marginBottom: 16,
  },
  createButtonText: {
    fontFamily: "pSemiBold",
    color: "#FFFFFF",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 20,
    marginTop:10,
  },
  loginRow: {
    flexDirection: "row",
    alignItems: "center",
    justify: "center",
  },
  loginText: {
    fontFamily: "pRegular",
    color: "#0B2554",
    fontSize: 13,
  },
  loginHighlight: {
    fontFamily: "pSemiBold",
    color: "#E8A325",
  },
});