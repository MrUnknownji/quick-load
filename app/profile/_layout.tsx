import React from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { router, Slot, usePathname } from "expo-router";
import IconButton from "@/components/button/IconButton";
import Colors from "@/constants/Colors";
import Sizes from "@/constants/Sizes";
import { t } from "i18next";
import { ThemedView } from "@/components/ThemedView";
import { responsive } from "@/utils/responsive";
import SafeAreaWrapper from "@/components/SafeAreaWrapper";

const ProfileLayout = () => {
  const pathname = usePathname();
  const title = pathname.includes("union-support")
    ? "Union Support"
    : pathname.includes("language")
      ? "Language"
      : pathname.includes("add-vehicles")
        ? "Add Vehicles"
        : pathname.includes("vehicles")
          ? "Vehicles"
          : pathname.includes("my-information")
            ? "My Information"
            : pathname.includes("settings")
              ? "Settings"
              : pathname.includes("privacy-and-policy")
                ? "Privacy and Policy"
                : pathname.includes("my-products")
                  ? "My Products"
                  : pathname.includes("my-shop")
                    ? "My Shop"
                    : "Profile";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          iconName="chevron-back"
          size="medium"
          variant="transparent"
          style={{
            position: "absolute",
            left: responsive(Sizes.marginHorizontal),
          }}
          iconStyle={{ color: Colors.light.background }}
          onPress={() => router.back()}
        />
        <Text style={styles.headerText}>{t(title)}</Text>
      </View>
      <ThemedView style={styles.content}>
        <Slot />
      </ThemedView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.primary,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: responsive(Sizes.marginMedium),
    paddingVertical: StatusBar.currentHeight,
  },
  headerText: {
    textAlign: "center",
    fontSize: responsive(Sizes.textMedium),
    fontWeight: "bold",
    color: Colors.light.background,
  },
  content: {
    flex: 1,
    marginTop: responsive(100),
    padding: responsive(Sizes.paddingMedium),
    borderTopLeftRadius: responsive(Sizes.borderRadiusLarge),
    borderTopRightRadius: responsive(Sizes.borderRadiusLarge),
    elevation: 3,
  },
});

export default ProfileLayout;
