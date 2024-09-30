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
import { responsive, vw, vh } from "@/utils/responsive";

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
    "primary",
  );
  const secondaryColor = useThemeColor(
    { light: Colors.light.secondary, dark: Colors.dark.secondary },
    "secondary",
  );
  const outlinedColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background",
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

  const getTextStyle = () => {
    return disabled ? { color: "black" } : {};
  };

  const getSizeStyle = () => {
    switch (size) {
      case "small":
        return {
          paddingVertical: vh(1),
          paddingHorizontal: vw(1),
          minWidth: vw(20),
        };
      case "large":
        return {
          paddingVertical: vh(2),
          paddingHorizontal: vw(6),
          minWidth: vw(40),
        };
      default:
        return {
          paddingVertical: vh(1.6),
          paddingHorizontal: vw(5),
          minWidth: vw(30),
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
      <Text
        style={[
          styles.buttonText,
          { color: textColor },
          textStyle,
          getTextStyle(),
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    marginTop: vh(1),
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: responsive(Sizes.textMedium),
    textAlign: "center",
  },
  disabled: {
    opacity: 0.6,
  },
});
