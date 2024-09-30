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
import { responsive, vw, vh } from "@/utils/responsive";

type IconType =
  | "Ionicons"
  | "MaterialIcons"
  | "FontAwesome"
  | "MaterialCommunityIcons";

interface Option {
  label: string;
  value: string;
}

interface SelectListProps<T extends Option | string> {
  options: T[];
  label?: string;
  subLabel?: string;
  isMandatory?: boolean;
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

function SelectListWithDialog<T extends Option | string>({
  options,
  label,
  subLabel,
  isMandatory = false,
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
}: SelectListProps<T>) {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    initialSelectedOption || propSelectedOption,
  );

  const iconColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.dark.secondary },
    "primary",
  );
  const textColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
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
    (option: T) => {
      setIsPopupVisible(false);
      const value = typeof option === "string" ? option : option.value;
      setSelectedOption(value);
      onSelect?.(value);
    },
    [onSelect],
  );

  const togglePopup = useCallback(() => {
    setIsPopupVisible((prev) => !prev);
  }, []);

  const getSelectedLabel = useCallback(() => {
    if (!selectedOption) return defaultText;
    const selectedItem = options.find(
      (option) =>
        (typeof option === "string" ? option : option.value) === selectedOption,
    );
    return typeof selectedItem === "string"
      ? selectedItem
      : selectedItem?.label || defaultText;
  }, [selectedOption, options, defaultText]);

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
          {
            borderColor: disabled ? Colors.light.disabled : iconColor,
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
          {t(getSelectedLabel())}
        </ThemedText>
        <Ionicons
          name={isPopupVisible ? "chevron-up" : "chevron-down"}
          size={Sizes.icon.small}
          color={iconColor}
        />
      </TouchableOpacity>
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
              keyExtractor={(item, index) =>
                typeof item === "string" ? item : item.value + index.toString()
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.option, optionStyle]}
                  onPress={() => handleSelect(item)}
                >
                  <ThemedText style={[styles.optionText, optionTextStyle]}>
                    {t(typeof item === "string" ? item : item.label)}
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
}

export default memo(SelectListWithDialog) as typeof SelectListWithDialog;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: vh(1),
    paddingHorizontal: vw(4),
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
  selectBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: vh(1),
    paddingHorizontal: vw(4),
    borderWidth: 0.5,
    borderColor: Colors.light.border,
    borderRadius: responsive(Sizes.borderRadiusSmall),
  },
  selectBoxError: {
    borderColor: Colors.light.error,
  },
  selectedText: {
    flex: 1,
    fontSize: responsive(Sizes.textMedium),
    marginLeft: vw(2),
  },
  icon: {
    marginRight: vw(2),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popup: {
    width: "80%",
    borderRadius: responsive(Sizes.borderRadiusMedium),
    padding: vw(4),
    maxHeight: vh(50),
    elevation: 5,
  },
  option: {
    paddingVertical: vh(1),
    paddingHorizontal: vw(4),
  },
  optionText: {
    fontSize: responsive(Sizes.textMedium),
  },
  errorText: {
    fontSize: responsive(Sizes.textSmall),
    color: Colors.light.error,
    marginTop: vh(1),
  },
});
