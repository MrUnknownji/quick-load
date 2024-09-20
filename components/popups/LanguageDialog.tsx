import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import Sizes from "@/constants/Sizes";
import Colors from "@/constants/Colors";
import { t } from "i18next";
import { useLanguage } from "@/app/Context/LanguageContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "../ThemedText";

interface LanguageDialogProps {
  isVisible: boolean;
  onClose: () => void;
}

const LanguageDialog: React.FC<LanguageDialogProps> = ({
  isVisible,
  onClose,
}) => {
  const { appLanguage, setAppLanguage, loading } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible, animation]);

  useEffect(() => {
    if (appLanguage) {
      setSelectedLanguage(appLanguage);
    }
  }, [appLanguage]);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setAppLanguage(language);
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
            {/* Header with Close Icon */}
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
                  {t("Select Language")}
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
                selectedLanguage === "hi" && {
                  borderColor: primaryColor,
                  borderWidth: 2,
                },
              ]}
              onPress={() => handleLanguageSelect("hi")}
            >
              <ThemedText
                style={[
                  styles.languageButtonText,
                  selectedLanguage === "hi" && {
                    color: primaryColor,
                    fontWeight: "bold",
                  },
                ]}
              >
                हिन्दी
              </ThemedText>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={[
                styles.languageButton,
                selectedLanguage === "en" && {
                  borderColor: primaryColor,
                  borderWidth: 2,
                },
              ]}
              onPress={() => handleLanguageSelect("en")}
            >
              <ThemedText
                style={[
                  styles.languageButtonText,
                  selectedLanguage === "en" && {
                    color: primaryColor,
                    fontWeight: "bold",
                  },
                ]}
              >
                English
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

export default LanguageDialog;
