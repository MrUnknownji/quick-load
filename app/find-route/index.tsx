import React, { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Button from "@/components/button/Button";
import Sizes from "@/constants/Sizes";
import Colors from "@/constants/Colors";
import IconButton from "@/components/button/IconButton";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { t } from "i18next";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

const RouteFinder = () => {
  const { userType } = useLocalSearchParams<{ userType: string }>();
  const [startingPoint, setStartingPoint] = useState("");
  const [endingPoint, setEndingPoint] = useState("");

  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background"
  );
  const primaryColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.dark.secondary },
    "primary"
  );
  const textColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text"
  );
  const placeholderColor = useThemeColor(
    { light: Colors.light.textSecondary, dark: Colors.dark.textSecondary },
    "textSecondary"
  );

  const handleSend = () => {
    if (startingPoint && endingPoint) {
      router.push({
        pathname: "/route-map",
        params: { start: startingPoint, end: endingPoint },
      });
    } else {
      alert(
        t(
          "You need to open in Google Maps to see this route. No API key is added so we are using random locations for now. Your route is from Central Park to Times Square"
        )
      );
      router.push({
        pathname: "/route-map",
        params: {
          start: "Central Park, New York, NY, USA",
          end: "Times Square, New York, NY, USA",
        },
      });
    }
  };

  return (
    <ThemedView style={styles.container}>
      <IconButton
        iconName="chevron-back"
        size="small"
        variant="primary"
        style={styles.backButton}
        onPress={() => router.back()}
      />
      <Image source={require("@/assets/images/icon.png")} style={styles.logo} />
      <Text style={[styles.title, { color: primaryColor }]}>
        {t("Hey")}{" "}
        {t(
          userType
            .at(0)
            ?.toUpperCase()
            .concat(t(userType.slice(1))) ?? ""
        )}
      </Text>
      <ThemedText style={styles.subtitle}>
        {t("Submit your route request")}
      </ThemedText>
      <ThemedText style={styles.sectionTitle}>{t("Find Route")}</ThemedText>

      <View style={styles.inputContainer}>
        <GooglePlacesAutocomplete
          placeholder={t("Starting point")}
          onPress={(data, details = null) => {
            setStartingPoint(data.description);
          }}
          query={{
            key: "YOUR_GOOGLE_MAPS_API_KEY",
            language: "en",
          }}
          styles={{
            textInput: [
              styles.autocompleteInput,
              {
                backgroundColor,
                color: textColor,
              },
            ],
            container: { flex: 1 },
            listView: { marginTop: 0 },
          }}
          textInputProps={{
            placeholderTextColor: placeholderColor,
          }}
        />
        <Ionicons
          name="search"
          size={24}
          color={Colors.light.textSecondary}
          style={styles.searchIcon}
        />
      </View>

      <ThemedText style={styles.toText}>{t("to")}</ThemedText>

      <View style={styles.inputContainer}>
        <GooglePlacesAutocomplete
          placeholder={t("Ending point")}
          onPress={(data, details = null) => {
            setEndingPoint(data.description);
          }}
          query={{
            key: "YOUR_GOOGLE_MAPS_API_KEY",
            language: "en",
          }}
          styles={{
            textInput: [
              styles.autocompleteInput,
              {
                backgroundColor,
                color: textColor,
              },
            ],
            container: { flex: 1 },
            listView: { marginTop: 0 },
          }}
          textInputProps={{
            placeholderTextColor: placeholderColor,
          }}
        />
        <Ionicons
          name="search"
          size={24}
          color={Colors.light.textSecondary}
          style={styles.searchIcon}
        />
      </View>

      <Button
        title={t("Find")}
        variant="primary"
        size="medium"
        style={{ width: "100%" }}
        textStyle={{ fontSize: Sizes.textMedium }}
        onPress={handleSend}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Sizes.paddingMedium,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: Sizes.marginMedium,
  },
  title: {
    fontSize: Sizes.textExtraLarge,
    fontWeight: "bold",
    color: Colors.light.primary,
    textAlign: "center",
  },
  subtitle: {
    fontSize: Sizes.textMedium,
    marginBottom: Sizes.marginMedium,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: Sizes.textLarge,
    fontWeight: "bold",
    marginBottom: Sizes.marginSmall,
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: Colors.light.border,
    borderWidth: 1,
    borderRadius: Sizes.borderRadius,
    marginBottom: Sizes.marginSmall,
    overflow: "hidden",
  },
  autocompleteInput: {
    flex: 1,
    paddingHorizontal: Sizes.paddingHorizontal,
  },
  searchIcon: {
    padding: Sizes.paddingSmall,
  },
  toText: {
    fontSize: Sizes.textNormal,
    marginBottom: Sizes.marginSmall,
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    left: Sizes.marginHorizontal,
    top: Sizes.StatusBarHeight ?? 0 + 10,
    borderRadius: Sizes.borderRadiusFull,
  },
});

export default RouteFinder;
