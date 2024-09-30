import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import Colors from "@/constants/Colors";

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  edges?: ("top" | "right" | "bottom" | "left")[];
  bgColor?: string;
  style?: ViewStyle;
}

const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({
  children,
  edges = ["top"],
  bgColor,
  style,
}) => {
  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background",
  );

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: bgColor ?? backgroundColor },
        style,
      ]}
      edges={edges}
    >
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});

export default SafeAreaWrapper;
