import React from "react";
import { TextInput, TextInputProps, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "large";
};

export function ThemedTextInput({
  style,
  lightColor,
  darkColor,
  type = "default",
  placeholderTextColor,
  ...rest
}: ThemedTextInputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <TextInput
      style={[styles.input, styles[type], { color, backgroundColor }, style]}
      placeholderTextColor={
        placeholderTextColor || useThemeColor({}, "textSecondary")
      }
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  default: {
    fontSize: 16,
    height: 40,
  },
  large: {
    fontSize: 18,
    height: 48,
  },
});
