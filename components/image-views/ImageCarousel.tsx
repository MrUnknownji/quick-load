// import React from "react";
// import { View, StyleSheet } from "react-native";
// import Carousel, { ParallaxImage } from "react-native-snap-carousel";
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from "react-native-responsive-screen";
// import Sizes from "@/constants/Sizes";
// import { CAROUSEL_IMAGES } from "@/assets/data/DATA";

// interface ItemCardProps {
//   item: { uri: string };
//   index: number;
//   parallaxProps?: any;
// }

// const ImageCarousel: React.FC = () => {
//   const renderItem = ({
//     item,
//     index,
//     parallaxProps,
//   }: {
//     item: { uri: string };
//     index: number;
//     parallaxProps?: any;
//   }) => {
//     return <ItemCard item={item} index={index} parallaxProps={parallaxProps} />;
//   };

//   return (
//     <Carousel
//       data={CAROUSEL_IMAGES}
//       loop={true}
//       autoplay={true}
//       renderItem={renderItem}
//       hasParallaxImages={true}
//       sliderWidth={wp(100)}
//       firstItem={1}
//       autoplayInterval={4000}
//       itemWidth={wp(100) - Sizes.marginHorizontal * 2}
//       slideStyle={{
//         display: "flex",
//         alignItems: "center",
//       }}
//     />
//   );
// };

// const ItemCard: React.FC<ItemCardProps> = ({ item, parallaxProps }) => {
//   return (
//     <View
//       style={{ width: wp(100) - Sizes.marginHorizontal * 2, height: hp(25) }}
//     >
//       <ParallaxImage
//         source={{ uri: item.uri }}
//         containerStyle={styles.imageContainer}
//         style={styles.image}
//         parallaxFactor={0.4} // Adjust this value as needed
//         {...parallaxProps}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   imageContainer: {
//     borderRadius: Sizes.borderRadiusLarge,
//     overflow: "hidden", // Make sure the image doesn't overflow the container
//     flex: 1,
//   },
//   image: {
//     resizeMode: "cover", // Change 'contain' to 'cover' if you want the image to fill the container
//     width: "100%",
//     height: "100%",
//   },
// });

// export default ImageCarousel;
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
