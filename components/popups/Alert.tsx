import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Modal,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AlertProps {
  message: string;
  type: "success" | "error" | "warning" | "info";
  visible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

const Alert: React.FC<AlertProps> = ({
  message,
  type,
  visible,
  onClose,
  onConfirm,
}) => {
  const backgroundColor = styles[type].backgroundColor;

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity
        style={styles.modalContainer}
        activeOpacity={1}
        onPress={onClose}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={[styles.modalContent, { backgroundColor }]}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.alertContainer}>
              <View style={styles.iconContainer}>
                <Ionicons name={getIconName(type)} size={28} color="#FFFFFF" />
              </View>
              <Text style={styles.message}>{message}</Text>
            </View>
            {onConfirm && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={onClose}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={onConfirm}
                >
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </SafeAreaView>
      </TouchableOpacity>
    </Modal>
  );
};

const getIconName = (type: string) => {
  switch (type) {
    case "success":
      return "checkmark-circle";
    case "error":
      return "alert-circle";
    case "warning":
      return "warning";
    case "info":
      return "information-circle";
    default:
      return "information-circle";
  }
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  safeArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxWidth: 400,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  alertContainer: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  success: {
    backgroundColor: "#4CAF50",
  },
  error: {
    backgroundColor: "#F44336",
  },
  warning: {
    backgroundColor: "#FFC107",
  },
  info: {
    backgroundColor: "#2196F3",
  },
  iconContainer: {
    marginRight: 15,
  },
  message: {
    color: "#FFFFFF",
    fontSize: 16,
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 10,
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  confirmButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default Alert;
