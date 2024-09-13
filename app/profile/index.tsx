import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import SmallListItem from "@/components/list-items/SmallListItem";
import { Image } from "expo-image";
import Sizes from "@/constants/Sizes";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import { t } from "i18next";
import LogoutDialog from "@/components/popups/LogoutDialog";
import LanguageDialog from "@/components/popups/LanguageDialog";
import AccountDeleteDialog from "@/components/popups/AccountDeleteDialog";
import { ThemedView } from "@/components/ThemedView";

const { width: screenWidth } = Dimensions.get("window");

const Profile = () => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const handleLogout = () => {
    console.log("Logging out...");
    setIsDialogVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Text style={styles.profileHeading}>{t("Username")}</Text>
      </View>
      <ThemedView style={styles.profileDetails}>
        <View style={styles.userImageContainer}>
          <Image
            source={"https://placehold.co/200x200?text=User"}
            style={styles.userImage}
          />
        </View>
        <ThemedView style={styles.userDetailsContainer}>
          <SmallListItem
            title={t("My Information")}
            iconName="person"
            onPress={() =>
              router.push({
                pathname: "/profile/my-information/[userId]",
                params: { userId: "user23432" },
              })
            }
          />
          <SmallListItem
            title={t("Subscription")}
            iconName="card"
            onPress={() => router.push("/subscription")}
          />
          <SmallListItem
            title={t("Admin Dashboard")}
            iconName="person"
            onPress={() => router.push("/admin")}
          />
          <SmallListItem
            title={t("My Vehicles")}
            iconName="car"
            onPress={() => router.push("/profile/vehicles")}
          />
          <SmallListItem
            title={t("Union Support")}
            iconName="heart"
            onPress={() => router.push("/profile/union-support")}
          />
          <SmallListItem
            title={t("Settings")}
            iconName="settings"
            onPress={() => router.push("/profile/settings")}
          />
          <SmallListItem
            title={t("Logout")}
            iconName="log-out"
            onPress={() => setIsDialogVisible(true)}
          />
          <LogoutDialog
            isVisible={isDialogVisible}
            onClose={() => setIsDialogVisible(false)}
            onLogout={handleLogout}
          />
        </ThemedView>
      </ThemedView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Sizes.StatusBarHeight,
    backgroundColor: Colors.light.primary,
  },
  profileHeader: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: Sizes.marginMedium,
    paddingVertical: Sizes.paddingSmall,
    paddingHorizontal: Sizes.paddingMedium,
  },
  profileHeading: {
    textAlign: "center",
    fontSize: Sizes.textMedium,
    fontWeight: "bold",
    color: Colors.light.background,
  },
  profileDetails: {
    marginTop: 100,
    padding: Sizes.paddingMedium,
    borderTopLeftRadius: Sizes.borderRadiusLarge,
    borderTopRightRadius: Sizes.borderRadiusLarge,
    elevation: 3,
    flex: 1,
  },
  userImageContainer: {
    position: "absolute",
    zIndex: 2,
    top: -50,
    width: screenWidth,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: Sizes.borderRadiusFull,
  },
  userDetailsContainer: {
    marginTop: 25,
  },
});
