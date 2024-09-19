import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  Animated,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import Sizes from "@/constants/Sizes";
import Colors from "@/constants/Colors";
import Button from "@/components/button/Button";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { auth } from "@/firebase/firebase";
import { ThemedText } from "@/components/ThemedText";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

type InputProps = {
  placeholder: string;
  iconName: React.ComponentProps<typeof Ionicons>["name"];
  secureTextEntry?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "number-pad";
};

const Input: React.FC<InputProps> = ({
  placeholder,
  iconName,
  secureTextEntry = false,
  value,
  onChangeText,
  keyboardType = "default",
}) => {
  const textColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text"
  );
  const iconColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.dark.secondary },
    "primary"
  );
  const placeholderColor = useThemeColor(
    { light: Colors.light.textSecondary, dark: Colors.dark.textSecondary },
    "textSecondary"
  );
  return (
    <View style={styles.inputContainer}>
      <Ionicons name={iconName} size={24} color={iconColor} />
      <TextInput
        placeholder={placeholder}
        style={[styles.input, { color: textColor }]}
        secureTextEntry={secureTextEntry}
        placeholderTextColor={placeholderColor}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  );
};

const Checkbox: React.FC<{ checked: boolean; onToggle: () => void }> = ({
  checked,
  onToggle,
}) => {
  const { t } = useTranslation();
  const iconColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.dark.secondary },
    "primary"
  );
  const textColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text"
  );
  return (
    <Pressable onPress={onToggle} style={styles.checkboxContainer}>
      <Ionicons
        name={checked ? "checkmark-circle" : "ellipse-outline"}
        size={Sizes.icon.small}
        color={checked ? iconColor : textColor}
      />
      <ThemedText style={styles.checkboxText}>
        {t("I agree with the Terms and Conditions")}
      </ThemedText>
    </Pressable>
  );
};

type LoginFormProps = {
  onSubmit: (mobileNumber: string, password: string) => void;
  onToggle: (mode: "login" | "signup" | "otp") => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onToggle }) => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useTranslation();
  const primaryTextColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.dark.secondary },
    "primary"
  );

  return (
    <>
      <View style={styles.inputsContainer}>
        <Input
          placeholder={t("Mobile Number")}
          iconName="call-outline"
          value={mobileNumber}
          onChangeText={setMobileNumber}
          keyboardType="number-pad"
        />
        <Input
          placeholder={t("Password")}
          iconName="lock-closed-outline"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <Button
        title={t("Log in")}
        variant="primary"
        size="medium"
        style={styles.button}
        onPress={() => onSubmit(mobileNumber, password)}
      />
      <View style={styles.switchAuthContainer}>
        <ThemedText>{t("Don't have an account?")} </ThemedText>
        <Pressable onPress={() => onToggle("signup")}>
          <Text style={[styles.switchAuthButton, { color: primaryTextColor }]}>
            {t("Sign up")}
          </Text>
        </Pressable>
      </View>
    </>
  );
};

type SignupFormProps = {
  onSubmit: (mobileNumber: string) => void;
  onToggle: (mode: "login" | "signup" | "otp") => void;
};

const SignupForm: React.FC<SignupFormProps> = ({ onSubmit, onToggle }) => {
  const [isAgree, setIsAgree] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useTranslation();

  const primaryTextColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.dark.secondary },
    "primary"
  );

  const handleSubmit = () => {
    if (isAgree && mobileNumber) {
      onSubmit(mobileNumber);
    } else {
      alert(t("Please agree to the terms and enter a valid mobile number"));
    }
  };

  return (
    <>
      <View style={styles.inputsContainer}>
        <Input
          placeholder={t("Mobile Number")}
          iconName="call-outline"
          value={mobileNumber}
          onChangeText={setMobileNumber}
          keyboardType="number-pad"
        />
        <Input
          placeholder={t("Password")}
          iconName="lock-closed-outline"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <Checkbox checked={isAgree} onToggle={() => setIsAgree(!isAgree)} />
      <Button
        title={t("Get OTP")}
        variant="primary"
        size="medium"
        style={styles.button}
        onPress={handleSubmit}
      />
      <View style={styles.switchAuthContainer}>
        <ThemedText>{t("Already have an account?")} </ThemedText>
        <Pressable onPress={() => onToggle("login")}>
          <Text style={[styles.switchAuthButton, { color: primaryTextColor }]}>
            {t("Log in")}
          </Text>
        </Pressable>
      </View>
    </>
  );
};

