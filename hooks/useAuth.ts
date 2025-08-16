import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const value = await AsyncStorage.getItem("isLoggedIn");
      setIsLoggedIn(value === "true");
    };
    checkAuth();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  return { isLoggedIn, logout };
}
