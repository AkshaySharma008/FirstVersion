import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "expo-router";

export default function Index() {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn === null) {
    return null;
  }

  return isLoggedIn ? <Redirect href="/home" /> : <Redirect href="/login" />;
}
