import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import FlexibleSkeleton from "./FlexibleSkeleton";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const OnboardingImageSkeleton = () => {
  return (
    <View style={styles.container}>
      <FlexibleSkeleton width={screenWidth} height={screenHeight} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OnboardingImageSkeleton;
