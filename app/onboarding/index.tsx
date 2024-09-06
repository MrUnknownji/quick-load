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
import useAppLanguage from "@/hooks/useAppLanguage";
import { useTranslation } from "react-i18next";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const Onboarding = () => {
  const [selectedPage, setSelectedPage] = useState(0);
  const { appLanguage, setAppLanguage } = useAppLanguage();
  const { t } = useTranslation();

  const handleNext = async () => {
    if (selectedPage === 2) {
      await AsyncStorage.setItem("hasOnboarded", "true");
      router.push("/authentication");
    } else {
      setSelectedPage(selectedPage + 1);
    }
  };

  return (
    <View
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
            <Text style={styles.welcomeText}>{t("Welcome to Quick Load")}</Text>
            <Text style={styles.welcomeSubText}>{t("Let's get started")}</Text>
          </View>
          <View style={styles.selectLanguageTextContainer}>
            <Ionicons name="language" size={24} color={Colors.light.primary} />
            <Text style={styles.selectLanguageText}>
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
              selectedTextColor={Colors.light.primary}
            />
          </View>
        </>
      )}
      {selectedPage === 1 && (
        <View style={{ flex: 1, width: "100%", height: "100%" }}>
          <Image
            source={`https://placehold.co/${screenWidth}x${
              screenHeight + 50
            }?text=Cheepest+Transport`}
            style={styles.fullScreenImage}
          />
        </View>
      )}
      {selectedPage === 2 && (
        <View style={{ flex: 1, width: "100%", height: "100%" }}>
          <Image
            source={`https://placehold.co/${screenWidth}x${
              screenHeight + 50
            }?text=Cheepest+Building+Materials`}
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
    </View>
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
  },
  selectLanguageText: {
    fontSize: Sizes.textLarge,
    fontWeight: "bold",
    color: Colors.light.primary,
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
