import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
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
import { useAddRoute } from "@/hooks/useFetchRoute";
import { useUser } from "@/contexts/UserContext";
import {
  useFetchVehiclesByUserId,
  useFetchVehicleTypes,
} from "@/hooks/useFetchVehicle";
import FlexibleSkeleton from "@/components/Loading/FlexibleSkeleton";

const RouteFinder = () => {
  const { userType } = useLocalSearchParams<{ userType: string }>();
  const { currentUser } = useUser();
  const [startingPoint, setStartingPoint] = useState("");
  const [endingPoint, setEndingPoint] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [formError, setFormError] = useState("");
  const { addRoute, loading, error } = useAddRoute();

  const {
    vehicles,
    loading: vehiclesLoading,
    error: vehiclesError,
  } = useFetchVehiclesByUserId(currentUser?._id ?? "");
  const {
    vehicleTypes,
    loading: vehicleTypesLoading,
    error: vehicleTypesError,
  } = useFetchVehicleTypes();

  const primaryColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.dark.secondary },
    "primary",
  );

  const textColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );

  useEffect(() => {
    if (userType.toLowerCase() === "driver" && vehicles.length === 1) {
      setSelectedVehicle(vehicles[0].vehicleId);
    }
  }, [userType, vehicles]);

  const isFormValid = () => {
    if (!startingPoint || !endingPoint) {
      return false;
    }
    if (userType.toLowerCase() === "driver" && !selectedVehicle) {
      return false;
    }
    return true;
  };

  const handleSend = async () => {
    if (isFormValid()) {
      const routeData = {
        from: startingPoint,
        to: endingPoint,
        vehicle: selectedVehicle || undefined,
        selfVehicleId:
          userType.toLowerCase() === "driver" ? selectedVehicle : undefined,
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
        setFormError("Failed to add route. Please try again.");
      }
    } else {
      setFormError("Please fill in all required fields");
    }
  };

  const renderVehicleSelection = () => {
    if (userType.toLowerCase() === "driver") {
      if (vehiclesLoading) {
        return (
          <FlexibleSkeleton
            width="100%"
            height={50}
            style={{ marginBottom: Sizes.marginSmall }}
          />
        );
      } else if (vehicles.length === 0) {
        return (
          <IconButton
            iconName="add"
            variant="transparent"
            title={t("Add vehicle to continue")}
            style={{ width: "100%", padding: 5 }}
          />
        );
      } else {
        return (
          <SelectListWithDialog
            options={vehicles.map((v) => ({
              label: `${v.vehicleNumber} (${v.vehicleType})`,
              value: v.vehicleId,
            }))}
            label={t("Select Vehicle")}
            containerStyle={{ paddingHorizontal: 0 }}
            onSelect={(value) => setSelectedVehicle(value)}
            selectedOption={selectedVehicle}
          />
        );
      }
    } else {
      if (vehicleTypesLoading) {
        return (
          <FlexibleSkeleton
            width="100%"
            height={50}
            style={{ marginBottom: Sizes.marginSmall }}
          />
        );
      } else {
        return (
          <SelectListWithDialog
            options={vehicleTypes.map((vt) => vt.type)}
            label={t("Select Vehicle Type")}
            containerStyle={{ paddingHorizontal: 0 }}
            onSelect={(value) => setSelectedVehicle(value)}
            selectedOption={selectedVehicle}
          />
        );
      }
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
            {t(
              `Hey ${userType.toLowerCase() === "driver" ? "Driver" : "Merchant"}`,
            )}
          </Text>
          <ThemedText style={styles.subtitle}>
            {t("Submit your route request")}
          </ThemedText>
          <ThemedText style={styles.sectionTitle}>{t("Find Route")}</ThemedText>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.autocompleteInput, { color: textColor }]}
              placeholder={t("Starting point")}
              value={startingPoint}
              onChangeText={setStartingPoint}
              placeholderTextColor={textColor}
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
              style={[styles.autocompleteInput, { color: textColor }]}
              placeholder={t("Ending point")}
              value={endingPoint}
              onChangeText={setEndingPoint}
              placeholderTextColor={textColor}
            />
            <Ionicons
              name="search"
              size={24}
              color={Colors.light.textSecondary}
              style={styles.searchIcon}
            />
          </View>

          {renderVehicleSelection()}

          <Button
            title={loading ? t("Adding...") : t("Find")}
            variant="primary"
            size="medium"
            style={styles.findButton}
            textStyle={{ fontSize: Sizes.textMedium }}
            onPress={handleSend}
            disabled={loading || !isFormValid()}
          />
          {(error || formError) && (
            <ThemedText style={styles.errorText}>
              {error || formError}
            </ThemedText>
          )}
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
