import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Input } from "./Input";
import { Checkbox } from "./Checkbox";
import Button from "@/components/button/Button";
import { useThemeColor } from "@/hooks/useThemeColor";
import Colors from "@/constants/Colors";
import { responsive } from "@/utils/responsive";

interface SignupFormProps {
  onSubmit: (mobileNumber: string) => Promise<void>;
}

export const SignInForm: React.FC<SignupFormProps> = ({ onSubmit }) => {
  const [isAgree, setIsAgree] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
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
    if (isAgree && mobileNumber.length === 10) {
      setIsLoading(true);
      try {
        await onSubmit(mobileNumber);
      } catch (error) {
        console.error("Signup error:", error);
        alert(t("Signup failed. Please try again."));
      } finally {
        setIsLoading(false);
      }
    } else if (!isAgree) {
      alert(t("Please agree to the terms"));
    } else if (mobileNumber.length !== 10) {
      alert(t("Please enter a valid 10-digit mobile number"));
    }
  };

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
      </View>
      <Checkbox
        checked={isAgree}
        onToggle={() => setIsAgree(!isAgree)}
        disabled={isLoading}
      />
      <Button
        title={isLoading ? t("Sending OTP...") : t("Get OTP")}
        variant="primary"
        size="medium"
        style={styles.button}
        onPress={handleSubmit}
        disabled={mobileNumber.length !== 10 || !isAgree || isLoading}
      />
    </>
  );
};

const styles = StyleSheet.create({
  inputsContainer: {
    width: "100%",
    gap: responsive(15),
    marginBottom: responsive(20),
  },
  button: {
    width: "100%",
    marginBottom: responsive(20),
  },
});
