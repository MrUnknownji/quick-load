import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import Sizes from "@/constants/Sizes";
import { CAROUSEL_IMAGES } from "@/assets/data/DATA";
import { Image } from "expo-image";
import { responsive, vw, vh } from "@/utils/responsive";
import FlexibleSkeleton from "@/components/Loading/FlexibleSkeleton";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  SharedValue,
} from "react-native-reanimated";

interface ItemCardProps {
  item: { uri: string };
  index: number;
  animationValue: SharedValue<number>;
}

const { width: screenWidth } = Dimensions.get("window");
const CARD_WIDTH = screenWidth - Sizes.marginHorizontal * 2;
const CARD_HEIGHT = vh(25);

const ImageCarousel: React.FC = () => {
  const renderItem = ({ item, index, animationValue }: ItemCardProps) => {
    return (
      <ItemCard item={item} index={index} animationValue={animationValue} />
    );
  };

  return (
    <View style={styles.carouselContainer}>
      <Carousel
        data={CAROUSEL_IMAGES}
        loop
        autoPlay
        renderItem={renderItem}
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        scrollAnimationDuration={3000}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.95,
          parallaxScrollingOffset: 50,
          parallaxAdjacentItemScale: 0.8,
        }}
      />
    </View>
  );
};

const ItemCard: React.FC<ItemCardProps> = ({ item, index, animationValue }) => {
  const [isLoading, setIsLoading] = useState(true);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [-CARD_WIDTH * 0.3, 0, CARD_WIDTH * 0.3],
      Extrapolation.CLAMP,
    );

    const scale = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [0.82, 1, 0.82],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      animationValue.value,
      [-1, -0.5, 0, 0.5, 1],
      [0.7, 0.9, 1, 0.9, 0.7],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ translateX }, { scale }],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.itemCardContainer, animatedStyle]}>
      {isLoading && (
        <FlexibleSkeleton
          width="100%"
          height="100%"
          borderRadius={Sizes.borderRadiusLarge}
          style={styles.skeleton}
        />
      )}
      <Image
        source={{ uri: item.uri }}
        style={[styles.image, isLoading && styles.hiddenImage]}
        contentFit="cover"
        onLoadEnd={() => setIsLoading(false)}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  itemCardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: responsive(Sizes.borderRadiusLarge),
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  hiddenImage: {
    opacity: 0,
  },
  skeleton: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default ImageCarousel;
