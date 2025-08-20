import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function PaymentStatus() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const [status, setStatus] = useState<"pending" | "success" | "failed">(
    "pending"
  );

  useEffect(() => {
    let alive = true;
    const poll = async () => {
      try {
        const res = await fetch(
          `http://192.168.136.46:3000/api/orders/${orderId}/status`
        );
        const { paymentStatus } = await res.json();
        if (!alive) return;
        if (paymentStatus === "captured") setStatus("success");
        else if (paymentStatus === "failed") setStatus("failed");
        else setTimeout(poll, 1500);
      } catch {
        setTimeout(poll, 2000);
      }
    };
    poll();
    return () => {
      alive = false;
    };
  }, [orderId]);

  if (status === "pending") {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 12 }}>Confirming payment…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>
        {status === "success" ? "Payment Successful 🎉" : "Payment Failed"}
      </Text>
    </View>
  );
}
