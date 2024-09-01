// import React, { memo } from "react";
// import { Pressable, StyleSheet, Text, View } from "react-native";
// import { Image } from "expo-image";
// import { MaterialIcons } from "@expo/vector-icons";
// import { Colors } from "@/constants/Colors";
// import { ListItemProps } from "@/assets/types/types";

// const ListItem: React.FC<ListItemProps> = memo(
//   ({ heading, price, location, rating, mesurementType = "qui" }) => (
//     <View style={styles.container}>
//       <View style={styles.imageContainer}>
//         <Image
//           source={`https://placehold.co/150x150?text=${heading}`}
//           style={styles.image}
//           contentFit="cover"
//         />
//       </View>
//       <View style={styles.contentContainer}>
//         <View style={styles.detailsContainer}>
//           <Text style={styles.listHeading}>{heading}</Text>
//           <Text style={styles.priceText}>
//             Rs. {price}
//             <Text style={styles.perPieceText}>/{mesurementType}</Text>
//           </Text>
//           <View style={styles.infoContainer}>
//             <MaterialIcons
//               name="location-on"
//               size={16}
//               color={Colors.light.text}
//             />
//             <Text style={styles.infoText}>{location}</Text>
//           </View>
//           <View style={styles.infoContainer}>
//             <MaterialIcons name="star" size={16} color={Colors.light.primary} />
//             <Text style={styles.infoText}>{rating}</Text>
//           </View>
//         </View>
//         <Pressable style={styles.buyNowButton}>
//           <Text style={styles.buttonText}>Buy Now</Text>
//         </Pressable>
//       </View>
//     </View>
//   )
// );

// export default ListItem;

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "row",
//     backgroundColor: "#EFF6FF",
//     marginVertical: 10,
//     borderRadius: 10,
//     padding: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   imageContainer: {
//     width: 140,
//     aspectRatio: 1,
//     borderRadius: 10,
//     overflow: "hidden",
//   },
//   image: {
//     width: "100%",
//     height: "100%",
//   },
//   contentContainer: {
//     flex: 1,
//     marginLeft: 10,
//     justifyContent: "space-between",
//   },
//   detailsContainer: {
//     gap: 4,
//   },
//   listHeading: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: Colors.light.text,
//   },
//   priceText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: Colors.light.primary,
//   },
//   perPieceText: {
//     fontSize: 14,
//     fontWeight: "normal",
//   },
//   infoContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   infoText: {
//     fontSize: 14,
//     marginLeft: 4,
//     color: Colors.light.text,
//   },
//   buyNowButton: {
//     backgroundColor: Colors.light.primary,
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 8,
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
// });
import React, { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import Sizes from "@/constants/Sizes";
import { ListItemProps } from "@/constants/types/types";
import Colors from "@/constants/Colors";

const ListItem: React.FC<ListItemProps> = memo(
  ({ heading, price, location, rating, mesurementType = "qui" }) => {
    const backgroundColor = useThemeColor(
      {
        light: Colors.light.cardBackground,
        dark: Colors.dark.cardBackground,
      },
      "backgroundSecondary"
    );
    const textColor = useThemeColor(
      { light: Colors.light.text, dark: Colors.dark.text },
      "text"
    );
    const primaryColor = useThemeColor(
      { light: Colors.light.primary, dark: Colors.dark.primary },
      "primary"
    );
    const shadowColor = useThemeColor(
      { light: Colors.light.shadow, dark: Colors.dark.shadow },
      "shadow"
    );

    return (
      <View style={[styles.container, { backgroundColor, shadowColor }]}>
        <View style={styles.imageContainer}>
          <Image
            source={`https://placehold.co/150x150?text=${heading}`}
            style={styles.image}
            contentFit="cover"
          />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.detailsContainer}>
            <Text style={[styles.listHeading, { color: textColor }]}>
              {heading}
            </Text>
            <Text style={[styles.priceText, { color: primaryColor }]}>
              Rs. {price}
              <Text style={styles.perPieceText}>/{mesurementType}</Text>
            </Text>
            <View style={styles.infoContainer}>
              <MaterialIcons
                name="location-on"
                size={Sizes.iconExtraSmall}
                color={textColor}
              />
              <Text style={[styles.infoText, { color: textColor }]}>
                {location}
              </Text>
            </View>
            <View style={styles.infoContainer}>
              <MaterialIcons
                name="star"
                size={Sizes.iconExtraSmall}
                color={primaryColor}
              />
              <Text style={[styles.infoText, { color: textColor }]}>
                {rating}
              </Text>
            </View>
          </View>
          <Pressable
            style={[styles.buyNowButton, { backgroundColor: primaryColor }]}
          >
            <Text style={styles.buttonText}>Buy Now</Text>
          </Pressable>
        </View>
      </View>
    );
  }
);

export default ListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: Sizes.marginSmall,
    borderRadius: Sizes.borderRadius,
    padding: Sizes.paddingMedium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: Sizes.cardHeight,
    aspectRatio: 1,
    borderRadius: Sizes.borderRadius,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    flex: 1,
    marginLeft: Sizes.marginMedium,
    justifyContent: "space-between",
  },
  detailsContainer: {
    gap: Sizes.marginExtraSmall,
  },
  listHeading: {
    fontSize: Sizes.textLarge,
    fontWeight: "bold",
  },
  priceText: {
    fontSize: Sizes.textMedium,
    fontWeight: "bold",
  },
  perPieceText: {
    fontSize: Sizes.textSmall,
    fontWeight: "normal",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: Sizes.textSmall,
    marginLeft: Sizes.marginSmall,
  },
  buyNowButton: {
    paddingVertical: Sizes.paddingSmall,
    borderRadius: Sizes.borderRadiusFull,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Sizes.marginSmall,
  },
  buttonText: {
    color: Colors.light.background,
    fontWeight: "bold",
  },
});
