import { Camera, CameraView } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ScanAndPay() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting camera permission…</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const onBarcodeScanned = async ({ data }: { data: string }) => {
    try {
      console.log(data);
      // Example QR payload: myapp://checkout?amount=5000&receipt=R123
      //   if (data.startsWith("myapp://")) {
      // QR payload : upi://pay?pa=akshaysharma30121999@okhdfcbank&pn=akshay%20sharma&aid=uGICAgIDVvc_oeg
      const url = new URL(data);
      const amountInPaise = Number(url.searchParams.get("amount") || "0");
      const receipt = url.searchParams.get("receipt") || `rcpt_${Date.now()}`;

      const resp = await fetch("http://192.168.136.46:3000/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountInPaise,
          receipt,
          notes: { from_qr: true },
        }),
      });

      const order = await resp.json();
      console.log(order);

      //   router.push({
      //     pathname: "/CheckoutWeb",
      //     params: { orderId: order.id, amount: amountInPaise },
      //   });
      return;
      //   }

      //   if (data.startsWith("upi://pay?")) {
      // Fallback for arbitrary UPI QR (not verified via Razorpay)
      //     Linking.openURL(data);
      //   }
    } catch (e) {
      console.error("Scan error", e);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"], // only scan QR codes
        }}
        onBarcodeScanned={onBarcodeScanned}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
