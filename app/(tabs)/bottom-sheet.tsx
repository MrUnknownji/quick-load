import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { t } from "i18next";
import { ThemedText } from "@/components/ThemedText";
import { responsive, vw, vh } from "@/utils/responsive";
import { useUser } from "@/hooks/useUser";

const FindRouteBottomSheet = () => {
  const { user } = useUser();

  if (!user || user.type === "customer") {
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
        source={`https://movingrolls.online/assets/${imageName}.png`}
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
      {(user.type === "merchant-driver" || user.type === "admin") && (
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
    paddingHorizontal: responsive(10),
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontSize: responsive(24),
    fontWeight: "bold",
    marginBottom: responsive(30),
    textAlign: "center",
    paddingTop: responsive(8),
  },
  optionContainer: {
    alignItems: "center",
    marginBottom: responsive(30),
    borderRadius: responsive(15),
    padding: responsive(20),
  },
  image: {
    width: responsive(180),
    height: responsive(180),
    borderRadius: responsive(90),
    marginBottom: responsive(15),
  },
  textContainer: {
    alignItems: "center",
  },
  labelText: {
    fontSize: responsive(18),
    fontWeight: "bold",
    textAlign: "center",
  },
  subLabelText: {
    fontSize: responsive(14),
    color: "#666",
    textAlign: "center",
    marginTop: responsive(5),
  },
});
