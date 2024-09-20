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
import Sizes from "@/constants/Sizes";
import Colors from "@/constants/Colors";
import { t } from "i18next";

interface LogoutDialogProps {
  isVisible: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const LogoutDialog: React.FC<LogoutDialogProps> = ({
  isVisible,
  onClose,
  onLogout,
}) => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible, animation]);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

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
        <Animated.View style={[styles.dialog, { transform: [{ translateY }] }]}>
          <View style={styles.content}>
            <Text style={styles.title}>
              {t("Do you really want to log out?")}
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.logoutButton]}
                onPress={onLogout}
              >
                <Text style={[styles.buttonText, styles.logoutButtonText]}>
                  {t("Yes")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={onClose}>
                <Text style={styles.buttonText}>{t("No")}</Text>
              </TouchableOpacity>
            </View>
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
  },
  dialog: {
    backgroundColor: Colors.light.primary,
    borderRadius: Sizes.borderRadiusMedium,
    padding: 20,
    width: "80%",
    maxWidth: 300,
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    paddingBottom: 20,
    textAlign: "center",
    color: Colors.light.background,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    padding: 10,
    borderRadius: Sizes.borderRadiusMedium,
    width: "45%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: "white",
  },
  buttonText: {
    fontSize: 16,
    color: "black",
  },
  logoutButton: {
    backgroundColor: Colors.light.primary,
  },
  logoutButtonText: {
    color: "white",
  },
});

export default LogoutDialog;
