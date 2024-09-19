import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Input } from "./Input";
import { Checkbox } from "./Checkbox";
import Button from "@/components/button/Button";
import { useThemeColor } from "@/hooks/useThemeColor";
import Colors from "@/constants/Colors";

interface SignupFormProps {
  onSubmit: (mobileNumber: string) => void;
  onToggle: (mode: "login" | "signup" | "otp") => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onSubmit,
  onToggle,
}) => {
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
        <Text>{t("Already have an account?")} </Text>
        <Pressable onPress={() => onToggle("login")}>
          <Text style={[styles.switchAuthButton, { color: primaryTextColor }]}>
            {t("Log in")}
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
