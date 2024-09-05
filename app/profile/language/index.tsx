import { StyleSheet, Text, View, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import RadioButtonGroup from "@/components/input-fields/RadioButtonGroup";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Sizes from "@/constants/Sizes";
import IconButton from "@/components/button/IconButton";
import useAppLanguage from "@/hooks/useAppLanguage";

const Language = () => {
  const { appLanguage, setAppLanguage } = useAppLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);

  useEffect(() => {
    if (appLanguage !== null && selectedLanguage !== null) {
      setIsSaveEnabled(selectedLanguage !== appLanguage);
    }
  }, [selectedLanguage, appLanguage]);

  useEffect(() => {
    if (appLanguage) {
      setSelectedLanguage(appLanguage);
    }
  }, [appLanguage]);

  const handleSave = () => {
    if (selectedLanguage) {
      setAppLanguage(selectedLanguage);
      Alert.alert("Language Saved", `You have selected ${selectedLanguage}`);
    } else {
      Alert.alert("No Language Selected", "Please select a language first.");
    }
  };

  if (appLanguage === null) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="language" size={24} color={Colors.light.primary} />
        <Text style={styles.headerText}>Select Language</Text>
      </View>
      <RadioButtonGroup
        options={["English", "Hindi(हिन्दी)"]}
        onSelect={setSelectedLanguage}
        initialSelection={appLanguage}
      />
      <IconButton
        iconName="save"
        title="Save"
        variant="primary"
        size="small"
        style={styles.saveIcon}
        onPress={handleSave}
        disabled={!isSaveEnabled}
      />
    </View>
  );
};

export default Language;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Sizes.marginMedium,
    paddingVertical: Sizes.paddingSmall,
    gap: Sizes.marginSmall,
  },
  headerText: {
    textAlign: "center",
    fontSize: Sizes.textLarge,
    fontWeight: "bold",
  },
  saveIcon: {
    position: "absolute",
    right: Sizes.marginHorizontal,
    bottom: Sizes.marginHorizontal,
    borderRadius: Sizes.borderRadiusFull,
    paddingHorizontal: Sizes.paddingHorizontal,
    backgroundColor: Colors.light.primary,
  },
});
