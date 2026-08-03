import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Loader from "../components/common/loader";
import SafeArea from "../components/common/safeArea";
import { BASE_URL } from "../config/api";
import { useUserStore } from "../store/useStore";

export default function RenterSignUp() {
  const { login, fetchCurrentUser } = useUserStore();

  const [role, setRole] = useState("renter");
  const [agreed, setAgreed] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreateAccount() {
    if (!agreed) {
      alert("Please agree to the Terms & Conditions and Privacy Policy");
      return;
    }
    if (!email || !password || !firstName || !lastName || !phone) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords are not the same");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          phone,
          role, // Included selected role
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Fallback construct if backend register response lacks nested user fields
        const hydratedData = {
          ...data,
          data: {
            ...data.data,
            user: {
              firstName,
              lastName,
              email,
              phone,
              role,
              ...(data.data?.user || {}),
            },
          },
        };

        login(hydratedData);
        await fetchCurrentUser();
        router.replace("/dashboard");
      } else {
        setError(data.message || "Something Went wrong. Try Again.");
      }
    } catch (err) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeArea>
      {loading && <Loader />}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandRow}>
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

        <View style={{ marginBottom: 24 }}>
          <Text style={styles.headerTitle}>Welcome</Text>
          <Text style={styles.headerSubtitle}>
            Sign up to create your account
          </Text>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.container}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleWrapper}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  {
                    backgroundColor: role === "renter" ? "#0B2554" : "#F0F0F0",
                  },
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
            placeholder="First Name"
            placeholderTextColor="#C4CDDD"
            value={firstName}
            onChangeText={setFirstName}
          />

          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#C4CDDD"
            value={lastName}
            onChangeText={setLastName}
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
                agreed && {
                  backgroundColor: "#E8A325",
                  borderColor: "#E8A325",
                },
              ]}
              onPress={() => setAgreed(!agreed)}
            >
              {agreed && (
                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
              )}
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
      </ScrollView>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 40,
  },
  brandRow: {
    display: "flex",
    flexDirection: "row",
    marginTop: 22,
    gap: 8,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0B2554",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
    textAlign: "center",
  },
  title: {
    marginTop: 4,
  },
  titleDark: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0B2554",
  },
  titleGold: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#E8A325",
  },
  logo: {
    width: 48,
    height: 48,
  },
  container: {
    alignItems: "center",
  },
  toggleRow: {
    flexDirection: "row",
    marginBottom: 24,
    width: 344,
  },
  toggleWrapper: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    padding: 2,
    width: "100%",
  },
  toggleButton: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleText: {
    fontWeight: "600",
    fontSize: 14,
  },
  error: { color: "red", fontSize: 12, textAlign: "center", marginBottom: 12 },
  input: {
    width: 344,
    height: 45,
    backgroundColor: "#FCFDFF",
    borderRadius: 16,
    paddingLeft: 12,
    marginBottom: 14,
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
    justifyContent: "center",
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: "#0B2554",
  },
  termsHighlight: {
    color: "#E8A325",
    fontWeight: "600",
  },
  createButton: {
    width: 335,
    height: 48,
    backgroundColor: "#0B2554",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
  loginRow: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
  },
  loginText: {
    color: "#0B2554",
    fontSize: 13,
  },
  loginHighlight: {
    color: "#E8A325",
    fontWeight: "600",
  },
});
