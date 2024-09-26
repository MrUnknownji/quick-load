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
import { useThemeColor } from "@/hooks/useThemeColor";

const { width: screenWidth } = Dimensions.get("window");

const ThankYou = () => {
  const { message, type, from, to, vehicle, orderNumber, issueDetails } =
    useLocalSearchParams<{
      message: string;
      type?: string;
      from?: string;
      to?: string;
      vehicle?: string;
      orderNumber?: string;
      issueDetails?: string;
    }>();

  const iconColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.light.secondary },
    "text",
  );

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

      {type === "new_user" && (
        <ThemedText style={styles.reviewMessage}>
          {t("Your account is under review and will be verified soon.")}
        </ThemedText>
      )}

      {type === "route" && (
        <View style={styles.routeInfoContainer}>
          <RouteInfoItem icon="location" text={from} iconColor={iconColor} />
          <RouteInfoItem
            icon="arrow-forward"
            text={t("to")}
            iconColor={iconColor}
          />
          <RouteInfoItem icon="location" text={to} iconColor={iconColor} />
          <RouteInfoItem icon="car" text={vehicle} iconColor={iconColor} />
        </View>
      )}

      {type === "union_support" && (
        <View style={styles.unionSupportContainer}>
          <ThemedText style={styles.unionSupportTitle}>
            {t("Support Request Details")}
          </ThemedText>
          <ThemedText style={styles.unionSupportText}>
            {t("Order Number")}: {orderNumber}
          </ThemedText>
          <ThemedText style={styles.unionSupportText}>
            {t("Issue Details")}: {issueDetails}
          </ThemedText>
          <ThemedText style={styles.unionSupportMessage}>
            {t(
              "Our customer care representative will contact you soon regarding your issue.",
            )}
          </ThemedText>
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

const RouteInfoItem = ({
  icon,
  text,
  iconColor,
}: {
  icon: string;
  text?: string;
  iconColor: string;
}) => (
  <View style={styles.routeInfoItem}>
    <Ionicons name={icon as any} size={24} color={iconColor} />
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
  reviewMessage: {
    fontSize: Sizes.textMedium,
    textAlign: "center",
    marginTop: Sizes.marginMedium,
    marginHorizontal: Sizes.marginLarge,
    fontStyle: "italic",
  },
  unionSupportContainer: {
    marginTop: Sizes.marginLarge,
    alignItems: "flex-start",
    width: "100%",
  },
  unionSupportTitle: {
    fontSize: Sizes.textLarge,
    fontWeight: "bold",
    marginBottom: Sizes.marginMedium,
  },
  unionSupportText: {
    fontSize: Sizes.textMedium,
    marginBottom: Sizes.marginSmall,
  },
  unionSupportMessage: {
    fontSize: Sizes.textMedium,
    fontStyle: "italic",
    marginTop: Sizes.marginMedium,
  },
});
