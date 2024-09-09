import {
  Animated,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "@/constants/Colors";
import Sizes from "@/constants/Sizes";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "../ThemedText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useThemeColor } from "@/hooks/useThemeColor";
import { t } from "i18next";
import { useTheme } from "@/app/Context/AppThemeProvider";

interface ThemeChangerDialogProps {
  isVisible: boolean;
  onClose: () => void;
}

const THEME_STORAGE_KEY = "appTheme";

const ThemeChangerDialog = ({
  isVisible,
  onClose,
}: ThemeChangerDialogProps) => {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [animation] = useState(new Animated.Value(0));
  const { setAppTheme } = useTheme();

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible, animation]);

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      setSelectedTheme(storedTheme);
      if (storedTheme !== null) {
        setAppTheme(storedTheme as string);
      }
    };
    loadTheme();
  }, []);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  const handleThemeSelect = (theme: string) => {
    setSelectedTheme(theme);
    AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
    setAppTheme(theme);
  };

  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background"
  );

  const iconColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.dark.secondary },
    "primary"
  );
  const primaryColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.dark.secondary },
    "primary"
  );

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="none"
      statusBarTranslucent
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <BlurView
          style={StyleSheet.absoluteFill}
          intensity={30}
          experimentalBlurMethod="dimezisBlurView"
        />
        <Animated.View
          style={[
            styles.dialog,
            { transform: [{ translateY }], backgroundColor },
          ]}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 25,
                }}
              >
                <Ionicons name="language" size={24} color={iconColor} />
                <ThemedText style={styles.title}>
                  {t("Select Theme")}
                </ThemedText>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={20} color={iconColor} />
              </TouchableOpacity>
            </View>

            {/* Language Options */}
            <TouchableOpacity
              style={[
                styles.languageButton,
                selectedTheme === "light" && {
                  borderColor: primaryColor,
                  borderWidth: 2,
                },
              ]}
              onPress={() => handleThemeSelect("light")}
            >
              <ThemedText
                style={[
                  styles.languageButtonText,
                  selectedTheme === "light" && {
                    color: primaryColor,
                    fontWeight: "bold",
                  },
                ]}
              >
                {t("Light")}
              </ThemedText>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={[
                styles.languageButton,
                selectedTheme === "dark" && {
                  borderColor: primaryColor,
                  borderWidth: 2,
                },
              ]}
              onPress={() => handleThemeSelect("dark")}
            >
              <ThemedText
                style={[
                  styles.languageButtonText,
                  selectedTheme === "dark" && {
                    color: primaryColor,
                    fontWeight: "bold",
                  },
                ]}
              >
                {t("Dark")}
              </ThemedText>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={[
                styles.languageButton,
                selectedTheme === "system" && {
                  borderColor: primaryColor,
                  borderWidth: 2,
                },
              ]}
              onPress={() => handleThemeSelect("system")}
            >
              <ThemedText
                style={[
                  styles.languageButtonText,
                  selectedTheme === "system" && {
                    color: primaryColor,
                    fontWeight: "bold",
                  },
                ]}
              >
                {t("System Default")}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dialog: {
    borderRadius: Sizes.borderRadiusMedium,
    padding: 20,
    width: "80%",
    maxWidth: 300,
    elevation: 10,
  },
  content: {
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  closeButton: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  languageButton: {
    padding: 10,
    borderRadius: Sizes.borderRadiusMedium,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderColor: Colors.light.border,
  },
  languageButtonText: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    width: "100%",
    marginVertical: 10,
  },
});

export default ThemeChangerDialog;
