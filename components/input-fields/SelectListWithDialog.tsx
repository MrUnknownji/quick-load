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
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Sizes from "@/constants/Sizes";
import Colors from "@/constants/Colors";
import { t } from "i18next";
import { ThemedText } from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "../ThemedView";

type IconType =
  | "Ionicons"
  | "MaterialIcons"
  | "FontAwesome"
  | "MaterialCommunityIcons";

interface SelectListProps {
  options: string[];
  label?: string;
  selectedOption?: string;
  onSelect?: (option: string) => void;
  placeholder?: string;
  error?: string;
  accessibleLabel?: string;
  disabled?: boolean;
  iconName?:
    | keyof typeof Ionicons.glyphMap
    | keyof typeof MaterialIcons.glyphMap
    | keyof typeof FontAwesome.glyphMap
    | keyof typeof MaterialCommunityIcons.glyphMap;
  iconType?: IconType;
  containerStyle?: ViewStyle;
  selectBoxStyle?: ViewStyle;
  popupStyle?: ViewStyle;
  optionStyle?: ViewStyle;
  labelStyle?: TextStyle;
  selectedTextStyle?: TextStyle;
  optionTextStyle?: TextStyle;
  errorTextStyle?: TextStyle;
  defaultText?: string;
  initialSelectedOption?: string;
}

const SelectListWithDialog: React.FC<SelectListProps> = ({
  options,
  label,
  selectedOption: propSelectedOption,
  onSelect,
  placeholder,
  error,
  accessibleLabel,
  iconName,
  iconType = "Ionicons",
  disabled = false,
  containerStyle,
  selectBoxStyle,
  popupStyle,
  optionStyle,
  labelStyle,
  selectedTextStyle,
  optionTextStyle,
  errorTextStyle,
  defaultText = "Select an option",
  initialSelectedOption,
}) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    initialSelectedOption || propSelectedOption
  );

  const iconColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.dark.secondary },
    "primary"
  );
  const textColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text"
  );

  const IconComponent = iconName
    ? {
        Ionicons,
        MaterialIcons,
        FontAwesome,
        MaterialCommunityIcons,
      }[iconType]
    : null;

  const handleSelect = useCallback(
    (option: string) => {
      setIsPopupVisible(false);
      setSelectedOption(option);
      onSelect?.(option);
    },
    [onSelect]
  );

  const togglePopup = useCallback(() => {
    setIsPopupVisible((prev) => !prev);
  }, []);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <ThemedText style={[styles.label, labelStyle]}>{label}</ThemedText>
      )}
      <TouchableOpacity
        style={[
          styles.selectBox,
          error ? styles.selectBoxError : null,
          {
            borderColor: disabled
              ? Colors.light.disabled
              : Colors.light.primary,
          },
          selectBoxStyle,
        ]}
        onPress={togglePopup}
        accessibilityLabel={accessibleLabel || placeholder}
        disabled={disabled}
      >
        {IconComponent && iconName && (
          <IconComponent
            name={iconName as never}
            size={Sizes.icon.small}
            color={iconColor}
            style={styles.icon}
          />
        )}
        <ThemedText style={[styles.selectedText, selectedTextStyle]}>
          {t(selectedOption || placeholder || defaultText)}
        </ThemedText>
        <Ionicons
          name={isPopupVisible ? "chevron-up" : "chevron-down"}
          size={Sizes.icon.small}
          color={iconColor}
        />
      </TouchableOpacity>

      {/* Popup Modal */}
      <Modal
        visible={isPopupVisible}
        transparent={true}
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

export default memo(SelectListWithDialog);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: Sizes.paddingSmall,
    paddingHorizontal: Sizes.paddingMedium,
  },
  label: {
    fontSize: Sizes.textSmall,
    marginBottom: Sizes.marginSmall,
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
    marginLeft: Sizes.marginSmall,
  },
  icon: {
    marginRight: Sizes.marginSmall,
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
    paddingVertical: Sizes.paddingSmall,
    paddingHorizontal: Sizes.paddingMedium,
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
