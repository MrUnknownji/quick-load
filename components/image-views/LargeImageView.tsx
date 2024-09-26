import React from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import Sizes from "@/constants/Sizes";

type LargeImageViewProps = {
  animationValue?: Animated.Value;
  imageUrl: string;
  style?: any;
  height?: number | string;
};

const LargeImageView = ({
  animationValue,
  imageUrl,
  style,
  height,
}: LargeImageViewProps) => {
  return (
    <Animated.View
      style={[
        styles.container,
        animationValue && { transform: [{ scale: animationValue }] },
        style,
        height && { height },
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={imageUrl}
          style={[styles.image, height && { height: "100%" }]}
          contentFit="cover"
        />
      </View>
    </Animated.View>
  );
};

export default LargeImageView;

const styles = StyleSheet.create({
  container: {
    marginVertical: Sizes.marginVertical,
    marginHorizontal: Sizes.marginHorizontal,
    height: Sizes.carouselHeight,
    borderRadius: Sizes.borderRadiusLarge,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "65%",
  },
});
