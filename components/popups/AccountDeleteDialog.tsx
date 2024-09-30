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
import { t } from "i18next";
import { router } from "expo-router";
import { responsive, vw, vh } from "@/utils/responsive";

interface ConfirmDialogProps {
  isVisible: boolean;
  onClose: () => void;
}

const AccountDeleteDialog: React.FC<ConfirmDialogProps> = ({
  isVisible,
  onClose,
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

  const handleYes = () => {
    onClose();
    router.push("/");
  };

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
            {/* Question Text */}
            <Text style={styles.question}>
              {t("Are you sure you want to delete your account?")}
            </Text>

            {/* Yes Button */}
            <TouchableOpacity style={styles.button} onPress={handleYes}>
              <Text style={styles.buttonText}>{t("Yes, Delete Account")}</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* No Button */}
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>{t("No")}</Text>
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
    backgroundColor: "black",
    borderRadius: responsive(Sizes.borderRadiusMedium),
    padding: vw(5),
    width: vw(80),
    maxWidth: vw(80),
    elevation: 10,
  },
  content: {
    alignItems: "center",
  },
  question: {
    fontSize: responsive(18),
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: vh(2),
  },
  button: {
    padding: vh(1),
    borderRadius: responsive(Sizes.borderRadiusMedium),
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: vh(1),
  },
  buttonText: {
    fontSize: responsive(16),
    color: "white",
  },
  divider: {
    height: 1,
    backgroundColor: "white",
    width: "100%",
    marginVertical: vh(1),
  },
});

export default AccountDeleteDialog;
