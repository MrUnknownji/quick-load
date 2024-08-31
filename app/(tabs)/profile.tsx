import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ThemedText } from "@/components/ThemedText";
import ThemedHeader from "@/components/ThemedHeader";

const Profile = () => {
  return (
    <View>
      <ThemedHeader heading="Profile" />
      <ThemedText>Profile</ThemedText>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});
