import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useThemeColor } from "@/hooks/useThemeColor";
import Colors from "@/constants/Colors";
import Sizes from "@/constants/Sizes";
import { ThemedText } from "@/components/ThemedText";
import { responsive } from "@/utils/responsive";

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onToggle,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const iconColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.dark.secondary },
    "primary",
  );
  const textColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );
  const disabledColor = useThemeColor(
    { light: Colors.light.textSecondary, dark: Colors.dark.textSecondary },
    "textSecondary",
  );

  return (
    <Pressable
      onPress={onToggle}
      style={[styles.checkboxContainer, disabled && styles.disabled]}
      disabled={disabled}
    >
      <Ionicons
        name={checked ? "checkmark-circle" : "ellipse-outline"}
        size={responsive(Sizes.icon.small)}
        color={disabled ? disabledColor : checked ? iconColor : textColor}
      />
      <ThemedText
        style={[styles.checkboxText, disabled && styles.disabledText]}
      >
        {t("I agree with the Terms and Conditions")}
      </ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: responsive(20),
  },
  checkboxText: {
    marginLeft: responsive(8),
    fontSize: responsive(14),
  },
  disabled: {
    opacity: 0.6,
  },
  disabledText: {
    color: Colors.light.textSecondary,
  },
});
