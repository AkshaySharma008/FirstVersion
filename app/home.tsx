import { useNavigation } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// Static user data
const STATIC_USER = {
  name: "John Doe",
  mobile: "6666666666",
  points: 2000,
};

export default function HomeScreen() {
  const router = useRouter();

  const navigation = useNavigation();
  const [showScanner, setShowScanner] = useState(false);
  const [amountModalVisible, setAmountModalVisible] = useState(false);
  const [amount, setAmount] = useState("");
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const onLogout = useCallback(() => {
    // Navigate back to Login explicitly; avoid goBack for web
    router.replace("/login");
  }, [navigation]);

  const onConfirmPayment = useCallback(() => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      Alert.alert("Invalid amount", "Please enter a valid positive amount.");
      return;
    }
    setAmountModalVisible(false);
    setShowScanner(false);
    setAmount("");
    setScanned(false);
    setTimeout(() => {
      Alert.alert("Payment Successful", `Paid ₹${value.toFixed(2)}`);
    }, 300);
  }, [amount]);

  const requestAndOpenScanner = useCallback(async () => {
    // Ask for permission if not granted
    if (!permission || !permission.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        Alert.alert(
          "Camera permission required",
          "Enable camera access to use Scan & Pay."
        );
        return;
      }
    }
    setShowScanner(true);
    setScanned(false);
  }, [permission, requestPermission]);

  const onSimulateScan = useCallback(() => {
    if (scanned) return;
    setScanned(true);
    // Simulate a short delay then ask for amount
    setTimeout(() => setAmountModalVisible(true), 400);
  }, [scanned]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pointsLabel}>Points Earned</Text>
        <Text style={styles.pointsValue}>{STATIC_USER.points}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Welcome, {STATIC_USER.name}</Text>
        <Text style={styles.subtitle}>Mobile: {STATIC_USER.mobile}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={requestAndOpenScanner}
          style={styles.primaryBtn}
          android_ripple={{ color: "#e5e7eb" }}
        >
          <Text style={styles.primaryBtnText}>Scan & Pay</Text>
        </Pressable>
        <Pressable
          onPress={onLogout}
          style={styles.secondaryBtn}
          android_ripple={{ color: "#e5e7eb" }}
        >
          <Text style={styles.secondaryBtnText}>Logout</Text>
        </Pressable>
      </View>

      {/* Scanner Modal */}
      <Modal
        visible={showScanner}
        animationType="slide"
        onRequestClose={() => setShowScanner(false)}
      >
        <View style={styles.scannerContainer}>
          <View style={styles.scannerHeader}>
            <Text style={styles.scannerTitle}>Scan a QR to Pay</Text>
          </View>
          <View style={styles.cameraWrapper}>
            {/* Using CameraView from expo-camera; no real validation, tap to simulate */}
            {permission?.granted ? (
              <Pressable
                style={styles.cameraPressOverlay}
                onPress={onSimulateScan}
              >
                <CameraView style={StyleSheet.absoluteFill} facing="back" />
                <View style={styles.scanFrame} />
                <Text style={styles.scanHint}>
                  Tap anywhere to simulate scan
                </Text>
              </Pressable>
            ) : (
              <View style={[styles.cameraFallback, styles.center]}>
                <Text style={styles.subtitle}>
                  Camera permission not granted.
                </Text>
              </View>
            )}
          </View>
          <View
            style={[
              styles.actions,
              { paddingHorizontal: 16, paddingBottom: 24 },
            ]}
          >
            <Pressable
              onPress={() => setShowScanner(false)}
              style={styles.secondaryBtn}
              android_ripple={{ color: "#e5e7eb" }}
            >
              <Text style={styles.secondaryBtnText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Amount Modal */}
      <Modal visible={amountModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Enter Amount</Text>
            <TextInput
              placeholder="Amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              style={styles.input}
              placeholderTextColor="#9ca3af"
            />
            <View style={styles.modalActions}>
              <Pressable
                onPress={() => {
                  setAmount("");
                  setAmountModalVisible(false);
                }}
                style={styles.secondaryBtnSmall}
              >
                <Text style={styles.secondaryBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={onConfirmPayment}
                style={styles.primaryBtnSmall}
              >
                <Text style={styles.primaryBtnText}>Pay</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    paddingTop: Platform.select({ ios: 24, android: 16, default: 16 }),
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#0ea5e9",
    marginBottom: 12,
  },
  pointsLabel: { color: "#e0f2fe", fontSize: 14 },
  pointsValue: { color: "white", fontSize: 32, fontWeight: "700" },

  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: -20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: { fontSize: 18, fontWeight: "600", color: "#0f172a" },
  subtitle: { marginTop: 6, fontSize: 14, color: "#475569" },

  actions: { marginTop: 24, gap: 12, paddingHorizontal: 16 },
  primaryBtn: {
    backgroundColor: "#0ea5e9",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryBtnSmall: {
    backgroundColor: "#0ea5e9",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryBtnText: { color: "white", fontWeight: "600", fontSize: 16 },
  secondaryBtn: {
    backgroundColor: "white",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  secondaryBtnSmall: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  secondaryBtnText: { color: "#0f172a", fontWeight: "600", fontSize: 16 },

  scannerContainer: { flex: 1, backgroundColor: "#000" },
  scannerHeader: {
    paddingTop: Platform.select({ ios: 48, android: 24, default: 24 }),
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: "#111827",
  },
  scannerTitle: { color: "white", fontSize: 18, fontWeight: "600" },
  cameraWrapper: { flex: 1, position: "relative" },
  cameraPressOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraFallback: { flex: 1 },
  center: { justifyContent: "center", alignItems: "center" },
  scanFrame: {
    width: 240,
    height: 240,
    borderColor: "rgba(255,255,255,0.9)",
    borderWidth: 2,
    borderRadius: 16,
  },
  scanHint: { position: "absolute", bottom: 40, color: "white", fontSize: 14 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: { fontSize: 16, fontWeight: "600", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#0f172a",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 16,
  },
});
