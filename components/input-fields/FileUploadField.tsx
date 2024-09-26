import React, { memo } from "react";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import Sizes from "@/constants/Sizes";
import Colors from "@/constants/Colors";
import { t } from "i18next";
import { ThemedText } from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

interface FileUploadFieldProps {
  iconName?:
    | keyof typeof Ionicons.glyphMap
    | keyof typeof MaterialIcons.glyphMap
    | keyof typeof FontAwesome.glyphMap
    | keyof typeof MaterialCommunityIcons.glyphMap;
  iconType?:
    | "Ionicons"
    | "MaterialIcons"
    | "FontAwesome"
    | "MaterialCommunityIcons";
  label?: string;
  placeholder?: string;
  onFileSelect?: (file: DocumentPicker.DocumentPickerResult) => void;
  selectedFile?: string;
  accessibleLabel?: string;
  disabled?: boolean;
  style?: ViewStyle;
  allowedExtensions?: string[] | null;
}

const FileUploadField = ({
  iconName = "attach",
  iconType = "Ionicons",
  label,
  placeholder = t("Select a file"),
  onFileSelect,
  selectedFile,
  accessibleLabel,
  disabled = false,
  style,
  allowedExtensions = null,
}: FileUploadFieldProps) => {
  const IconComponent = {
    Ionicons,
    MaterialIcons,
    FontAwesome,
    MaterialCommunityIcons,
  }[iconType];

  const handleFileUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });

    if (result.canceled === false && onFileSelect) {
      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];

        if (allowedExtensions) {
          const fileExtension = file.name.split(".").pop()?.toLowerCase();
          if (fileExtension && allowedExtensions.includes(fileExtension)) {
            onFileSelect(result);
          } else {
            alert(
              `Please select a file with one of the following extensions: ${allowedExtensions.join(", ")}`,
            );
          }
        } else {
          onFileSelect(result);
        }
      }
    }
  };

  const iconColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.light.secondary },
    "primary",
  );

  return (
    <View style={[styles.container, style]}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}
      <TouchableOpacity
        style={[
          styles.uploadBox,
          {
            borderColor: disabled
              ? Colors.light.disabled
              : Colors.light.primary,
          },
          selectedFile ? null : styles.uploadBoxError,
        ]}
        onPress={handleFileUpload}
        accessibilityLabel={accessibleLabel || placeholder}
        disabled={disabled}
      >
        {iconName && (
          <IconComponent
            name={iconName as never}
            size={Sizes.icon["small"]}
            color={iconColor}
            style={styles.icon}
          />
        )}
        <ThemedText style={styles.placeholderText}>
          {selectedFile || placeholder}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
};

export default memo(FileUploadField);

const styles = StyleSheet.create({
  container: {
    paddingVertical: Sizes.paddingSmall,
    paddingHorizontal: Sizes.paddingMedium,
  },
  label: {
    fontSize: Sizes.textSmall,
    marginBottom: Sizes.marginSmall,
  },
  uploadBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Sizes.paddingSmall,
    paddingHorizontal: Sizes.paddingMedium,
    borderWidth: 0.5,
    borderColor: Colors.light.border,
    borderRadius: Sizes.borderRadiusSmall,
  },
  uploadBoxError: {
    borderColor: Colors.light.error,
  },
  placeholderText: {
    flex: 1,
    fontSize: Sizes.textMedium,
    marginLeft: Sizes.marginSmall,
  },
  icon: {
    marginRight: Sizes.marginSmall,
  },
});
