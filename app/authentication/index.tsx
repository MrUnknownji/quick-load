import React, { useState, useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "@/firebase/firebase";
import { SignupForm } from "./components/SignUpForm";
import { LoginForm } from "./components/LoginForm";
import { OTPVerification } from "./components/OTPVerification";
import { Alert } from "react-native";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import Loading from "@/components/Loading";

const Authentication: React.FC = () => {
  const [authMode, setAuthMode] = useState<"login" | "signup" | "otp">("login");
  const [mobileNumber, setMobileNumber] = useState("");
  const [fadeAnim] = useState(new Animated.Value(1));
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAccessToken = async () => {
      const accessToken = await AsyncStorage.getItem("accessToken");
      if (accessToken) {
        await auth().signInWithCustomToken(accessToken);
        Alert.alert("Access Token", accessToken);
        router.push("/");
      }
    };
    checkAccessToken();
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
    setLoading(true);
    try {
      const formattedPhone = `+91${mobile}`;
      const confirmation = await auth().signInWithPhoneNumber(formattedPhone);
      setConfirm(confirmation);
      setMobileNumber(mobile);
      toggleAuthMode("otp");
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (otp: string) => {
    setLoading(true);
    if (!confirm) {
      console.error("No confirmation result");
      return;
    }
    try {
      const userCredential = await confirm.confirm(otp);
      const idToken = await userCredential?.user.getIdToken();
      if (idToken) await AsyncStorage.setItem("accessToken", idToken);
      Alert.alert("Access Token", idToken);
      router.push("/");
    } catch (error) {
      console.error("OTP verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpResend = async () => {
    if (!mobileNumber) {
      console.error("No mobile number");
      return;
    }
    try {
      const confirmation = await auth().signInWithPhoneNumber(
        `+91${mobileNumber}`
      );
      setConfirm(confirmation);
    } catch (error) {
      console.error("OTP resend error:", error);
    }
  };

  const handleLogin = (mobile: string, password: string) => {
    setLoading(true);
    try {
      console.log("Login:", mobile, password);
      router.replace("/");
    } catch (error) {
      console.log("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  else
    return (
      <View style={styles.container}>
        <Image
          source={require("@/assets/images/icon.png")}
          style={styles.icon}
        />
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
