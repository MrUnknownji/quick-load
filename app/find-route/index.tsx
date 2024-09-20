import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import Button from "@/components/button/Button";
import Sizes from "@/constants/Sizes";
import Colors from "@/constants/Colors";
import IconButton from "@/components/button/IconButton";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { t } from "i18next";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import SelectListWithDialog from "@/components/input-fields/SelectListWithDialog";
import { useAddRoute } from "@/hooks/useFetchVehicle";

const RouteFinder = () => {
  const { userType } = useLocalSearchParams<{ userType: string }>();
  const [startingPoint, setStartingPoint] = useState("");
  const [endingPoint, setEndingPoint] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const { addRoute, loading, error } = useAddRoute();

  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background",
  );
  const primaryColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.dark.secondary },
    "primary",
  );

  const handleSend = async () => {
    if (startingPoint && endingPoint && selectedVehicle) {
      const routeData = {
        userType,
        from: startingPoint,
        to: endingPoint,
        vehicle: selectedVehicle,
        selfVehicleId: userType === "driver" ? "random-id-123" : undefined,
      };

      try {
        const result = await addRoute(routeData);
        console.log("Route added successfully:", result);
        router.push({
          pathname: "/thank-you",
          params: {
            message: t("Your route has been successfully added!"),
            type: "route",
            from: startingPoint,
            to: endingPoint,
            vehicle: selectedVehicle,
          },
        });
      } catch (err) {
        console.error("Error adding route:", err);
        Alert.alert("Error", "Failed to add route. Please try again.");
      }
    } else {
      Alert.alert("Error", "Please fill in all fields");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingView}
    >
      <ThemedView style={styles.container}>
        <IconButton
          iconName="chevron-back"
          size="small"
          variant="primary"
          style={styles.backButton}
          onPress={() => router.back()}
        />
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.logo}
          />
          <Text style={[styles.title, { color: primaryColor }]}>
            {t("Hey")}{" "}
            {t(
              userType
                .at(0)
                ?.toUpperCase()
                .concat(t(userType.slice(1))) ?? "",
            )}
          </Text>
          <ThemedText style={styles.subtitle}>
            {t("Submit your route request")}
          </ThemedText>
          <ThemedText style={styles.sectionTitle}>{t("Find Route")}</ThemedText>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.autocompleteInput}
              placeholder={t("Starting point")}
              value={startingPoint}
              onChangeText={setStartingPoint}
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
            <TextInput
              style={styles.autocompleteInput}
              placeholder={t("Ending point")}
              value={endingPoint}
              onChangeText={setEndingPoint}
            />
            <Ionicons
              name="search"
              size={24}
              color={Colors.light.textSecondary}
              style={styles.searchIcon}
            />
          </View>

          <SelectListWithDialog
            options={["Truck", "Dumper", "Container", "Open body"]}
            label="Select Vehicle"
            containerStyle={{ paddingHorizontal: 0 }}
            onSelect={(value) => setSelectedVehicle(value)}
          />

          <Button
            title={loading ? t("Adding...") : t("Find")}
            variant="primary"
            size="medium"
            style={styles.findButton}
            textStyle={{ fontSize: Sizes.textMedium }}
            onPress={handleSend}
            disabled={loading}
          />

          {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
        </ScrollView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: Sizes.paddingMedium,
    alignItems: "center",
    justifyContent: "center",
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
    zIndex: 10,
  },
  errorText: {
    color: "red",
    marginTop: Sizes.marginSmall,
    textAlign: "center",
  },
  findButton: {
    width: "100%",
    marginTop: Sizes.marginMedium,
  },
});

export default RouteFinder;
