import Colors from "@/constants/Colors";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

interface RadioButtonGroupProps {
  options: string[];
  onSelect: (option: string) => void;
  initialSelection?: string;
  selectedTextColor?: string;
  unselectedTextColor?: string;
}

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
  options,
  onSelect,
  initialSelection,
  selectedTextColor = Colors.light.primary,
  unselectedTextColor = "#000000",
}) => {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (initialSelection) {
      setSelectedOption(initialSelection);
    }
  }, [initialSelection]);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    onSelect(option);
  };

  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={styles.option}
          onPress={() => handleSelect(option)}
        >
          <View
            style={[
              styles.radio,
              {
                borderColor:
                  selectedOption === option
                    ? selectedTextColor
                    : unselectedTextColor,
              },
            ]}
          >
            {selectedOption === option && (
              <View
                style={[
                  styles.selectedRadio,
                  { backgroundColor: selectedTextColor },
                ]}
              />
            )}
          </View>
          <Text
            style={[
              styles.optionText,
              {
                color:
                  selectedOption === option
                    ? selectedTextColor
                    : unselectedTextColor,
              },
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

interface Styles {
  container: ViewStyle;
  option: ViewStyle;
  radio: ViewStyle;
  selectedRadio: ViewStyle;
  optionText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    padding: 10,
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
