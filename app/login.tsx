import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Login() {
  const router = useRouter();

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  const onLogin = useCallback(() => {
    if (mobile !== "6666666666") {
      Alert.alert(
        "Invalid Mobile",
        "Please use the pre-filled mobile number 6666666666."
      );
      return;
    }
    if (otp !== "999999") {
      Alert.alert("Invalid OTP", "Please enter OTP 999999.");
      return;
    }
    router.replace("/home"); // 👈 use replace so user can't go back to login
  }, [mobile, otp]);

  return (
    <View style={styles.loginContainer}>
      <Text style={styles.loginTitle}>Welcome</Text>
      <Text style={styles.loginSubtitle}>Login with Mobile & OTP</Text>

      <View style={styles.formField}>
        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
          placeholder="Enter mobile number"
          keyboardType="phone-pad"
          value={mobile}
          onChangeText={setMobile}
          style={styles.input}
          placeholderTextColor="#9ca3af"
          maxLength={10}
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>OTP</Text>
        <TextInput
          placeholder="Enter 999999"
          keyboardType="number-pad"
          value={otp}
          onChangeText={setOtp}
          style={styles.input}
          placeholderTextColor="#9ca3af"
          maxLength={6}
        />
      </View>

      <Pressable
        onPress={onLogin}
        style={styles.primaryBtn}
        android_ripple={{ color: "#e5e7eb" }}
      >
        <Text style={styles.primaryBtnText}>Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    userSelect: "none",
  },
  loginContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 32,
    justifyContent: "center",
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "center",
  },
  loginSubtitle: {
    fontSize: 14,
    color: "#475569",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 24,
  },
  formField: { marginBottom: 16 },
  label: { fontSize: 14, color: "#334155", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#0f172a",
    backgroundColor: "white",
  },
  primaryBtn: {
    backgroundColor: "#0ea5e9",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  primaryBtnText: { color: "white", fontWeight: "700", fontSize: 16 },
});
