import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { t } from "i18next";
import { useUser } from "@/contexts/UserContext";
import { ThemedText } from "@/components/ThemedText";

const FindRouteBottomSheet = () => {
  const { currentUser } = useUser();

  if (!currentUser || currentUser.type === "customer") {
    return null;
  }

  const renderOption = (
    label: string,
    subLabel: string,
    userType: string,
    imageName: string,
  ) => (
    <TouchableOpacity
      style={styles.optionContainer}
      onPress={() =>
        router.push({
          pathname: "/find-route",
          params: { userType },
        })
      }
    >
      <Image
        style={styles.image}
        source={`https://quick-load.onrender.com/assets/${imageName}.png`}
      />
      <View style={styles.textContainer}>
        <ThemedText style={styles.labelText}>{t(label)}</ThemedText>
        <ThemedText style={styles.subLabelText}>{t(subLabel)}</ThemedText>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ThemedText style={styles.titleText}>
        {t("Fast & Cheapest Transport")}
      </ThemedText>
      {(currentUser.type === "merchant-driver" ||
        currentUser.type === "admin") && (
        <>
          {renderOption("Find Load", "(For Drivers)", "driver", "find-load")}
          {renderOption(
            "Find Vehicles For Transport",
            "(For Merchants)",
            "merchant",
            "find-transport",
          )}
        </>
      )}
    </View>
  );
};

export default FindRouteBottomSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    paddingTop: 8,
  },
  optionContainer: {
    alignItems: "center",
    marginBottom: 30,
    borderRadius: 15,
    padding: 20,
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 90,
    marginBottom: 15,
  },
  textContainer: {
    alignItems: "center",
  },
  labelText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  subLabelText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
});
