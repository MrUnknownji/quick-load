import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import Sizes from "@/constants/Sizes";
import { CAROUSEL_IMAGES } from "@/assets/data/DATA";
import { Image } from "expo-image";

interface ItemCardProps {
  item: { uri: string };
  index: number;
}

const { width: screenWidth } = Dimensions.get("window");

const ImageCarousel: React.FC = () => {
  const renderItem = ({
    item,
    index,
  }: {
    item: { uri: string };
    index: number;
  }) => {
    return <ItemCard item={item} index={index} />;
  };

  return (
    <Carousel
      data={CAROUSEL_IMAGES}
      loop={true}
      autoPlay={true}
      renderItem={renderItem}
      width={screenWidth}
      scrollAnimationDuration={4000}
    />
  );
};

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  return (
    <View
      style={{
        width: screenWidth - Sizes.marginHorizontal * 2,
        height: 200,
      }}
    >
      <Image
        source={{ uri: item.uri }}
        style={styles.image}
        contentFit="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    borderRadius: Sizes.borderRadiusLarge,
    overflow: "hidden",
    flex: 1,
  },
  image: {
    resizeMode: "cover",
    width: "100%",
    height: "100%",
    borderRadius: Sizes.borderRadiusLarge,
  },
});

export default ImageCarousel;
