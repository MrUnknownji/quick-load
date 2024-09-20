import { ActivityIndicator, StyleSheet } from "react-native";
import React from "react";
import { ThemedView } from "./ThemedView";

const Loading = () => {
  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <ActivityIndicator size="large" color="primary" />
    </ThemedView>
  );
};

export default Loading;

const styles = StyleSheet.create({});
