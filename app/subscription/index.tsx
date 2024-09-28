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
  const renderItem = useCallback<ListRenderItem<SubscriptionType>>(
    ({ item }) => <SubscriptionItem item={item} />,
    [],
  );

  return (
    <ThemedView style={styles.container}>
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
        keyExtractor={(item) => item.heading}
        showsHorizontalScrollIndicator={false}
        snapToInterval={screenWidth - 55}
        decelerationRate="fast"
        contentContainerStyle={styles.flatListContent}
      />
    </ThemedView>
  );
};

const SubscriptionItem: React.FC<{ item: SubscriptionType }> = React.memo(
  ({ item }) => {
    const textColor = item.active ? "white" : Colors.light.text;
    const backgroundColor = item.active ? Colors.light.primary : "white";

    return (
      <View style={[styles.itemDetailsContainer, { backgroundColor }]}>
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
                color={
                  item.features.includes(feature)
                    ? Colors.light.success
                    : Colors.light.error
                }
              />
              <Text style={[styles.itemFeatureText, { color: textColor }]}>
                {t(feature)}
              </Text>
            </View>
          ))}
        </View>
        <Button
          title={item.active ? t("Current Plan") : t("Subscribe")}
          variant={item.active ? "outlined" : "primary"}
          size="medium"
          style={[styles.subscribeButton, { borderColor: textColor }]}
          textStyle={{ color: item.active ? textColor : "white" }}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Sizes.StatusBarHeight,
  },
  backButton: {
    position: "absolute",
    left: Sizes.marginHorizontal,
    top: Sizes.StatusBarHeight ?? 0 + Sizes.marginMedium,
    borderRadius: Sizes.borderRadiusFull,
    zIndex: 1,
  },
  image: {
    alignSelf: "center",
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
    padding: Sizes.paddingMedium,
    marginVertical: Sizes.marginMedium,
    marginHorizontal: Sizes.marginSmall,
    borderRadius: Sizes.borderRadiusLarge,
    height: 360,
    width: screenWidth - 75,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemHeading: {
    fontSize: Sizes.textLarge,
    fontWeight: "bold",
    marginBottom: Sizes.marginSmall,
  },
  itemPrice: {
    fontSize: Sizes.textMedium,
    fontWeight: "bold",
    marginBottom: Sizes.marginSmall,
  },
  itemDuration: {
    fontSize: Sizes.textSmall,
    fontWeight: "normal",
  },
  itemFeaturesContainer: {
    width: "100%",
    marginBottom: Sizes.marginMedium,
  },
  itemFeature: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Sizes.marginExtraSmall,
  },
  itemFeatureText: {
    fontSize: Sizes.textSmall,
    marginLeft: Sizes.marginSmall,
  },
  subscribeButton: {
    width: "100%",
  },
});

export default Subscription;
