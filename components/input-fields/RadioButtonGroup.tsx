import Colors from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { ThemedText } from "../ThemedText";
import Sizes from "@/constants/Sizes";

interface Option {
  label: string;
  value: string;
}

interface RadioButtonGroupProps {
  options: Option[];
  onSelect: (value: string) => void;
  initialSelection?: string;
  selectedTextColor?: string;
  unselectedTextColor?: string;
  label?: string;
  subLabel?: string;
  isMandatory?: boolean;
}

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
  options,
  onSelect,
  initialSelection,
  selectedTextColor,
  unselectedTextColor,
  label,
  subLabel,
  isMandatory = false,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    undefined,
  );
  const textColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );

  const primaryColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.dark.secondary },
    "primary",
  );

  useEffect(() => {
    if (initialSelection) {
      setSelectedOption(initialSelection);
    }
  }, [initialSelection]);

  const handleSelect = (value: string) => {
    setSelectedOption(value);
    onSelect(value);
  };

  return (
    <View style={styles.container}>
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
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={styles.option}
          onPress={() => handleSelect(option.value)}
        >
          <View
            style={[
              styles.radio,
              {
                borderColor:
                  selectedOption === option.value
                    ? (selectedTextColor ?? primaryColor)
                    : (unselectedTextColor ?? textColor),
              },
            ]}
          >
            {selectedOption === option.value && (
              <View
                style={[
                  styles.selectedRadio,
                  { backgroundColor: selectedTextColor ?? primaryColor },
                ]}
              />
            )}
          </View>
          <ThemedText
            style={[
              styles.optionText,
              {
                color:
                  selectedOption === option.value
                    ? (selectedTextColor ?? primaryColor)
                    : (unselectedTextColor ?? textColor),
              },
            ]}
          >
            {option.label}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

interface Styles {
  container: ViewStyle;
  labelContainer: ViewStyle;
  label: TextStyle;
  subLabel: TextStyle;
  mandatoryIndicator: TextStyle;
  option: ViewStyle;
  radio: ViewStyle;
  selectedRadio: ViewStyle;
  optionText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    padding: 10,
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
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 4,
    borderRadius: 4,
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  selectedRadio: {
    height: 10,
    width: 10,
    borderRadius: 5,
  },
  optionText: {
    fontSize: 16,
  },
});

export default RadioButtonGroup;
