import React from "react";
import { Animated, StyleSheet } from "react-native";
import { Image } from "expo-image";
import Sizes from "@/constants/Sizes";

type LargeImageViewProps = {
  animationValue?: Animated.Value;
  imageUrl: string;
  style?: any;
};

const LargeImageView = ({
  animationValue,
  imageUrl,
  style,
}: LargeImageViewProps) => {
  return (
    <Animated.View
      style={[
        styles.container,
        animationValue && { transform: [{ scale: animationValue }] },
        style,
      ]}
    >
      <Image source={imageUrl} style={styles.image} />
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
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
