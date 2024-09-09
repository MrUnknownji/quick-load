import { useTheme } from "@/app/Context/AppThemeProvider";
import { Colors } from "@/constants/Colors";
import { Appearance } from "react-native";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const { appTheme } = useTheme();

  let currentTheme = appTheme;

  if (appTheme === "system") {
    const systemTheme = Appearance.getColorScheme();
    currentTheme = systemTheme ?? "light";
  }

  const colorFromProps = props[currentTheme as "light" | "dark"];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[currentTheme as "light" | "dark"][colorName];
  }
}
