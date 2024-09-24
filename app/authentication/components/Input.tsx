import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import Colors from "@/constants/Colors";

interface InputProps {
  placeholder: string;
  iconName: React.ComponentProps<typeof Ionicons>["name"];
  secureTextEntry?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "number-pad";
  editable?: boolean;
}

export const Input: React.FC<InputProps> = ({
  placeholder,
  iconName,
  secureTextEntry = false,
  value,
  onChangeText,
  keyboardType = "default",
  editable = true,
}) => {
  const textColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );
  const iconColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.dark.secondary },
    "primary",
  );
  const placeholderColor = useThemeColor(
    { light: Colors.light.textSecondary, dark: Colors.dark.textSecondary },
    "textSecondary",
  );
  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background",
  );

  return (
    <View
      style={[
        styles.inputContainer,
        !editable && { backgroundColor: backgroundColor, opacity: 0.6 },
      ]}
    >
      <Ionicons
        name={iconName}
        size={24}
        color={editable ? iconColor : placeholderColor}
      />
      <TextInput
        placeholder={placeholder}
        style={[
          styles.input,
          { color: editable ? textColor : placeholderColor },
        ]}
        secureTextEntry={secureTextEntry}
        placeholderTextColor={placeholderColor}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        editable={editable}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
});
