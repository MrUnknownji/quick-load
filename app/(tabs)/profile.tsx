import React from "react";
import Profile from "../profile";
import { ThemedView } from "@/components/ThemedView";
import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import Colors from "@/constants/Colors";

const ProfileTab = () => {
  return (
    <SafeAreaWrapper bgColor={Colors.light.primary}>
      <ThemedView style={{ flex: 1 }}>
        <Profile />
      </ThemedView>
    </SafeAreaWrapper>
  );
};

export default ProfileTab;