const OTPVerification: React.FC<{
  mobileNumber: string;
  verificationId: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
}> = ({ mobileNumber, verificationId, onVerify, onResend }) => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [resendDisabled, setResendDisabled] = useState(true);
  const [timer, setTimer] = useState(60);
  const { t } = useTranslation();
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const textColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "primary"
  );
  const secondaryTextColor = useThemeColor(
    { light: Colors.light.border, dark: Colors.dark.border },
    "border"
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      } else {
        setResendDisabled(false);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value.length === 1 && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpString = otp.join("");
    if (otpString.length === 6) {
      onVerify(otpString);
    } else {
      alert(t("Please enter a valid 6-digit OTP"));
    }
  };

  const handleResend = () => {
    onResend();
    setResendDisabled(true);
    setTimer(60);
  };

  return (
    <View style={styles.otpContainer}>
      <ThemedText style={styles.otpTitle}>{t("OTP Verification")}</ThemedText>
      <ThemedText style={styles.otpSubtitle}>
        {t("Enter the verification code we just sent to your number")}{" "}
        {mobileNumber.replace(/(\d{3})(\d{3})(\d{2})/, "+91 ******$3")}.
      </ThemedText>
      <View style={styles.otpInputContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={[styles.otpInput, { color: textColor }]}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            keyboardType="number-pad"
            maxLength={1}
            ref={(el) => (inputRefs.current[index] = el)}
          />
        ))}
      </View>
      <View style={styles.resendContainer}>
        <ThemedText>{t("Didn't receive code?")} </ThemedText>
        <Pressable onPress={handleResend} disabled={resendDisabled}>
          <ThemedText
            style={[
              styles.resendButtonText,
              resendDisabled && { color: secondaryTextColor },
            ]}
          >
            {resendDisabled ? `${t("Resend in")} ${timer}s` : t("Resend")}
          </ThemedText>
        </Pressable>
      </View>
      <Button
        title={t("Verify")}
        variant="primary"
        size="medium"
        style={styles.button}
        onPress={handleVerify}
      />
    </View>
  );
};

const Authentication: React.FC = () => {
  const [authMode, setAuthMode] = useState<"login" | "signup" | "otp">("login");
  const [mobileNumber, setMobileNumber] = useState("");
  const [fadeAnim] = useState(new Animated.Value(1));
  const [verificationId, setVerificationId] = useState("");

  useEffect(() => {
    const accessToken = async () => {
      const accessToken = await AsyncStorage.getItem("accessToken");
      if (accessToken) {
        auth().signInWithCustomToken(accessToken);
        Alert.alert("Access Token", accessToken);
        router.push("/");
      }
    };
    accessToken();
  }, []);
  const formatPhoneNumber = (phone: string) => {
    const countryCode = "+91";
    return `${countryCode}${phone}`;
  };

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
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  const handleSignup = async (mobile: string) => {
    try {
      const formattedPhone = formatPhoneNumber(mobile);
      console.log(formattedPhone);
      const confirmation = await auth().signInWithPhoneNumber(formattedPhone);
      setConfirm(confirmation);
      setMobileNumber(mobile);
      toggleAuthMode("otp");
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  const handleOtpVerify = async (otp: string) => {
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
    }
  };

  const handleOtpResend = async () => {
    if (!mobileNumber) {
      console.error("No mobile number");
      return;
    }
    try {
      const confirmation = await auth().signInWithPhoneNumber(mobileNumber);
      setConfirm(confirmation);
    } catch (error) {
      console.error("OTP resend error:", error);
    }
  };
  const handleLogin = (mobile: string, password: string) => {
    console.log("Login:", mobile, password);
    router.replace("/");
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
            verificationId={verificationId}
            onVerify={handleOtpVerify}
            onResend={handleOtpResend}
          />
        )}
      </Animated.View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Sizes.paddingHorizontal,
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
  inputsContainer: {
    width: "100%",
    gap: 15,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkboxText: {
    marginLeft: 8,
  },
  button: {
    width: "100%",
    marginBottom: 20,
  },
  switchAuthContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  switchAuthButton: {
    fontWeight: "bold",
  },
  otpContainer: {
    alignItems: "center",
    width: "100%",
  },
  otpTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  otpSubtitle: {
    textAlign: "center",
    marginBottom: 20,
  },
  otpInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "auto",
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 10,
    textAlign: "center",
    fontSize: 24,
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  resendButtonText: {
    fontWeight: "bold",
  },
});

export default Authentication;
