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
import { SignupForm } from "./components/SignUpForm";
import { LoginForm } from "./components/LoginForm";
import { OTPVerification } from "./components/OTPVerification";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { USERS } from "@/assets/data/DATA";
import { loginUser } from "@/api/userApi";
import Alert from "@/components/popups/Alert";
import * as Clipboard from "expo-clipboard";
import { useUser } from "@/contexts/UserContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import Colors from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";

const Authentication: React.FC = () => {
  const [authMode, setAuthMode] = useState<"login" | "signup" | "otp">("login");
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
  const { setCurrentUser } = useUser();

  useEffect(() => {
    const checkAuthState = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) {
        const randomUser = USERS.find((user) => user.type === "admin") ?? null;
        setCurrentUser(randomUser);
        router.replace("/");
      } else {
        console.log("User is signed out");
      }
    };
    checkAuthState();
  }, []);

  const toggleAuthMode = (mode: "login" | "signup" | "otp") => {
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

  const handleSignup = async (mobile: string) => {
    try {
      const formattedPhone = `+91${mobile}`;
      const confirmation = await auth().signInWithPhoneNumber(formattedPhone);
      setConfirm(confirmation);
      setMobileNumber(mobile);
      toggleAuthMode("otp");
    } catch (error) {
      console.error("Signup error:", error);
      showAlert("Signup failed: Please try again.", "error");
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

      console.log("Firebase Token:", firebaseToken);
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
      setCurrentUser(loginResponse.user);
      console.log("Login Response:", loginResponse);
      showAlert("Login successful!", "success");
      if (loginResponse.user.isVerified) {
        router.replace("/");
      } else {
        router.replace(`/profile/my-information/${loginResponse.user.id}`); // Redirect to my-information page if not verified
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
          console.error("Login error:", error);
          showAlert("Login failed. Please try again later.", "error");
        } else {
          console.error(
            "Unexpected error during verification or login:",
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

  const handleLogin = async (mobile: string, password: string) => {
    try {
      const credentials = [
        {
          mobile: "9999999999",
          password: "123",
          type: "admin",
        },
        {
          mobile: "9876543210",
          password: "123",
          type: "driver",
        },
        {
          mobile: "9876543211",
          password: "123",
          type: "merchant",
        },
        {
          mobile: "9876543212",
          password: "123",
          type: "customer",
        },
      ];

      const matchedCredential = credentials.find(
        (cred) => cred.mobile === mobile && cred.password === password,
      );

      if (matchedCredential) {
        const randomUser = USERS.find(
          (user) => user.type === matchedCredential.type,
        );
        if (randomUser) {
          setCurrentUser({
            ...randomUser,
            isVerified: randomUser.isVerified,
          });
          console.log("Login successful:", randomUser);

          if (randomUser.isVerified) {
            router.replace("/");
          } else {
            router.replace(`/profile/my-information/${randomUser.id}`);
          }
        } else {
          showAlert("User not found", "error");
        }
      } else {
        showAlert("Invalid credentials", "error");
      }
    } catch (error) {
      console.log("Login error:", error);
      showAlert("Login failed: " + (error as Error).message, "error");
    }
  };

  const handleBackToSignup = () => {
    toggleAuthMode("signup");
    setConfirm(null);
  };

  return (
    <ThemedView style={styles.container}>
      <Image source={require("@/assets/images/icon.png")} style={styles.icon} />
      <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}>
        {authMode === "login" && (
          <LoginForm onSubmit={handleLogin} onToggle={toggleAuthMode} />
        )}
        {authMode === "signup" && (
          <SignupForm onSubmit={handleSignup} onToggle={toggleAuthMode} />
        )}
        {authMode === "otp" && (
          <OTPVerification
            mobileNumber={mobileNumber}
            onVerify={handleOtpVerify}
            onResend={handleOtpResend}
            onBack={handleBackToSignup}
          />
        )}
      </Animated.View>
      <Alert
        message={alert.message}
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
