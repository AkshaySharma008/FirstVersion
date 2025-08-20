import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

type TBuildHtml = {
  keyId: string;
  amount: number;
  orderId: string;
  appDeeplink: string;
};

const buildHtml = ({ keyId, amount, orderId, appDeeplink }: TBuildHtml) => `
<!DOCTYPE html>
<html>
  <head><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
  <body>
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    <script>
      (function() {
        var options = {
          key: '${keyId}',
          amount: ${amount},
          currency: 'INR',
          name: 'Your Brand',
          description: 'Scan & Pay',
          order_id: '${orderId}',
          method: { upi: true, card: false, netbanking: false, wallet: false },
          webview_intent: true,
          redirect: true,
          callback_url: 'https://your-backend.example.com/checkout/redirect?order_id=${orderId}&redirect_to=${encodeURIComponent(
  appDeeplink
)}',
          theme: { color: '#3399cc' }
        };
        var rzp1 = new Razorpay(options);
        rzp1.open();
      })();
    </script>
  </body>
</html>
`;

export default function CheckoutWeb() {
  const { orderId, amount } = useLocalSearchParams<{
    orderId: string;
    amount: string;
  }>();
  const router = useRouter();
  const ref = useRef<WebView>(null);

  const appDeeplink = `myapp://payment-result?order_id=${orderId}`;
  const html = buildHtml({
    keyId: "rzp_test_R5gSh8UNpQetMd",
    amount: Number(amount),
    orderId,
    appDeeplink,
  });

  const onNavChange = (nav: any) => {
    // if (nav.url.startsWith("myapp://")) {
    // Replace stack with PaymentStatus screen
    router.replace(`/PaymentStatus?orderId=${orderId}`);
    // }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={ref}
        originWhitelist={["*"]}
        onNavigationStateChange={onNavChange}
        source={{ html }}
      />
    </View>
  );
}
