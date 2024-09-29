import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import Colors from "@/constants/Colors";
import Sizes from "@/constants/Sizes";
import { t } from "i18next";

interface EditDeleteDialogProps {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const EditDeleteDialog: React.FC<EditDeleteDialogProps> = ({
  visible,
  onClose,
  onEdit,
  onDelete,
}) => {
  const backgroundColor = useThemeColor(
    {
      light: Colors.light.backgroundSecondary,
      dark: Colors.dark.backgroundSecondary,
    },
    "background",
  );

  const textColor = useThemeColor(
    {
      light: Colors.light.text,
      dark: Colors.dark.text,
    },
    "text",
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={[styles.menuOptions, { backgroundColor }]}>
          <TouchableOpacity style={styles.menuOption} onPress={onEdit}>
            <Ionicons name="create-outline" size={24} color={textColor} />
            <ThemedText style={styles.menuOptionText}>{t("Edit")}</ThemedText>
          </TouchableOpacity>
          <View style={styles.menuSeparator} />
          <TouchableOpacity style={styles.menuOption} onPress={onDelete}>
            <Ionicons
              name="trash-outline"
              size={24}
              color={Colors.light.tint}
            />
            <ThemedText
              style={[styles.menuOptionText, { color: Colors.light.tint }]}
            >
              {t("Delete")}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuOptions: {
    borderRadius: Sizes.borderRadiusLarge,
    width: 250,
    padding: Sizes.paddingMedium,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Sizes.paddingMedium,
  },
  menuOptionText: {
    marginLeft: Sizes.paddingMedium,
    fontSize: Sizes.textMedium,
    fontWeight: "500",
  },
  menuSeparator: {
    height: 1,
    backgroundColor: Colors.light.textSecondary,
    opacity: 0.2,
    marginVertical: Sizes.paddingSmall,
  },
});

export default EditDeleteDialog;
