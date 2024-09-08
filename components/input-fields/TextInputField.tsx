import React, { memo } from "react";
import { StyleSheet, Text, TextInput, View, ViewStyle } from "react-native";
import IconButton from "../button/IconButton";
import Sizes from "@/constants/Sizes";
import Colors from "@/constants/Colors";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "../ThemedText";

interface TextInputFieldProps {
  iconName?:
    | keyof typeof Ionicons.glyphMap
    | keyof typeof MaterialIcons.glyphMap
    | keyof typeof FontAwesome.glyphMap
    | keyof typeof MaterialCommunityIcons.glyphMap;
  iconType?:
    | "Ionicons"
    | "MaterialIcons"
    | "FontAwesome"
    | "MaterialCommunityIcons";
  label?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  value?: string;
  error?: string;
  accessibleLabel?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

const TextInputField = ({
  iconName,
  iconType = "Ionicons",
  label,
  placeholder,
  onChangeText,
  value,
  error,
  accessibleLabel,
  disabled = false,
  style,
}: TextInputFieldProps) => {
  const textColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text"
  );
  const placeholderColor = useThemeColor(
    { light: Colors.light.textSecondary, dark: Colors.dark.textSecondary },
    "textSecondary"
  );
  const iconColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.dark.secondary },
    "primary"
  );
  return (
    <View style={[styles.container, style]}>
      {iconName && (
        <IconButton
          iconName={iconName}
          iconLibrary={iconType}
          size="small"
          variant="transparent"
          iconStyle={{ color: iconColor }}
        />
      )}
      <View style={styles.textInputContainer}>
        {label && <ThemedText style={styles.label}>{label}</ThemedText>}
        <TextInput
          placeholder={placeholder}
          style={[
            styles.textInput,
            error ? styles.textInputError : null,
            {
              borderBottomColor: disabled
                ? Colors.light.disabled
                : Colors.light.primary,
              color: textColor,
            },
          ]}
          value={value}
          onChangeText={onChangeText}
          accessibilityLabel={accessibleLabel || placeholder}
          editable={!disabled}
          placeholderTextColor={placeholderColor}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </View>
  );
};

export default memo(TextInputField);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: Sizes.marginSmall,
    paddingVertical: Sizes.paddingSmall,
    paddingHorizontal: Sizes.paddingMedium,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.light.border,
  },
  textInputContainer: {
    flex: 1,
    justifyContent: "center",
  },
  label: {
    fontSize: Sizes.textSmall,
  },
  textInput: {
    fontSize: Sizes.textMedium,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.light.border,
  },
  textInputError: {
    borderBottomColor: Colors.light.error,
  },
  errorText: {
    fontSize: Sizes.textSmall,
    marginTop: Sizes.marginSmall,
  },
});
