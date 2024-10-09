import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { responsive } from "@/utils/responsive";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color, padding: responsive(2) },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: responsive(16),
  },
  defaultSemiBold: {
    fontSize: responsive(16),
    fontWeight: "600",
  },
  title: {
    fontSize: responsive(32),
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: responsive(20),
    fontWeight: "bold",
  },
  link: {
    fontSize: responsive(16),
    color: "#0a7ea4",
  },
});
