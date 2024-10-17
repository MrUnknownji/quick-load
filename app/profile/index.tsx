import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import SmallListItem from "@/components/list-items/SmallListItem";
import { Image } from "expo-image";
import Sizes from "@/constants/Sizes";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import { t } from "i18next";
import LogoutDialog from "@/components/popups/LogoutDialog";
import { ThemedView } from "@/components/ThemedView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { responsive, vw } from "@/utils/responsive";
import { useUser } from "@/hooks/useUser";

const Profile = () => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const { user } = useUser();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    await AsyncStorage.removeItem("userId");
    setIsDialogVisible(false);
    router.replace("/authentication");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("currentUser");
        if (userData) {
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Text style={styles.profileHeading}>
          {user?.firstName || t("Username")}
        </Text>
      </View>
      <ThemedView style={styles.profileDetails}>
        <View style={styles.userImageContainer}>
          <Image
            source={`http://movingrolls.online/assets/default-avatar.png`}
            style={styles.userImage}
          />
        </View>
        <ThemedView style={styles.userDetailsContainer}>
          <SmallListItem
            title={t("My Information")}
            iconName="person"
            onPress={() => router.push("/profile/my-information")}
          />
          {(user?.type === "merchant" ||
            user?.type === "admin" ||
            user?.type === "merchant-driver") && (
            <SmallListItem
              title={t("My Shop")}
              iconName="business"
              onPress={() => router.push("/profile/my-shop")}
            />
          )}
          {(user?.type === "merchant" ||
            user?.type === "admin" ||
            user?.type === "merchant-driver") && (
            <SmallListItem
              title={t("My Products")}
              iconName="cart"
              onPress={() => router.push("/profile/my-products")}
            />
          )}
          {(user?.type === "driver" ||
            user?.type === "admin" ||
            user?.type === "merchant-driver") && (
            <SmallListItem
              title={t("My Vehicles")}
              iconName="car"
              onPress={() => router.push("/profile/vehicles")}
            />
          )}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.primary,
  },
  profileHeader: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: responsive(Sizes.marginMedium),
    paddingBottom: responsive(Sizes.paddingMedium),
    paddingHorizontal: responsive(Sizes.paddingMedium),
  },
  profileHeading: {
    textAlign: "center",
    fontSize: responsive(Sizes.textMedium),
    fontWeight: "bold",
    color: Colors.light.background,
  },
  profileDetails: {
    marginTop: responsive(100),
    padding: responsive(Sizes.paddingMedium),
    borderTopLeftRadius: responsive(Sizes.borderRadiusLarge),
    borderTopRightRadius: responsive(Sizes.borderRadiusLarge),
    elevation: 3,
    flex: 1,
  },
  userImageContainer: {
    position: "absolute",
    zIndex: 2,
    top: responsive(-50),
    width: vw(100),
    height: responsive(100),
    alignItems: "center",
    justifyContent: "center",
  },
  userImage: {
    width: responsive(100),
    height: responsive(100),
    borderRadius: responsive(Sizes.borderRadiusFull),
  },
  userDetailsContainer: {
    marginTop: responsive(25),
  },
});

export default Profile;
