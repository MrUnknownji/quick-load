import React from "react";
import { StyleSheet, View, ViewStyle, Platform, StatusBar } from "react-native";
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
  edges = ["right", "bottom", "left"],
  bgColor,
  style,
}) => {
  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background",
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: bgColor ?? backgroundColor },
        style,
      ]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView style={styles.safeArea} edges={edges}>
        {children}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  safeArea: {
    flex: 1,
  },
});

export default SafeAreaWrapper;
