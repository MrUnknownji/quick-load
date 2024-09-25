import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import Button from "@/components/button/Button";
import { useThemeColor } from "@/hooks/useThemeColor";
import Colors from "@/constants/Colors";
import IconButton from "@/components/button/IconButton";

interface OTPVerificationProps {
  mobileNumber: string;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => void;
  onBack: () => void;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({
  mobileNumber,
  onVerify,
  onResend,
  onBack,
}) => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [resendDisabled, setResendDisabled] = useState(true);
  const [timer, setTimer] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const { t } = useTranslation();
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const textColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "primary",
  );
  const secondaryTextColor = useThemeColor(
    { light: Colors.light.border, dark: Colors.dark.border },
    "border",
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

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && index > 0 && !otp[index]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length === 6) {
      setIsVerifying(true);
      try {
        await onVerify(otpString);
      } catch (error) {
        console.error("Verification error:", error);
        alert(t("Verification failed. Please try again."));
      } finally {
        setIsVerifying(false);
      }
    } else {
      alert(t("Please enter a valid 6-digit OTP"));
    }
  };

  const handleResend = () => {
    onResend();
    setResendDisabled(true);
    setTimer(60);
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <View style={styles.otpContainer}>
      <Text style={styles.otpTitle}>{t("OTP Verification")}</Text>
      <Text style={styles.otpSubtitle}>
        {t("Enter the verification code we just sent to your number")}{" "}
        {mobileNumber.replace(/(\d{3})(\d{3})(\d{2})/, "+91 ******$3")}.
      </Text>
      <View style={styles.otpInputContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={[styles.otpInput, { color: textColor }]}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            ref={(el) => (inputRefs.current[index] = el)}
            editable={!isVerifying}
          />
        ))}
      </View>
      <View style={styles.resendContainer}>
        <Text>{t("Didn't receive code?")} </Text>
        <Pressable
          onPress={handleResend}
          disabled={resendDisabled || isVerifying}
        >
          <Text
            style={[
              styles.resendButtonText,
              (resendDisabled || isVerifying) && { color: secondaryTextColor },
            ]}
          >
            {resendDisabled ? `${t("Resend in")} ${timer}s` : t("Resend")}
          </Text>
        </Pressable>
      </View>
      <Button
        title={isVerifying ? t("Verifying...") : t("Verify")}
        variant="primary"
        size="medium"
        style={styles.button}
        onPress={handleVerify}
        disabled={!isOtpComplete || isVerifying}
      />
      <Pressable onPress={onBack}>
        <Text style={styles.wrongNumberText}>{t("Wrong number?")}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    marginBottom: 20,
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
    justifyContent: "center",
    width: "100%",
    marginBottom: 20,
  },
  otpInput: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderRadius: 10,
    textAlign: "center",
    fontSize: 20,
    marginHorizontal: 3,
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  resendButtonText: {
    fontWeight: "bold",
  },
  wrongNumberText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.light.primary,
  },
});
