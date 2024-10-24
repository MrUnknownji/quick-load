import React, { memo, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import Sizes from "@/constants/Sizes";
import { ListItemProps } from "@/types/types";
import Colors from "@/constants/Colors";
import Button from "../button/Button";
import { t } from "i18next";
import { responsive, vw, vh } from "@/utils/responsive";
import FlexibleSkeleton from "@/components/Loading/FlexibleSkeleton";

const LargeListItem: React.FC<ListItemProps> = memo(
  ({
    heading,
    price,
    location,
    totalAmount,
    rating,
    imageUrl,
    measurementType = "Qui.",
    contentFit = "cover",
    onPress,
    buttonTitle,
    style,
  }) => {
    const [isImageLoading, setIsImageLoading] = useState(true);

    useEffect(() => {
      setIsImageLoading(true);
    }, [imageUrl]);

    const backgroundColor = useThemeColor(
      {
        light: Colors.light.cardBackground,
        dark: Colors.dark.backgroundSecondary,
      },
      "backgroundSecondary",
    );
    const textColor = useThemeColor(
      { light: Colors.light.text, dark: Colors.dark.text },
      "text",
    );
    const primaryColor = useThemeColor(
      { light: Colors.light.primary, dark: Colors.dark.secondary },
      "primary",
    );
    const shadowColor = useThemeColor(
      { light: Colors.light.shadow, dark: Colors.dark.shadow },
      "shadow",
    );

    return (
      <Pressable
        onPress={onPress}
        style={[styles.container, { backgroundColor, shadowColor }, style]}
      >
        <View style={styles.imageContainer}>
          {isImageLoading && (
            <FlexibleSkeleton
              width="100%"
              height="100%"
              borderRadius={Sizes.borderRadius}
              style={styles.imageSkeleton}
            />
          )}
          <Image
            source={imageUrl || `https://placehold.co/150x150?text=${heading}`}
            style={[styles.image, isImageLoading && styles.hiddenImage]}
            contentFit={contentFit}
            onLoadEnd={() => setIsImageLoading(false)}
            cachePolicy="none"
            recyclingKey={imageUrl}
          />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.detailsContainer}>
            <Text
              style={[styles.listHeading, { color: textColor }]}
              numberOfLines={2}
            >
              {t(heading)}
            </Text>
            {price && (
              <Text style={[styles.priceText, { color: primaryColor }]}>
                {t("Rs.")} {price}
                <Text style={styles.perPieceText}>/{t(measurementType)}</Text>
              </Text>
            )}
            {location && (
              <View style={styles.infoContainer}>
                <MaterialIcons
                  name="location-on"
                  size={Sizes.icon["extraSmall"]}
                  color={textColor}
                />
                <Text
                  style={[styles.infoText, { color: textColor }]}
                  numberOfLines={1}
                >
                  {location}
                </Text>
              </View>
            )}
            {rating !== undefined && (
              <View style={styles.infoContainer}>
                <MaterialIcons
                  name="star"
                  size={Sizes.icon["extraSmall"]}
                  color={primaryColor}
                />
                <Text style={[styles.infoText, { color: textColor }]}>
                  {rating.toFixed(1)}
                </Text>
              </View>
            )}
            {totalAmount && (
              <View style={styles.totalContainer}>
                <Text style={[styles.totalText, { color: textColor }]}>
                  {t("Total")}: {totalAmount}
                </Text>
              </View>
            )}
          </View>
          {buttonTitle && (
            <Button
              title={buttonTitle}
              variant="primary"
              size="small"
              onPress={onPress}
            />
          )}
        </View>
      </Pressable>
    );
  },
);

export default LargeListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: vh(1),
    borderRadius: responsive(Sizes.borderRadius),
    padding: vw(3),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: vw(35),
    aspectRatio: 1,
    borderRadius: responsive(Sizes.borderRadius),
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageSkeleton: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  hiddenImage: {
    opacity: 0,
  },
  contentContainer: {
    flex: 1,
    marginLeft: vw(3),
    justifyContent: "space-between",
  },
  detailsContainer: {
    gap: vh(0.5),
  },
  listHeading: {
    fontSize: responsive(Sizes.textLarge),
    fontWeight: "bold",
  },
  priceText: {
    fontSize: responsive(Sizes.textMedium),
    fontWeight: "bold",
  },
  perPieceText: {
    fontSize: responsive(Sizes.textSmall),
    fontWeight: "normal",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: responsive(Sizes.textSmall),
    marginLeft: vw(1),
  },
  totalContainer: {},
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
