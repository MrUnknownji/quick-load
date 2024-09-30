import {
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Text,
  View,
} from "react-native";
import React from "react";
import Sizes from "@/constants/Sizes";
import Colors from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { responsive, vw, vh } from "@/utils/responsive";

type IconLibrary =
  | "Ionicons"
  | "MaterialIcons"
  | "FontAwesome"
  | "MaterialCommunityIcons";

type IconButtonProps = {
  iconName:
    | keyof typeof Ionicons.glyphMap
    | keyof typeof MaterialIcons.glyphMap
    | keyof typeof FontAwesome.glyphMap
    | keyof typeof MaterialCommunityIcons.glyphMap;
  title?: string;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  iconStyle?: TextStyle | TextStyle[];
  variant?: "primary" | "secondary" | "outlined" | "transparent" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  iconLibrary?: IconLibrary;
};

const IconButton = ({
  iconName,
  title,
  onPress,
  style,
  iconStyle,
  variant = "primary",
  size = "medium",
  disabled = false,
  iconLibrary = "Ionicons",
}: IconButtonProps) => {
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
  const transparentColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background",
  );
  const textColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );
  const iconColor =
    variant === "outlined"
      ? secondaryColor
      : variant === "danger"
        ? Colors.light.background
        : Colors.light.background;

  const dangerColor = Colors.light.error;

  const getButtonStyle = () => {
    const baseStyle = {
      elevation: variant !== "transparent" ? 3 : 0,
      shadowColor: variant !== "transparent" ? "#000" : "transparent",
      shadowOffset:
        variant !== "transparent"
          ? { width: 0, height: 2 }
          : { width: 0, height: 0 },
      shadowOpacity: variant !== "transparent" ? 0.1 : 0,
      shadowRadius: variant !== "transparent" ? 4 : 0,
    };

    switch (variant) {
      case "primary":
        return {
          ...baseStyle,
          backgroundColor: disabled ? Colors.light.disabled : backgroundColor,
        };
      case "secondary":
        return {
          ...baseStyle,
          backgroundColor: disabled ? Colors.light.disabled : secondaryColor,
        };
      case "outlined":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          borderColor: disabled ? Colors.light.disabled : outlinedColor,
          borderWidth: 1,
        };
      case "transparent":
        return {
          backgroundColor: "transparent",
          borderColor: disabled ? Colors.light.disabled : transparentColor,
        };
      case "danger":
        return {
          ...baseStyle,
          backgroundColor: disabled ? Colors.light.disabled : dangerColor,
        };
      default:
        return baseStyle;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case "small":
        return {
          padding: vw(2),
          minWidth: vw(8),
          minHeight: vw(8),
        };
      case "large":
        return {
          padding: vw(3),
          minWidth: vw(12),
          minHeight: vw(12),
        };
      default:
        return {
          padding: vw(2.5),
          minWidth: vw(10),
          minHeight: vw(10),
        };
    }
  };

  const renderIcon = () => {
    const IconComponent =
      iconLibrary === "Ionicons"
        ? Ionicons
        : iconLibrary === "MaterialIcons"
          ? MaterialIcons
          : iconLibrary === "FontAwesome"
            ? FontAwesome
            : MaterialCommunityIcons;

    return (
      <View style={styles.iconContainer}>
        <IconComponent
          name={iconName as never}
          size={responsive(Sizes.icon[size])}
          color={variant === "transparent" ? textColor : iconColor}
          style={iconStyle}
        />
        {title && (
          <Text
            style={[
              styles.title,
              { color: variant === "transparent" ? textColor : iconColor },
            ]}
          >
            {title}
          </Text>
        )}
      </View>
    );
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
      {renderIcon()}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.6,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: responsive(Sizes.textMedium),
    marginLeft: vw(2),
  },
});

export default IconButton;
