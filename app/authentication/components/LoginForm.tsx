import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Input } from "./Input";
import Button from "@/components/button/Button";
import { useThemeColor } from "@/hooks/useThemeColor";
import Colors from "@/constants/Colors";

interface LoginFormProps {
  onSubmit: (mobileNumber: string, password: string) => Promise<void>;
  onToggle: (mode: "login" | "signup" | "otp") => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onToggle }) => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const primaryTextColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.dark.secondary },
    "primary",
  );

  const handleMobileNumberChange = (text: string) => {
    const formattedNumber = text.replace(/[^0-9]/g, "").slice(0, 10);
    setMobileNumber(formattedNumber);
  };

  const handleSubmit = async () => {
    if (mobileNumber.length !== 10) {
      alert(t("Please enter a valid 10-digit mobile number"));
    } else if (password.length < 3) {
      alert(t("Password must be at least 3 characters long"));
    } else {
      setIsLoading(true);
      try {
        await onSubmit(mobileNumber, password);
      } catch (error) {
        console.error("Login error:", error);
        alert(t("Login failed. Please try again."));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const isFormValid = mobileNumber.length === 10 && password.length >= 3;

  return (
    <>
      <View style={styles.inputsContainer}>
        <Input
          placeholder={t("Mobile Number")}
          iconName="call-outline"
          value={mobileNumber}
          onChangeText={handleMobileNumberChange}
          keyboardType="number-pad"
          editable={!isLoading}
        />
        <Input
          placeholder={t("Password")}
          iconName="lock-closed-outline"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!isLoading}
        />
      </View>
      <Button
        title={isLoading ? t("Logging in...") : t("Log in")}
        variant="primary"
        size="medium"
        style={styles.button}
        onPress={handleSubmit}
        disabled={!isFormValid || isLoading}
      />
      <View style={styles.switchAuthContainer}>
        <Text>{t("Don't have an account?")} </Text>
        <Pressable onPress={() => onToggle("signup")} disabled={isLoading}>
          <Text style={[styles.switchAuthButton, { color: primaryTextColor }]}>
            {t("Sign up")}
          </Text>
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  inputsContainer: {
    width: "100%",
    gap: 15,
    marginBottom: 20,
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
});
