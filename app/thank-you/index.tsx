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

const ThankYou = () => {
  const { message } = useLocalSearchParams<{ message: string }>();
  return (
    <View style={styles.container}>
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
      <Text style={styles.heading}>{t("Thank You")}</Text>
      <Text style={styles.message}>{t(message)}</Text>
      <Button
        title={t("Continue Shopping")}
        variant="primary"
        size="medium"
        onPress={() => router.push("/")}
        style={{ marginTop: Sizes.marginLarge }}
      />
    </View>
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
