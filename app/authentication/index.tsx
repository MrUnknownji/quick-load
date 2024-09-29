import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Animated,
  ToastAndroid,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "@/firebase/firebase";
import { SignInForm } from "./components/SignInForm";
import { OTPVerification } from "./components/OTPVerification";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { loginUser } from "@/api/userApi";
import Alert from "@/components/popups/Alert";
import * as Clipboard from "expo-clipboard";
import { useUser as useContextUser } from "@/contexts/UserContext";
import { ThemedView } from "@/components/ThemedView";
import { useUser } from "@/hooks/useUser";
import { t } from "i18next";

const Authentication: React.FC = () => {
  const [authMode, setAuthMode] = useState<"signin" | "otp">("signin");
  const [mobileNumber, setMobileNumber] = useState("");
  const [fadeAnim] = useState(new Animated.Value(1));
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [alert, setAlert] = useState<{
    visible: boolean;
    message: string;
    type: "success" | "error" | "warning" | "info";
  }>({
    visible: false,
    message: "",
    type: "info",
  });
  const { setCurrentUser } = useContextUser();
  const { getUser } = useUser();
  const [logoutTimer, setLogoutTimer] = useState<NodeJS.Timeout | null>(null);

  const setupLogoutTimer = () => {
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
    const newTimer = setTimeout(
      () => {
        handleLogout();
      },
      60 * 60 * 1000,
    );
    setLogoutTimer(newTimer);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    await AsyncStorage.removeItem("userId");
    setCurrentUser(null);
    if (logoutTimer) {
      clearTimeout(logoutTimer);
      setLogoutTimer(null);
    }
    router.replace("/authentication");
  };

  useEffect(() => {
    const checkAuthState = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      const userId = await AsyncStorage.getItem("userId");
      if (token && userId) {
        try {
          const userData = await getUser(userId);
          if (userData) {
            setCurrentUser(userData);
            router.replace("/");
            setupLogoutTimer();
          } else {
            throw new Error("User data is null");
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          showAlert(
            "Failed to fetch user data. Please try signing in again.",
            "error",
          );
        }
      } else {
        console.log("User is signed out");
      }
    };
    checkAuthState();

    return () => {
      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }
    };
  }, [getUser, setCurrentUser]);

  const toggleAuthMode = (mode: "signin" | "otp") => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        delay: 150,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      setAuthMode(mode);
    }, 150);
  };

  const showAlert = (
    message: string,
    type: "success" | "error" | "warning" | "info",
  ) => {
    setAlert({ visible: true, message, type });
  };

  const handleSignIn = async (mobile: string) => {
    try {
      const formattedPhone = `+91${mobile}`;
      const confirmation = await auth().signInWithPhoneNumber(formattedPhone);
      setConfirm(confirmation);
      setMobileNumber(mobile);
      toggleAuthMode("otp");
    } catch (error) {
      console.error("Sign in error:", error);
      showAlert("Sign in failed: Please try again.", "error");
    }
  };

  const showToast = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      console.log(message);
    }
  };

  const handleOtpVerify = async (otp: string) => {
    if (!confirm) {
      console.error("No confirmation result");
      showAlert("Verification failed. Please try again.", "error");
      return;
    }

    try {
      const userCredential = await confirm.confirm(otp);

      if (!userCredential || !userCredential.user) {
        throw new Error("Failed to confirm OTP");
      }

      const firebaseToken = await userCredential.user.getIdToken();

      if (!firebaseToken) {
        throw new Error("Failed to get Firebase token");
      }

      const loginResponse = await loginUser(firebaseToken);

      if (
        !loginResponse ||
        !loginResponse.accessToken ||
        !loginResponse.refreshToken ||
        !loginResponse.user
      ) {
        throw new Error("Invalid login response");
      }
      await Clipboard.setStringAsync(loginResponse.accessToken);
      showToast("Access Token copied to clipboard");

      await AsyncStorage.setItem("accessToken", loginResponse.accessToken);
      await AsyncStorage.setItem("refreshToken", loginResponse.refreshToken);
      await AsyncStorage.setItem("userId", loginResponse.user._id);
      setCurrentUser(loginResponse.user);
      showAlert("Sign in successful!", "success");
      setupLogoutTimer();
      if (loginResponse.user.isVerified) {
        router.replace("/");
      } else {
        router.replace(`/profile/my-information`);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes("invalid-verification-code") ||
          error.message.includes("Failed to confirm OTP")
        ) {
          console.error("OTP verification error:", error);
          showAlert("Incorrect OTP. Please check and try again.", "error");
        } else if (
          error.message.includes("Firebase token") ||
          error.message.includes("login response")
        ) {
          console.error("Sign in error:", error);
          showAlert("Sign in failed. Please try again later.", "error");
        } else {
          console.error(
            "Unexpected error during verification or sign in:",
            error,
          );
          showAlert("An unexpected error occurred. Please try again.", "error");
        }
      } else {
        console.error("Unknown error:", error);
        showAlert("An unknown error occurred. Please try again.", "error");
      }
    }
  };

  const handleOtpResend = async () => {
    if (!mobileNumber) {
      console.error("No mobile number");
      return;
    }
    try {
      const confirmation = await auth().signInWithPhoneNumber(
        `+91${mobileNumber}`,
      );
      setConfirm(confirmation);
      showAlert("OTP resent successfully", "success");
    } catch (error) {
      console.error("OTP resend error:", error);
      showAlert("OTP resend failed: " + (error as Error).message, "error");
    }
  };

  const handleBackToSignIn = () => {
    toggleAuthMode("signin");
    setConfirm(null);
  };

  return (
    <ThemedView style={styles.container}>
      <Image source={require("@/assets/images/icon.png")} style={styles.icon} />
      <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}>
        {authMode === "signin" && <SignInForm onSubmit={handleSignIn} />}
        {authMode === "otp" && (
          <OTPVerification
            mobileNumber={mobileNumber}
            onVerify={handleOtpVerify}
            onResend={handleOtpResend}
            onBack={handleBackToSignIn}
          />
        )}
      </Animated.View>
      <Alert
        message={t(alert.message)}
        type={alert.type}
        visible={alert.visible}
        onClose={() => setAlert({ ...alert, visible: false })}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  icon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  formContainer: {
    width: "100%",
  },
});

export default Authentication;
