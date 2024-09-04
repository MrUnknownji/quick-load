import React, { memo } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import IconButton from "../button/IconButton";
import Sizes from "@/constants/Sizes";
import Colors from "@/constants/Colors";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

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
  disabled = true,
}: TextInputFieldProps) => {
  return (
    <View style={styles.container}>
      {iconName && (
        <IconButton
          iconName={iconName}
          iconLibrary={iconType}
          size="small"
          variant="transparent"
          iconStyle={{ color: Colors.light.primary }}
        />
      )}
      <View style={styles.textInputContainer}>
        {label && <Text style={styles.label}>{label}</Text>}
        <TextInput
          placeholder={placeholder}
          style={[
            styles.textInput,
            error ? styles.textInputError : null,
            {
              borderBottomColor: disabled
                ? Colors.light.disabled
                : Colors.light.primary,
            },
          ]}
          value={value}
          onChangeText={onChangeText}
          accessibilityLabel={accessibleLabel || placeholder}
          editable={!disabled}
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
    color: Colors.light.text,
  },
  textInput: {
    fontSize: Sizes.textMedium,
    color: Colors.light.text,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.light.border,
  },
  textInputError: {
    borderBottomColor: Colors.light.error,
  },
  errorText: {
    fontSize: Sizes.textSmall,
    color: Colors.light.error,
    marginTop: Sizes.marginSmall,
  },
});
