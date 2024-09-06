import React, { memo, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
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
  dropdownStyle?: ViewStyle;
  optionStyle?: ViewStyle;
  labelStyle?: TextStyle;
  selectedTextStyle?: TextStyle;
  optionTextStyle?: TextStyle;
  errorTextStyle?: TextStyle;
  defaultText?: string;
  initialSelectedOption?: string;
}

const SelectList: React.FC<SelectListProps> = ({
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
  dropdownStyle,
  optionStyle,
  labelStyle,
  selectedTextStyle,
  optionTextStyle,
  errorTextStyle,
  defaultText = "Select an option",
  initialSelectedOption,
}) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    initialSelectedOption || propSelectedOption
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
      setIsDropdownVisible(false);
      setSelectedOption(option);
      onSelect?.(option);
    },
    [onSelect]
  );

  const toggleDropdown = useCallback(() => {
    setIsDropdownVisible((prev) => !prev);
  }, []);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
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
        onPress={toggleDropdown}
        accessibilityLabel={accessibleLabel || placeholder}
        disabled={disabled}
      >
        {IconComponent && iconName && (
          <IconComponent
            name={iconName as never}
            size={Sizes.icon.small}
            color={Colors.light.primary}
            style={styles.icon}
          />
        )}
        <Text style={[styles.selectedText, selectedTextStyle]}>
          {t(selectedOption || placeholder || defaultText)}
        </Text>
        <Ionicons
          name={isDropdownVisible ? "chevron-up" : "chevron-down"}
          size={Sizes.icon.small}
          color={Colors.light.primary}
        />
      </TouchableOpacity>
      {isDropdownVisible && (
        <View style={[styles.dropdown, dropdownStyle]}>
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.option, optionStyle]}
                onPress={() => handleSelect(item)}
              >
                <Text style={[styles.optionText, optionTextStyle]}>
                  {t(item)}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      {error && (
        <Text style={[styles.errorText, errorTextStyle]}>{t(error)}</Text>
      )}
    </View>
  );
};

export default memo(SelectList);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: Sizes.paddingSmall,
    paddingHorizontal: Sizes.paddingMedium,
  },
  label: {
    fontSize: Sizes.textSmall,
    color: Colors.light.text,
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
    color: Colors.light.text,
    marginLeft: Sizes.marginSmall,
  },
  icon: {
    marginRight: Sizes.marginSmall,
  },
  dropdown: {
    borderWidth: 0.5,
    borderColor: Colors.light.border,
    borderRadius: Sizes.borderRadiusSmall,
    backgroundColor: Colors.light.background,
    marginTop: Sizes.marginSmall,
    maxHeight: 200,
    position: "absolute",
    top: "110%",
    zIndex: 1,
    width: "100%",
  },
  option: {
    paddingVertical: Sizes.paddingSmall,
    paddingHorizontal: Sizes.paddingMedium,
  },
  optionText: {
    fontSize: Sizes.textMedium,
    color: Colors.light.text,
  },
  errorText: {
    fontSize: Sizes.textSmall,
    color: Colors.light.error,
    marginTop: Sizes.marginSmall,
  },
});
