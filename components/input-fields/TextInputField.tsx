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
import { responsive, vw, vh } from "@/utils/responsive";

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
  subLabel?: string;
  isMandatory?: boolean;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  value?: string;
  error?: string;
  accessibleLabel?: string;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad" | "url";
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
  maxLength?: number;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

const TextInputField = ({
  iconName,
  iconType = "Ionicons",
  label,
  subLabel,
  isMandatory = false,
  placeholder,
  onChangeText,
  value,
  error,
  accessibleLabel,
  disabled = false,
  style,
  keyboardType = "default",
  multiline = false,
  numberOfLines,
  secureTextEntry = false,
  maxLength,
  autoCapitalize,
}: TextInputFieldProps) => {
  const textColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );
  const placeholderColor = useThemeColor(
    { light: Colors.light.textSecondary, dark: Colors.dark.textSecondary },
    "textSecondary",
  );
  const iconColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.dark.secondary },
    "primary",
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
        {label && (
          <View style={styles.labelContainer}>
            <ThemedText style={styles.label}>
              {label}
              {subLabel && (
                <ThemedText style={styles.subLabel}> ({subLabel})</ThemedText>
              )}
              {isMandatory && (
                <ThemedText style={styles.mandatoryIndicator}>*</ThemedText>
              )}
            </ThemedText>
          </View>
        )}
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
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          secureTextEntry={secureTextEntry}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
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
    gap: vw(2),
    paddingVertical: vh(1),
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.light.border,
  },
  textInputContainer: {
    flex: 1,
    justifyContent: "center",
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: responsive(Sizes.textSmall),
  },
  subLabel: {
    fontSize: responsive(Sizes.textSmall),
    color: Colors.light.textSecondary,
  },
  mandatoryIndicator: {
    fontSize: responsive(Sizes.textSmall),
    color: Colors.light.error,
    marginLeft: vw(0.5),
  },
  textInput: {
    fontSize: responsive(Sizes.textMedium),
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.light.border,
  },
  textInputError: {
    borderBottomColor: Colors.light.error,
  },
  errorText: {
    fontSize: responsive(Sizes.textSmall),
    marginTop: vh(1),
    color: Colors.light.error,
  },
});
