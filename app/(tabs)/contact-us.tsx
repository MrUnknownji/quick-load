import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import ThemedHeader from "@/components/ThemedHeader";

const ContactUs = () => {
  return (
    <View>
      <ThemedHeader heading="Contact Us" />
      <ThemedText>contact-us</ThemedText>
    </View>
  );
};

export default ContactUs;

const styles = StyleSheet.create({});
