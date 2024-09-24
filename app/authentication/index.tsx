import React, { useState, useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";
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

const Authentication: React.FC = () => {
  const [authMode, setAuthMode] = useState<"login" | "signup" | "otp">("login");
  const [mobileNumber, setMobileNumber] = useState("");
  const [fadeAnim] = useState(new Animated.Value(1));
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  useEffect(() => {
    const checkAuthState = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) {
        console.log("User is signed in");
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

  const handleSignup = async (mobile: string) => {
    try {
      const formattedPhone = `+91${mobile}`;
      const confirmation = await auth().signInWithPhoneNumber(formattedPhone);
      setConfirm(confirmation);
      setMobileNumber(mobile);
      toggleAuthMode("otp");
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup failed: " + (error as Error).message);
    }
  };

  const handleOtpVerify = async (otp: string) => {
    if (!confirm) {
      console.error("No confirmation result");
      throw new Error("Verification failed. Please try again.");
    }
    try {
      const userCredential = await confirm.confirm(otp);
      const firebaseToken = await userCredential?.user.getIdToken();
      console.log("Firebase token:", firebaseToken);
      if (firebaseToken) {
        let loginResponse;
        try {
          loginResponse = await loginUser(firebaseToken);
          console.log(loginResponse);
        } catch (error) {
          console.log(error);
          throw new Error("Login failed after verification");
        }
        await AsyncStorage.setItem("accessToken", loginResponse.accessToken);
        await AsyncStorage.setItem("refreshToken", loginResponse.refreshToken);
        await AsyncStorage.setItem(
          "currentUser",
          JSON.stringify(loginResponse.user),
        );
        console.log("Login successful:", loginResponse.user);
        router.replace("/");
      } else {
        throw new Error("Failed to get Firebase token");
      }
    } catch (error) {
      console.error("OTP verification or login error:", error);
      throw error;
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
    } catch (error) {
      console.error("OTP resend error:", error);
      alert("OTP resend failed: " + (error as Error).message);
    }
  };

  const handleLogin = async (mobile: string, password: string) => {
    try {
      const credentials = [
        { mobile: "9999999999", password: "123", type: "admin" },
        { mobile: "9876543210", password: "123", type: "driver" },
        { mobile: "9876543211", password: "123", type: "merchant" },
        { mobile: "9876543212", password: "123", type: "customer" },
      ];

      const matchedCredential = credentials.find(
        (cred) => cred.mobile === mobile && cred.password === password,
      );

      if (matchedCredential) {
        const randomUser = USERS.find(
          (user) => user.type === matchedCredential.type,
        );
        if (randomUser) {
          await AsyncStorage.setItem("accessToken", "dummy-token");
          await AsyncStorage.setItem("currentUser", JSON.stringify(randomUser));
          console.log("Login successful:", randomUser);
          router.replace("/");
        } else {
          throw new Error("User not found");
        }
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.log("Login error:", error);
      alert("Login failed: " + (error as Error).message);
    }
  };

  return (
    <View style={styles.container}>
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
          />
        )}
      </Animated.View>
    </View>
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
