import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
}

const FileUploadField = ({
  iconName = "attach",
  iconType = "Ionicons",
  label,
  placeholder = t("Select a file"),
  onFileSelect,
  selectedFile,
  accessibleLabel,
  disabled = true,
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
      onFileSelect(result);
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
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
            color={Colors.light.primary}
            style={styles.icon}
          />
        )}
        <Text style={styles.placeholderText}>
          {selectedFile || placeholder}
        </Text>
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
    color: Colors.light.text,
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
    color: Colors.light.text,
    marginLeft: Sizes.marginSmall,
  },
  icon: {
    marginRight: Sizes.marginSmall,
  },
});
