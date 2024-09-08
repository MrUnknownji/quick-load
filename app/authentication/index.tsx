import React, { useState, useEffect } from "react";
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
}) => (
  <View style={styles.inputContainer}>
    <Ionicons name={iconName} size={24} color={Colors.light.text} />
    <TextInput
      placeholder={placeholder}
      style={styles.input}
      secureTextEntry={secureTextEntry}
      placeholderTextColor={Colors.light.text}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
    />
  </View>
);

const Checkbox: React.FC<{ checked: boolean; onToggle: () => void }> = ({
  checked,
  onToggle,
}) => {
  const { t } = useTranslation();
  return (
    <Pressable onPress={onToggle} style={styles.checkboxContainer}>
      <Ionicons
        name={checked ? "checkmark-circle" : "ellipse-outline"}
        size={Sizes.icon.small}
        color={checked ? Colors.light.primary : Colors.light.text}
      />
      <Text style={styles.checkboxText}>
        {t("I agree with the Terms and Conditions")}
      </Text>
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
        <Text style={styles.switchAuthText}>
          {t("Don't have an account?")}{" "}
        </Text>
        <Pressable onPress={() => onToggle("signup")}>
          <Text style={styles.switchAuthButton}>{t("Sign up")}</Text>
        </Pressable>
      </View>
    </>
  );
};

type SignupFormProps = {
  onSubmit: (mobileNumber: string, password: string) => void;
  onToggle: (mode: "login" | "signup" | "otp") => void;
};

const SignupForm: React.FC<SignupFormProps> = ({ onSubmit, onToggle }) => {
  const [isAgree, setIsAgree] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useTranslation();

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
        onPress={() => onSubmit(mobileNumber, password)}
      />
      <View style={styles.switchAuthContainer}>
        <Text style={styles.switchAuthText}>
          {t("Already have an account?")}{" "}
        </Text>
        <Pressable onPress={() => onToggle("login")}>
          <Text style={styles.switchAuthButton}>{t("Log in")}</Text>
        </Pressable>
      </View>
    </>
  );
};

type OTPVerificationProps = {
  mobileNumber: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
};

const OTPVerification: React.FC<OTPVerificationProps> = ({
  mobileNumber,
  onVerify,
  onResend,
}) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [timer, setTimer] = useState(60);
  const { t } = useTranslation();

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
  };

  const handleResend = () => {
    onResend();
    setResendDisabled(true);
    setTimer(60);
  };

  return (
    <View style={styles.otpContainer}>
      <Text style={styles.otpTitle}>{t("OTP Verification")}</Text>
      <Text style={styles.otpSubtitle}>
        {t("Enter the verification code we just sent to your number")}{" "}
        {mobileNumber.replace(/(\d{3})(\d{3})(\d{2})/, "+233 ******$3")}.
      </Text>
      <View style={styles.otpInputContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            keyboardType="number-pad"
            maxLength={1}
          />
        ))}
      </View>
      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>{t("Didn't receive code?")} </Text>
        <Pressable onPress={handleResend} disabled={resendDisabled}>
          <Text
            style={[
              styles.resendButtonText,
              resendDisabled && styles.resendButtonTextDisabled,
            ]}
          >
            {resendDisabled ? `${t("Resend in")} ${timer}s` : t("Resend")}
          </Text>
        </Pressable>
      </View>
      <Button
        title={t("Verify")}
        variant="primary"
        size="medium"
        style={styles.button}
        onPress={() => onVerify(otp.join(""))}
      />
    </View>
  );
};

const Authentication: React.FC = () => {
  const [authMode, setAuthMode] = useState<"login" | "signup" | "otp">("login");
  const [mobileNumber, setMobileNumber] = useState("");
  const [fadeAnim] = useState(new Animated.Value(1));

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

  const handleLogin = (mobile: string, password: string) => {
    console.log("Login:", mobile, password);
    router.replace("/");
  };

  const handleSignup = (mobile: string, password: string) => {
    setMobileNumber(mobile);
    toggleAuthMode("otp");
  };

  const handleOtpVerify = (otp: string) => {
    console.log("Verifying OTP:", otp);
    router.push("/");
  };

  const handleOtpResend = () => {
    console.log("Resending OTP");
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
    paddingHorizontal: Sizes.paddingHorizontal,
    backgroundColor: Colors.light.background,
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
    color: Colors.light.text,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkboxText: {
    marginLeft: 8,
    color: Colors.light.text,
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
  switchAuthText: {
    color: Colors.light.text,
  },
  switchAuthButton: {
    color: Colors.light.primary,
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
    color: Colors.light.text,
  },
  otpSubtitle: {
    textAlign: "center",
    marginBottom: 20,
    color: Colors.light.text,
  },
  otpInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
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
    color: Colors.light.text,
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  resendText: {
    color: Colors.light.text,
  },
  resendButtonText: {
    color: Colors.light.primary,
    fontWeight: "bold",
  },
  resendButtonTextDisabled: {
    color: Colors.light.border,
  },
});

export default Authentication;
