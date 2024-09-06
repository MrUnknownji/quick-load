import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { router, Slot, usePathname } from "expo-router";
import IconButton from "@/components/button/IconButton";
import Colors from "@/constants/Colors";
import Sizes from "@/constants/Sizes";
import { t } from "i18next";

const ProfileLayout = () => {
  const pathname = usePathname();
  const title = pathname.includes("union-support")
    ? "Union Support"
    : "Profile";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          iconName="chevron-back"
          size="medium"
          variant="transparent"
          style={{ position: "absolute", left: Sizes.marginHorizontal }}
          iconStyle={{ color: Colors.light.background }}
          onPress={() => router.back()}
        />
        <Text style={styles.headerText}>{t(title)}</Text>
      </View>
      <View style={styles.content}>
        <Slot />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Sizes.StatusBarHeight,
    backgroundColor: Colors.light.primary,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: Sizes.marginMedium,
    paddingVertical: Sizes.paddingSmall,
    paddingHorizontal: Sizes.paddingMedium,
  },
  headerText: {
    textAlign: "center",
    fontSize: Sizes.textMedium,
    fontWeight: "bold",
    color: Colors.light.background,
  },
  content: {
    flex: 1,
    marginTop: 100,
    padding: Sizes.paddingMedium,
    backgroundColor: "white",
    borderTopLeftRadius: Sizes.borderRadiusLarge,
    borderTopRightRadius: Sizes.borderRadiusLarge,
    elevation: 3,
  },
});

export default ProfileLayout;
