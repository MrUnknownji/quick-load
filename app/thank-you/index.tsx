import { StyleSheet, View } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { Text } from "react-native";
import Sizes from "@/constants/Sizes";
import IconButton from "@/components/button/IconButton";
import Colors from "@/constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import Button from "@/components/button/Button";
import { t } from "i18next";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const ThankYou = () => {
  const { message } = useLocalSearchParams<{ message: string }>();
  return (
    <ThemedView style={styles.container}>
      <IconButton
        iconName="chevron-back"
        size="small"
        variant="primary"
        style={{
          position: "absolute",
          left: Sizes.marginHorizontal,
          top: Sizes.searchBarHeight,
          borderRadius: Sizes.borderRadiusFull,
        }}
        iconStyle={{ color: Colors.light.background }}
        onPress={() => router.back()}
      />
      <Image source={require("@/assets/images/icon.png")} style={styles.icon} />
      <ThemedText style={styles.heading}>{t("Thank You")}</ThemedText>
      <ThemedText style={styles.message}>{t(message)}</ThemedText>
      <Button
        title={t("Continue Shopping")}
        variant="primary"
        size="medium"
        onPress={() => router.dismissAll()}
        style={{ marginTop: Sizes.marginLarge }}
      />
    </ThemedView>
  );
};

export default ThankYou;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 200,
    height: 200,
  },
  heading: {
    fontSize: Sizes.textLarge,
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
});
