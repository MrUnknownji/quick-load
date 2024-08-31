import { Platform, StatusBar, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export default function ThemedHeader({ heading }: { heading: string }) {
  return (
    <ThemedView style={styles.headingContainer}>
      <ThemedText style={styles.heading}>{heading}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  headingContainer: {
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) + 5 : 5,
    paddingBottom: 10,
    shadowColor: "#000000",
    shadowOffset: {
      width: 2,
      height: 5,
    },
    shadowOpacity: 0.5,
  },
});
