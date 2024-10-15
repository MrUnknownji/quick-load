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
import { responsive, vw, vh } from "@/utils/responsive";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThankYou = () => {
  const {
    message,
    type,
    from,
    to,
    vehicle,
    orderNumber,
    issueDetails,
    loginAgain,
  } = useLocalSearchParams<{
    message: string;
    type?: string;
    from?: string;
    to?: string;
    vehicle?: string;
    orderNumber?: string;
    issueDetails?: string;
    loginAgain?: string;
  }>();

  const iconColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.light.secondary },
    "text",
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    await AsyncStorage.removeItem("userId");
    await AsyncStorage.removeItem("user");
    router.replace("/authentication");
  };

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
        title={loginAgain === "true" ? t("Plese login") : t("Back to Home")}
        variant="primary"
        size="medium"
        onPress={() => {
          if (loginAgain === "true") {
            handleLogout();
          } else {
            router.replace("/(tabs)/");
          }
        }}
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
    <Ionicons name={icon as any} size={responsive(24)} color={iconColor} />
    <ThemedText style={styles.routeInfoText}>{text}</ThemedText>
  </View>
);

export default ThankYou;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: responsive(Sizes.paddingLarge),
  },
  backButton: {
    position: "absolute",
    left: responsive(Sizes.marginHorizontal),
    top: responsive((Sizes.StatusBarHeight ?? 0) + 10),
    borderRadius: responsive(Sizes.borderRadiusFull),
  },
  animation: {
    width: responsive(200),
    height: responsive(200),
  },
  heading: {
    fontSize: responsive(Sizes.textExtraLarge),
    fontWeight: "bold",
    textAlign: "center",
    marginTop: responsive(Sizes.marginLarge),
  },
  message: {
    fontSize: responsive(Sizes.textMedium),
    textAlign: "center",
    marginTop: responsive(Sizes.marginMedium),
    marginHorizontal: responsive(Sizes.marginLarge),
  },
  routeInfoContainer: {
    marginTop: responsive(Sizes.marginLarge),
    alignItems: "center",
    width: "100%",
  },
  routeInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: responsive(Sizes.marginSmall),
  },
  routeInfoText: {
    fontSize: responsive(Sizes.textMedium),
    marginLeft: responsive(Sizes.marginSmall),
  },
  button: {
    marginTop: responsive(Sizes.marginLarge),
    width: vw(90),
  },
  reviewMessage: {
    fontSize: responsive(Sizes.textMedium),
    textAlign: "center",
    marginTop: responsive(Sizes.marginMedium),
    marginHorizontal: responsive(Sizes.marginLarge),
    fontStyle: "italic",
  },
  unionSupportContainer: {
    marginTop: responsive(Sizes.marginLarge),
    alignItems: "flex-start",
    width: "100%",
  },
  unionSupportTitle: {
    fontSize: responsive(Sizes.textLarge),
    fontWeight: "bold",
    marginBottom: responsive(Sizes.marginMedium),
  },
  unionSupportText: {
    fontSize: responsive(Sizes.textMedium),
    marginBottom: responsive(Sizes.marginSmall),
  },
  unionSupportMessage: {
    fontSize: responsive(Sizes.textMedium),
    fontStyle: "italic",
    marginTop: responsive(Sizes.marginMedium),
  },
});
