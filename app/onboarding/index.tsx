import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Image } from "expo-image";
import RadioButtonGroup from "@/components/input-fields/RadioButtonGroup";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Sizes from "@/constants/Sizes";
import Button from "@/components/button/Button";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const Onboarding = () => {
  const [selectedPage, setSelectedPage] = useState(0);
  const { appLanguage, setAppLanguage, loading } = useLanguage();
  const { t } = useTranslation();

  const primaryColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.dark.secondary },
    "primary",
  );

  const handleNext = async () => {
    if (selectedPage === 2) {
      await AsyncStorage.setItem("hasOnboarded", "true");
      router.replace("/authentication");
    } else {
      setSelectedPage(selectedPage + 1);
    }
  };

  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {selectedPage === 0 && (
        <>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.icon}
          />
          <View style={styles.welcomeTextContainer}>
            <ThemedText style={styles.welcomeText}>
              {t("Welcome to Quick Load")}
            </ThemedText>
            <ThemedText style={styles.welcomeSubText}>
              {t("Let's get started")}
            </ThemedText>
          </View>
          <View style={styles.selectLanguageTextContainer}>
            <Ionicons name="language" size={24} color={primaryColor} />
            <Text style={[styles.selectLanguageText, { color: primaryColor }]}>
              {t("Select Language")}
            </Text>
          </View>
          <View style={styles.selectLanguageContainer}>
            <RadioButtonGroup
              options={[
                { label: "English", value: "en" },
                { label: "Hindi(हिन्दी)", value: "hi" },
              ]}
              initialSelection={appLanguage ?? "en"}
              onSelect={(selectedLanguage) => setAppLanguage(selectedLanguage)}
            />
          </View>
        </>
      )}
      {selectedPage === 1 && (
        <View style={{ flex: 1, width: "100%", height: "100%" }}>
          <Image
            source={`https://quick-load.onrender.com/assets/cheep-transport.png`}
            style={styles.fullScreenImage}
          />
        </View>
      )}
      {selectedPage === 2 && (
        <View style={{ flex: 1, width: "100%", height: "100%" }}>
          <Image
            source={`https://quick-load.onrender.com/assets/cheep-material.png`}
            style={styles.fullScreenImage}
          />
        </View>
      )}
      <Button
        title={t("Continue")}
        variant="primary"
        size="medium"
        style={styles.button}
        onPress={handleNext}
      />
    </ThemedView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  icon: {
    width: 200,
    height: 200,
  },
  welcomeTextContainer: {
    alignItems: "flex-start",
    marginTop: Sizes.marginLarge,
    marginBottom: 50,
  },
  welcomeText: {
    fontSize: Sizes.textExtraLarge,
    fontWeight: "bold",
    textAlign: "center",
  },
  welcomeSubText: {
    fontSize: Sizes.textMedium,
    textAlign: "center",
  },
  selectLanguageTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  selectLanguageText: {
    fontSize: Sizes.textLarge,
    fontWeight: "bold",
  },
  selectLanguageContainer: {
    width: "100%",
    alignItems: "flex-start",
  },
  button: {
    position: "absolute",
    width: screenWidth - Sizes.marginHorizontal * 2,
    bottom: 10,
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
  },
});
