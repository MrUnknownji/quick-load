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
  const iconColor =
    variant === "outlined"
      ? secondaryColor
      : variant === "danger"
        ? Colors.light.background
        : Colors.light.background;

  const dangerColor = Colors.light.error;

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
      case "transparent":
        return {
          backgroundColor: "transparent",
          borderColor: disabled ? Colors.light.disabled : transparentColor,
        };
      case "danger":
        return {
          backgroundColor: disabled ? Colors.light.disabled : dangerColor,
        };
      default:
        return {};
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case "small":
        return {
          padding: Sizes.paddingSmall,
          borderRadius: Sizes.borderRadiusSmall,
        };
      case "large":
        return {
          padding: Sizes.paddingLarge,
          borderRadius: Sizes.borderRadiusLarge,
        };
      default:
        return {
          padding: Sizes.paddingMedium,
          borderRadius: Sizes.borderRadiusFull,
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
      <View
        style={{
          flexDirection: "row",
          gap: Sizes.marginSmall,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconComponent
          name={iconName as never}
          size={Sizes.icon[size]}
          color={iconColor}
          style={iconStyle}
        />
        {title && (
          <Text style={[styles.title, { color: iconColor }]}>{title}</Text>
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

export default IconButton;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.6,
  },
  title: {
    fontSize: Sizes.textMedium,
  },
});
