import {
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
} from "react-native";
import React from "react";
import Sizes from "@/constants/Sizes";
import Colors from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";

type ButtonProps = {
  title: string;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  variant?: "primary" | "secondary" | "outlined";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
};

const Button = ({
  title,
  onPress,
  style,
  textStyle,
  variant = "primary",
  size = "medium",
  disabled = false,
}: ButtonProps) => {
  const backgroundColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.dark.primary },
    "primary"
  );
  const secondaryColor = useThemeColor(
    { light: Colors.light.secondary, dark: Colors.dark.secondary },
    "secondary"
  );
  const outlinedColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background"
  );
  const textColor =
    variant === "outlined" ? secondaryColor : Colors.light.background;

  const getButtonStyle = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: disabled ? Colors.light.disabled : backgroundColor,
        };
      case "secondary":
        return {
          backgroundColor: disabled ? Colors.light.disabled : secondaryColor,
        };
      case "outlined":
        return {
          backgroundColor: "transparent",
          borderColor: disabled ? Colors.light.disabled : outlinedColor,
          borderWidth: 1,
        };
      default:
        return {};
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case "small":
        return {
          paddingVertical: Sizes.paddingSmall,
          paddingHorizontal: Sizes.paddingSmall,
        };
      case "large":
        return {
          paddingVertical: Sizes.paddingLarge,
          paddingHorizontal: Sizes.paddingLarge,
        };
      default:
        return {
          paddingVertical: Sizes.paddingMedium,
          paddingHorizontal: Sizes.paddingMedium,
        };
    }
  };

  return (
    <Pressable
      style={[
        styles.button,
        getButtonStyle(),
        getSizeStyle(),
        style,
        disabled && styles.disabled,
      ]}
      onPress={disabled ? undefined : onPress}
    >
      <Text style={[styles.buttonText, { color: textColor }, textStyle]}>
        {title}
      </Text>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    borderRadius: Sizes.borderRadiusFull,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Sizes.marginSmall,
  },
  buttonText: {
    fontWeight: "bold",
  },
  disabled: {
    opacity: 0.6,
  },
});
