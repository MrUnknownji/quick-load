import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { t } from "i18next";
import { useUser } from "@/contexts/UserContext";

const FindRouteBottomSheet = () => {
  const { currentUser } = useUser();

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.labelText}>{t("Please log in to continue")}</Text>
      </View>
    );
  }

  if (currentUser.type === "customer") {
    return (
      <View style={styles.container}>
        <Text style={styles.labelText}>{t("Welcome, Customer!")}</Text>
        <Text>{t("Check out our latest offers and services.")}</Text>
      </View>
    );
  }

  const renderOption = (label: string, userType: string) => (
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
        source={`https://quick-load.onrender.com/assets/${label == "Find Load" ? "find-load" : "find-transport"}.png`}
      />
      <Text style={styles.labelText}>{t(label)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {(currentUser.type === "driver" ||
        currentUser.type === "merchant-driver" ||
        currentUser.type === "admin") &&
        renderOption("Find Load", "driver")}
      {(currentUser.type === "merchant" ||
        currentUser.type === "merchant-driver" ||
        currentUser.type === "admin") &&
        renderOption("Find Transport", "merchant")}
    </View>
  );
};

export default FindRouteBottomSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 30,
  },
  optionContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginTop: 20,
  },
  labelText: {
    fontSize: 20,
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    marginTop: 10,
  },
});
