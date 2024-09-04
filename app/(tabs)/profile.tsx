import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import SmallListItem from "@/components/list-items/SmallListItem";
import { Image } from "expo-image";
import Sizes from "@/constants/Sizes";
import Colors from "@/constants/Colors";
import { router } from "expo-router";

const { width: screenWidth } = Dimensions.get("window");

const Profile = () => {
  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Text style={styles.profileHeading}>Username</Text>
      </View>
      <View style={styles.profileDetails}>
        <View style={styles.userImageContainer}>
          <Image
            source={"https://placehold.co/200x200?text=User"}
            style={styles.userImage}
          />
        </View>
        <View style={styles.userDetailsContainer}>
          <SmallListItem
            title="My Information"
            iconName="person"
            onPress={() =>
              router.push({
                pathname: "/my-information/[userId]",
                params: { userId: "user23432" },
              })
            }
          />
          <SmallListItem
            title="Subscription"
            iconName="card"
            onPress={() => router.push("/subscription")}
          />
          <SmallListItem title="Orders" iconName="cart" />
          <SmallListItem
            title="Union Support"
            iconName="heart"
            onPress={() => router.push("/union-support")}
          />
          <SmallListItem title="Settings" iconName="settings" />
          <SmallListItem
            title="Privacy and policy"
            iconName="information-circle"
          />
          <SmallListItem title="Logout" iconName="log-out" />
        </View>
      </View>
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
    backgroundColor: "white",
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
    marginTop: 50,
  },
});
