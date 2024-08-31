import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ThemedText } from "@/components/ThemedText";
import ThemedHeader from "@/components/ThemedHeader";

const Transport = () => {
  return (
    <View>
      <ThemedHeader heading="Transport" />
      <ThemedText>Transport</ThemedText>
    </View>
  );
};

export default Transport;

const styles = StyleSheet.create({});
