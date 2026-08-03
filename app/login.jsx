import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomButton from "../components/common/buttonComponent";
import InputBar from "../components/common/inputComponent";
import SaveArea from "../components/common/safeArea";
import { BASE_URL } from "../config/api";

export default function LoginScreen() {
  const router = useRouter();
  const [userRole, setUserRole] = useState("renter"); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [Loading , setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      console.log("Login success:", data);
      if (userRole === "owner") {
        router.push("/pages/ownerProfile");
      } else {
        router.push("/pages/renterProfile");
      }
    } catch (err) {
      console.log("Login error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SaveArea>
      <View style={styles.container}>
        <View style={styles.header}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: 22,
              gap: 8,
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

          <Text style={styles.headerTitle}>Welcome back</Text>
          <Text style={styles.headerSubtitle}>
            Login to continue to your account
          </Text>
        </View>

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              userRole === "renter" && styles.toggleActive,
            ]}
            onPress={() => setUserRole("renter")}
          >
            <Text
              style={[
                styles.toggleText,
                userRole === "renter" && styles.toggleActiveText,
              ]}
            >
              I’m a Renter
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleButton,
              userRole === "owner" && styles.toggleActive,
            ]}
            onPress={() => setUserRole("owner")}
          >
            <Text
              style={[
                styles.toggleText,
                userRole === "owner" && styles.toggleActiveText,
              ]}
            >
              I’m an Owner
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.descripion}>
          <Text style={styles.descriptionText}>
            Logging in as a <Text style={styles.descriptionTextBold}>{userRole}</Text> - browse and book equipments
          </Text>
        </View>

        <View style={styles.form}>
          <InputBar
            placeholder="Email address"
            autoCapitalize="none"
            onChangeText={setEmail}
            keyboardType="email-address"
            value={email}
          />

          <InputBar
            placeholder="Password"
            secureTextEntry={false}
            onChangeText={setPassword}
            value={password}
          />
          {error ? <Text style={styles.error}>Invalid Credentials</Text> : null}

          <TouchableOpacity style={styles.forgotPass}>
            <Text style={styles.forgotPassText}>Forgot password?</Text>
          </TouchableOpacity>

          <CustomButton name="Login" onPress={handleLogin} disabled={Loading} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          
          <TouchableOpacity onPress={() => router.push("/RenterSignUp")}>
            <Text style={styles.footerLink}>Sign up</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => router.push("/pages/wallet")}>
            <Text style={styles.footerLink}>wallet</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </SaveArea>
  );
}

const styles = StyleSheet.create({
  descripion: {
    width: 300,
    marginBottom: 80,
    marginLeft: 12,
  },
  descriptionText: {
    fontFamily: "pRegular",
    fontSize: 12,
    color: "#0B2554",
    lineHeight: 18,
  },
  descriptionTextBold: {
    fontFamily: "pBold",
  },
  title: {
    marginTop: 4,
  },
  titleDark: {
    fontFamily: "pBold",
    fontSize: 28,
    color: "#0B2554",
  },
  titleGold: {
    fontFamily: "pBold",
    fontSize: 28,
    color: "#E8A325",
  },
  container: {
    flex: 1,
    justify: "center",
    width: "100%",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    width: 48,
    height: 48,
    marginBottom: 12,
  },
  headerTitle: {
    fontFamily: "pBold",
    fontSize: 24,
    color: "#0B2554",
    marginTop: 12,
  },
  headerSubtitle: {
    fontFamily: "pRegular",
    fontSize: 13,
    color: "#475569",
    marginTop: 4,
    textAlign: "center",
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#E2E8F0",
    borderRadius: 32,
    padding: 4,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 28,
  },
  toggleActive: {
    backgroundColor: "#0B2554",
  },
  toggleText: {
    fontFamily: "pSemiBold",
    fontSize: 14,
    color: "#0B2554",
  },
  toggleActiveText: {
    color: "#FFFFFF",
  },
  form: {
    gap: 20,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 14,
    color: "#0A192F",
    fontFamily: "pRegular",
  },
  error: {
    fontFamily: "pRegular",
    color: "red",
    marginBottom: 10,
    fontSize: 14,
  },
  forgotPass: {
    alignSelf: "flex-start",
  },
  forgotPassText: {
    fontFamily: "pSemiBold",
    fontSize: 12,
    color: "#E8A325",
  },
  submitBtn: {
    backgroundColor: "#0A192F",
    height: 48,
    borderRadius: 8,
    justify: "center",
    alignItems: "center",
    marginTop: 8,
  },
  submitBtnText: {
    fontFamily: "pSemiBold",
    color: "#FFFFFF",
    fontSize: 15,
  },
  footer: {
    flexDirection: "row",
    justify: "center",
    marginTop: 24,
  },
  footerText: {
    fontFamily: "pRegular",
    fontSize: 13,
    color: "#64748B",
  },
  footerLink: {
    fontFamily: "pBold",
    fontSize: 13,
    color: "#E8A325",
  },
});