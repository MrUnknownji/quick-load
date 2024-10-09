import React, { memo, useCallback } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Sizes from "@/constants/Sizes";
import Colors from "@/constants/Colors";
import { t } from "i18next";
import { ThemedText } from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { responsive, vw, vh } from "@/utils/responsive";

interface ImageUploadFieldProps {
  label?: string;
  subLabel?: string;
  isMandatory?: boolean;
  placeholder?: string;
  onImageSelect?: (image: ImagePicker.ImagePickerAsset) => void;
  selectedImage?: ImagePicker.ImagePickerAsset | string;
  accessibleLabel?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  subLabel,
  isMandatory = false,
  placeholder = t("Select an image"),
  onImageSelect,
  selectedImage,
  accessibleLabel,
  disabled = false,
  style,
}) => {
  const iconColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.light.secondary },
    "primary",
  );

  const handleImageUpload = useCallback(async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert(t("Permission to access camera roll is required!"));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && onImageSelect) {
      onImageSelect(result.assets[0]);
    }
  }, [onImageSelect]);

  const getDisplayText = () => {
    if (typeof selectedImage === "string") {
      return selectedImage || placeholder;
    } else if (selectedImage && "uri" in selectedImage) {
      return selectedImage.uri.split("/").pop() || placeholder;
    }
    return placeholder;
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.labelContainer}>
          <ThemedText style={styles.label}>
            {label}
            {subLabel && (
              <ThemedText style={styles.subLabel}> ({subLabel})</ThemedText>
            )}
            {isMandatory && (
              <ThemedText style={styles.mandatoryIndicator}>*</ThemedText>
            )}
          </ThemedText>
        </View>
      )}
      <TouchableOpacity
        style={[
          styles.uploadBox,
          {
            borderColor: disabled
              ? Colors.light.disabled
              : Colors.light.primary,
          },
          !selectedImage ? styles.uploadBoxError : null,
        ]}
        onPress={handleImageUpload}
        accessibilityLabel={accessibleLabel || placeholder}
        disabled={disabled}
      >
        {selectedImage && typeof selectedImage !== "string" && (
          <Image
            source={{ uri: selectedImage.uri }}
            style={styles.previewImage}
          />
        )}
        <View style={styles.textContainer}>
          <Ionicons
            name="image"
            size={Sizes.icon.small}
            color={iconColor}
            style={styles.icon}
          />
          <ThemedText style={styles.placeholderText}>
            {getDisplayText()}
          </ThemedText>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default memo(ImageUploadField);

const styles = StyleSheet.create({
  container: {
    paddingVertical: vh(1),
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: vh(1),
  },
  label: {
    fontSize: responsive(Sizes.textSmall),
  },
  subLabel: {
    fontSize: responsive(Sizes.textSmall),
    color: Colors.light.textSecondary,
  },
  mandatoryIndicator: {
    fontSize: responsive(Sizes.textSmall),
    color: Colors.light.error,
    marginLeft: vw(0.5),
  },
  uploadBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: vh(1),
    paddingHorizontal: vw(4),
    borderWidth: 0.5,
    borderColor: Colors.light.border,
    borderRadius: responsive(Sizes.borderRadiusSmall),
  },
  uploadBoxError: {
    borderColor: Colors.light.error,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  placeholderText: {
    flex: 1,
    fontSize: responsive(Sizes.textMedium),
    marginLeft: vw(2),
  },
  icon: {
    marginRight: vw(2),
  },
  previewImage: {
    width: responsive(50),
    height: responsive(50),
    borderRadius: responsive(Sizes.borderRadiusSmall),
    marginRight: vw(2),
  },
});
