import React from "react";
import Profile from "../profile";
import { ThemedView } from "@/components/ThemedView";

const ProfileTab = () => {
  return (
    <ThemedView style={{ flex: 1 }}>
      <Profile />
    </ThemedView>
  );
};

export default ProfileTab;
