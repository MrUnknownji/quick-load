import React, { useState, useEffect } from "react";
import { StyleSheet, Animated, ToastAndroid, Platform } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "@/firebase/firebase";
import { SignInForm } from "./components/SignInForm";
import { OTPVerification } from "./components/OTPVerification";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import Alert from "@/components/popups/Alert";
import * as Clipboard from "expo-clipboard";
import { ThemedView } from "@/components/ThemedView";
import { useUser } from "@/hooks/useUser";
import { t } from "i18next";
import { responsive } from "@/utils/responsive";

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
  const { getUser, login } = useUser();

  useEffect(() => {
    const checkAuthState = async () => {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const userId = await AsyncStorage.getItem("userId");

      if (accessToken && userId) {
        try {
          const userData = await getUser(userId);
          if (userData) {
            if (userData.firstName && userData.firstName !== "") {
              router.replace("/");
            } else {
              router.replace({
                pathname: "/profile/my-information",
                params: { canLeave: "false" },
              });
            }
          } else {
            throw new Error("User data is null");
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          showAlert("Session expired. Please sign in again.", "error");
          await handleLogout();
        }
      } else {
        console.log("User is signed out");
      }
    };
    checkAuthState();
  }, [getUser]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    await AsyncStorage.removeItem("userId");
    router.replace("/authentication");
  };

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

      const loginResponse = await login(firebaseToken);

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
      showAlert("Sign in successful!", "success");
      if (loginResponse.user.firstName && loginResponse.user.firstName !== "") {
        router.replace("/");
      } else {
        router.replace({
          pathname: "/profile/my-information",
          params: { canLeave: "false" },
        });
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
    paddingHorizontal: responsive(20),
  },
  icon: {
    width: responsive(120),
    height: responsive(120),
    borderRadius: responsive(60),
    marginBottom: responsive(20),
  },
  formContainer: {
    width: "100%",
  },
});

export default Authentication;
