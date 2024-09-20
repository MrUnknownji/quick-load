import { StyleSheet, View, Dimensions } from "react-native";
import React from "react";
import Sizes from "@/constants/Sizes";
import Colors from "@/constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import Button from "@/components/button/Button";
import { t } from "i18next";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

const { width: screenWidth } = Dimensions.get("window");

const ThankYou = () => {
  const { message, type, from, to, vehicle } = useLocalSearchParams<{
    message: string;
    type?: string;
    from?: string;
    to?: string;
    vehicle?: string;
  }>();

  return (
    <ThemedView style={styles.container}>
      <LottieView
        source={require("@/assets/animations/success.json")}
        autoPlay
        loop={false}
        style={styles.animation}
      />
      <ThemedText style={styles.heading}>{t("Thank You!")}</ThemedText>
      <ThemedText style={styles.message}>{t(message)}</ThemedText>
      {type === "route" && (
        <View style={styles.routeInfoContainer}>
          <RouteInfoItem icon="location" text={from} />
          <RouteInfoItem icon="arrow-forward" text={t("to")} />
          <RouteInfoItem icon="location" text={to} />
          <RouteInfoItem icon="car" text={vehicle} />
        </View>
      )}
      <Button
        title={t("Back to Home")}
        variant="primary"
        size="medium"
        onPress={() => router.replace("/(tabs)/")}
        style={styles.button}
      />
    </ThemedView>
  );
};

const RouteInfoItem = ({ icon, text }: { icon: string; text?: string }) => (
  <View style={styles.routeInfoItem}>
    <Ionicons name={icon as any} size={24} color={Colors.light.primary} />
    <ThemedText style={styles.routeInfoText}>{text}</ThemedText>
  </View>
);

export default ThankYou;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Sizes.paddingLarge,
  },
  backButton: {
    position: "absolute",
    left: Sizes.marginHorizontal,
    top: Sizes.StatusBarHeight ?? 0 + 10,
    borderRadius: Sizes.borderRadiusFull,
  },
  animation: {
    width: 200,
    height: 200,
  },
  heading: {
    fontSize: Sizes.textExtraLarge,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: Sizes.marginLarge,
  },
  message: {
    fontSize: Sizes.textMedium,
    textAlign: "center",
    marginTop: Sizes.marginMedium,
    marginHorizontal: Sizes.marginLarge,
  },
  routeInfoContainer: {
    marginTop: Sizes.marginLarge,
    alignItems: "center",
    width: "100%",
  },
  routeInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Sizes.marginSmall,
  },
  routeInfoText: {
    fontSize: Sizes.textMedium,
    marginLeft: Sizes.marginSmall,
  },
  button: {
    marginTop: Sizes.marginLarge,
    width: screenWidth - Sizes.marginHorizontal * 4,
  },
});
