import React, { memo, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Modal,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Sizes from "@/constants/Sizes";
import Colors from "@/constants/Colors";
import { t } from "i18next";
import { ThemedText } from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "../ThemedView";

interface CheckboxDropdownProps {
  options: string[];
  label?: string;
  subLabel?: string;
  isMandatory?: boolean;
  selectedOptions: string[];
  onSelect: (options: string[]) => void;
  placeholder?: string;
  error?: string;
  accessibleLabel?: string;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  selectBoxStyle?: ViewStyle;
  popupStyle?: ViewStyle;
  optionStyle?: ViewStyle;
  labelStyle?: TextStyle;
  selectedTextStyle?: TextStyle;
  optionTextStyle?: TextStyle;
  errorTextStyle?: TextStyle;
}

const CheckboxDropdownWithDialog: React.FC<CheckboxDropdownProps> = ({
  options,
  label,
  subLabel,
  isMandatory = false,
  selectedOptions,
  onSelect,
  placeholder = "Select options",
  error,
  accessibleLabel,
  disabled = false,
  containerStyle,
  selectBoxStyle,
  popupStyle,
  optionStyle,
  labelStyle,
  selectedTextStyle,
  optionTextStyle,
  errorTextStyle,
}) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const iconColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.dark.secondary },
    "primary",
  );

  const togglePopup = useCallback(() => {
    setIsPopupVisible((prev) => !prev);
  }, []);

  const handleSelect = useCallback(
    (option: string) => {
      let newSelectedOptions;
      if (selectedOptions.includes(option)) {
        newSelectedOptions = selectedOptions.filter((item) => item !== option);
      } else {
        newSelectedOptions = [...selectedOptions, option];
      }
      onSelect(newSelectedOptions);
    },
    [selectedOptions, onSelect],
  );

  const getDisplayText = useCallback(() => {
    if (selectedOptions.length === 0) return placeholder;
    if (selectedOptions.length === 1) return selectedOptions[0];
    return `${selectedOptions.length} options selected`;
  }, [selectedOptions, placeholder]);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelContainer}>
          <ThemedText style={[styles.label, labelStyle]}>
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
          styles.selectBox,
          error ? styles.selectBoxError : null,
          { borderColor: disabled ? Colors.light.disabled : iconColor },
          selectBoxStyle,
        ]}
        onPress={togglePopup}
        accessibilityLabel={accessibleLabel || placeholder}
        disabled={disabled}
      >
        <ThemedText style={[styles.selectedText, selectedTextStyle]}>
          {t(getDisplayText())}
        </ThemedText>
        <Ionicons
          name={isPopupVisible ? "chevron-up" : "chevron-down"}
          size={Sizes.icon.small}
          color={iconColor}
        />
      </TouchableOpacity>
      <Modal
        visible={isPopupVisible}
        transparent
        statusBarTranslucent
        animationType="fade"
        onRequestClose={togglePopup}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={togglePopup}
        >
          <ThemedView style={[styles.popup, popupStyle]}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.option, optionStyle]}
                  onPress={() => handleSelect(item)}
                >
                  <View style={styles.checkbox}>
                    {selectedOptions.includes(item) && (
                      <Ionicons name="checkmark" size={16} color={iconColor} />
                    )}
                  </View>
                  <ThemedText style={[styles.optionText, optionTextStyle]}>
                    {t(item)}
                  </ThemedText>
                </TouchableOpacity>
              )}
            />
          </ThemedView>
        </TouchableOpacity>
      </Modal>

      {error && (
        <Text style={[styles.errorText, errorTextStyle]}>{t(error)}</Text>
      )}
    </View>
  );
};

export default memo(CheckboxDropdownWithDialog);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: Sizes.paddingSmall,
    paddingHorizontal: Sizes.paddingMedium,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Sizes.marginSmall,
  },
  label: {
    fontSize: Sizes.textSmall,
  },
  subLabel: {
    fontSize: Sizes.textSmall,
    color: Colors.light.textSecondary,
  },
  mandatoryIndicator: {
    fontSize: Sizes.textSmall,
    color: Colors.light.error,
    marginLeft: 2,
  },
  selectBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Sizes.paddingSmall,
    paddingHorizontal: Sizes.paddingMedium,
    borderWidth: 0.5,
    borderColor: Colors.light.border,
    borderRadius: Sizes.borderRadiusSmall,
  },
  selectBoxError: {
    borderColor: Colors.light.error,
  },
  selectedText: {
    flex: 1,
    fontSize: Sizes.textMedium,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popup: {
    width: "80%",
    borderRadius: Sizes.borderRadiusMedium,
    padding: Sizes.paddingMedium,
    maxHeight: 300,
    elevation: 5,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Sizes.paddingSmall,
    paddingHorizontal: Sizes.paddingMedium,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 4,
    marginRight: Sizes.marginSmall,
    justifyContent: "center",
    alignItems: "center",
  },
  optionText: {
    fontSize: Sizes.textMedium,
  },
  errorText: {
    fontSize: Sizes.textSmall,
    color: Colors.light.error,
    marginTop: Sizes.marginSmall,
  },
});
