import React, { useCallback } from "react";
import { FlatList, StyleSheet, Text, View, ListRenderItem } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Sizes from "@/constants/Sizes";
import Colors from "@/constants/Colors";
import IconButton from "@/components/button/IconButton";
import Button from "@/components/button/Button";
import { t } from "i18next";
import { ThemedView } from "@/components/ThemedView";
import { responsive, vw, vh } from "@/utils/responsive";

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
        snapToInterval={vw(85) + responsive(Sizes.marginSmall * 2)}
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
  },
  backButton: {
    position: "absolute",
    left: responsive(Sizes.marginHorizontal),
    top: responsive(Sizes.StatusBarHeight ?? 0 + Sizes.marginMedium),
    borderRadius: responsive(Sizes.borderRadiusFull),
    zIndex: 1,
  },
  image: {
    alignSelf: "center",
    marginTop: responsive(100),
    width: responsive(150),
    height: responsive(150),
  },
  flatListContent: {
    paddingHorizontal: responsive(Sizes.marginMedium),
  },
  itemDetailsContainer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: responsive(Sizes.paddingMedium),
    marginVertical: responsive(Sizes.marginMedium),
    marginHorizontal: responsive(Sizes.marginSmall),
    borderRadius: responsive(Sizes.borderRadiusLarge),
    height: responsive(360),
    width: vw(85),
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: responsive(2) },
    shadowOpacity: 0.1,
    shadowRadius: responsive(4),
  },
  itemHeading: {
    fontSize: responsive(Sizes.textLarge),
    fontWeight: "bold",
    marginBottom: responsive(Sizes.marginSmall),
  },
  itemPrice: {
    fontSize: responsive(Sizes.textMedium),
    fontWeight: "bold",
    marginBottom: responsive(Sizes.marginSmall),
  },
  itemDuration: {
    fontSize: responsive(Sizes.textSmall),
    fontWeight: "normal",
  },
  itemFeaturesContainer: {
    width: "100%",
    marginBottom: responsive(Sizes.marginMedium),
  },
  itemFeature: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: responsive(Sizes.marginExtraSmall),
  },
  itemFeatureText: {
    fontSize: responsive(Sizes.textSmall),
    marginLeft: responsive(Sizes.marginSmall),
  },
  subscribeButton: {
    width: "100%",
  },
});

export default Subscription;
