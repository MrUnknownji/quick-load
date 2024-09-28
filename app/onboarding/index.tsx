import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
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
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import OnboardingImageSkeleton from "@/components/Loading/OnboardingImageSkeleton";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const Onboarding = () => {
  const [selectedPage, setSelectedPage] = useState(0);
  const { appLanguage, setAppLanguage, loading } = useLanguage();
  const { t } = useTranslation();
  const [imagesLoaded, setImagesLoaded] = useState({
    image1: false,
    image2: false,
  });

  const primaryColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.dark.secondary },
    "primary",
  );

  useEffect(() => {
    Image.prefetch("https://quick-load.onrender.com/assets/cheep-transport.png")
      .then(() => setImagesLoaded((prev) => ({ ...prev, image1: true })))
      .catch((error) => console.error("Error preloading image 1:", error));

    Image.prefetch("https://quick-load.onrender.com/assets/cheep-material.png")
      .then(() => setImagesLoaded((prev) => ({ ...prev, image2: true })))
      .catch((error) => console.error("Error preloading image 2:", error));
  }, []);

  const handleNext = async () => {
    if (selectedPage === 2) {
      await AsyncStorage.setItem("hasOnboarded", "true");
      router.replace("/authentication");
    } else {
      setSelectedPage(selectedPage + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {selectedPage === 0 && (
        <View style={styles.contentContainer}>
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
        </View>
      )}
      {selectedPage === 1 && (
        <View style={styles.imageContainer}>
          {!imagesLoaded.image1 ? (
            <OnboardingImageSkeleton />
          ) : (
            <Image
              source={`https://quick-load.onrender.com/assets/cheep-transport.png`}
              style={styles.fullScreenImage}
            />
          )}
        </View>
      )}
      {selectedPage === 2 && (
        <View style={styles.imageContainer}>
          {!imagesLoaded.image2 ? (
            <OnboardingImageSkeleton />
          ) : (
            <Image
              source={`https://quick-load.onrender.com/assets/cheep-material.png`}
              style={styles.fullScreenImage}
            />
          )}
        </View>
      )}
      <Button
        title={t("Continue")}
        variant="primary"
        size="medium"
        style={styles.button}
        onPress={handleNext}
      />
    </SafeAreaView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Sizes.marginHorizontal,
  },
  imageContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
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
    paddingTop: 8,
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
    alignSelf: "center",
  },
});
