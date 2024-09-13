import React, { useCallback } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  ListRenderItem,
} from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import Sizes from "@/constants/Sizes";
import Colors from "@/constants/Colors";
import IconButton from "@/components/button/IconButton";
import Button from "@/components/button/Button";
import { t } from "i18next";
import { ThemedView } from "@/components/ThemedView";

const { width: screenWidth } = Dimensions.get("window");

type SubscriptionType = {
  heading: string;
  price: number;
  duration: string;
  features: string[];
  active: boolean;
};

const ALL_FEATURES: string[] = [
  "High Quality Products",
  "Unlimited Products",
  "No Ads",
  "Fast Delivery",
  "Cash On delivery",
  "Free Shipping",
  "Priority Customer Support",
];

const SUBSCRIPTION_TYPES: SubscriptionType[] = [
  {
    heading: "Free",
    price: 0,
    duration: "Monthly",
    features: ["High Quality Products", "Unlimited Products"],
    active: true,
  },
  {
    heading: "Basic",
    price: 499,
    duration: "Monthly",
    features: ["High Quality Products", "Unlimited Products", "No Ads"],
    active: false,
  },
  {
    heading: "Premium",
    price: 1499,
    duration: "Monthly",
    features: [
      "High Quality Products",
      "Unlimited Products",
      "No Ads",
      "Fast Delivery",
      "Cash On delivery",
    ],
    active: false,
  },
  {
    heading: "Ultra",
    price: 2499,
    duration: "Monthly",
    features: ALL_FEATURES,
    active: false,
  },
];

const Subscription: React.FC = () => {
  const renderItem: ListRenderItem<SubscriptionType> = useCallback(
    ({ item }) => <SubscriptionItem item={item} />,
    []
  );

  const keyExtractor = useCallback(
    (item: SubscriptionType) => item.heading,
    []
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <IconButton
          iconName="chevron-back"
          size="small"
          variant="primary"
          style={styles.backButton}
          iconStyle={{ color: Colors.light.background }}
          onPress={() => router.back()}
        />
        <Image
          source={require("@/assets/images/icon.png")}
          style={styles.image}
        />
        <FlatList
          horizontal
          data={SUBSCRIPTION_TYPES}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsHorizontalScrollIndicator={false}
          snapToInterval={screenWidth - 55}
          decelerationRate="fast"
          contentContainerStyle={styles.flatListContent}
        />
      </ThemedView>
    </ThemedView>
  );
};

const SubscriptionItem: React.FC<{ item: SubscriptionType }> = React.memo(
  ({ item }) => {
    const textColor = item.active ? "white" : "black";

    return (
      <View
        style={[
          styles.itemDetailsContainer,
          { backgroundColor: item.active ? Colors.light.primary : "white" },
        ]}
      >
        <Text style={[styles.itemHeading, { color: textColor }]}>
          {t(item.heading)}
        </Text>
        <Text style={[styles.itemPrice, { color: textColor }]}>
          {item.price}/
          <Text style={[styles.itemDuration, { color: textColor }]}>
            {t(item.duration)}
          </Text>
        </Text>
        <View style={styles.itemFeaturesContainer}>
          {ALL_FEATURES.map((feature, index) => (
            <View style={styles.itemFeature} key={index}>
              <Ionicons
                name={
                  item.features.includes(feature)
                    ? "checkmark-circle"
                    : "close-circle"
                }
                size={Sizes.icon.small}
                color={textColor}
              />
              <Text style={[styles.itemFeatureText, { color: textColor }]}>
                {t(feature)}
              </Text>
            </View>
          ))}
        </View>
        <Button
          title={item.active ? "Already Subscribed" : "Subscribe"}
          variant={item.active ? "outlined" : "primary"}
          size="medium"
          style={[styles.subscribeButton, { borderColor: textColor }]}
          textStyle={{ color: "white" }}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: Sizes.StatusBarHeight,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: Sizes.marginHorizontal,
    top: Sizes.searchBarHeight,
    borderRadius: Sizes.borderRadiusFull,
  },
  image: {
    marginTop: 100,
    width: 150,
    height: 150,
  },
  flatListContent: {
    paddingHorizontal: Sizes.marginMedium,
  },
  itemDetailsContainer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingHorizontal: Sizes.paddingMedium,
    paddingVertical: Sizes.paddingMedium,
    marginVertical: Sizes.marginMedium,
    marginHorizontal: Sizes.marginSmall,
    borderRadius: Sizes.borderRadiusLarge,
    width: screenWidth - 75,
    elevation: 3,
    gap: Sizes.marginExtraSmall,
  },
  itemHeading: {
    marginLeft: Sizes.marginExtraSmall,
    fontSize: Sizes.textLarge,
    fontWeight: "bold",
  },
  itemPrice: {
    marginLeft: Sizes.marginExtraSmall,
    fontSize: Sizes.textMedium,
    fontWeight: "bold",
  },
  itemDuration: {
    fontSize: Sizes.textSmall,
    fontWeight: "normal",
  },
  itemFeaturesContainer: {
    flexDirection: "column",
  },
  itemFeature: {
    flexDirection: "row",
    alignItems: "center",
    gap: Sizes.marginSmall,
    width: "100%",
  },
  itemFeatureText: {
    fontSize: Sizes.textSmall,
    fontWeight: "normal",
  },
  subscribeButton: {
    width: "100%",
    marginTop: Sizes.marginSmall,
  },
});

export default Subscription;
