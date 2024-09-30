import React, { useState } from "react";
import {
  Animated,
  StyleSheet,
  View,
  ViewStyle,
  ImageStyle,
} from "react-native";
import { Image } from "expo-image";
import Sizes from "@/constants/Sizes";
import { responsive, vw, vh } from "@/utils/responsive";
import FlexibleSkeleton from "@/components/Loading/FlexibleSkeleton";

type LargeImageViewProps = {
  animationValue?: Animated.Value;
  imageUrl: string;
  style?: ViewStyle;
  height?: number | string;
};

const LargeImageView = ({
  animationValue,
  imageUrl,
  style,
  height,
}: LargeImageViewProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const containerHeight = height
    ? typeof height === "number"
      ? height
      : vh(25)
    : vh(25);

  const imageStyle: ImageStyle = {
    width: "100%",
    height: height ? "100%" : "65%",
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { height: containerHeight },
        animationValue && { transform: [{ scale: animationValue }] },
        style,
      ]}
    >
      <View style={styles.imageContainer}>
        {isLoading && (
          <FlexibleSkeleton
            width="100%"
            height="100%"
            borderRadius={Sizes.borderRadiusLarge}
            style={styles.skeleton}
          />
        )}
        <Image
          source={imageUrl}
          style={[styles.image, imageStyle, isLoading && styles.hiddenImage]}
          contentFit="cover"
          onLoadEnd={() => setIsLoading(false)}
        />
      </View>
    </Animated.View>
  );
};

export default LargeImageView;

const styles = StyleSheet.create({
  container: {
    marginVertical: vh(2),
    marginHorizontal: vw(4),
    borderRadius: responsive(Sizes.borderRadiusLarge),
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
  skeleton: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  hiddenImage: {
    opacity: 0,
  },
});
