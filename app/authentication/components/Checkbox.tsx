import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useThemeColor } from "@/hooks/useThemeColor";
import Colors from "@/constants/Colors";
import Sizes from "@/constants/Sizes";
import { ThemedText } from "@/components/ThemedText";

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onToggle }) => {
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

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkboxText: {
    marginLeft: 8,
  },
});
