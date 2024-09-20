import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Input } from "./Input";
import Button from "@/components/button/Button";
import { useThemeColor } from "@/hooks/useThemeColor";
import Colors from "@/constants/Colors";

interface LoginFormProps {
  onSubmit: (mobileNumber: string, password: string) => void;
  onToggle: (mode: "login" | "signup" | "otp") => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onToggle }) => {
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
        <Text>{t("Don't have an account?")} </Text>
        <Pressable onPress={() => onToggle("signup")}>
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
