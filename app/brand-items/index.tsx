import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  UIManager,
  View,
  ListRenderItem,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { t } from "i18next";
import { SafeAreaView } from "react-native-safe-area-context";

import LargeListItem from "@/components/list-items/LargeListItem";
import IconButton from "@/components/button/IconButton";
import usePathChangeListener from "@/hooks/usePathChangeListener";
import { Brand, ListItemProps } from "@/types/types";
import {
  BRICKS_BRANDS,
  BAJRI_BRANDS,
  GRIT_BRANDS,
  CEMENT_BRANDS,
  SAND_BRANDS,
  BRICKS_ITEMS,
  BAJRI_ITEMS,
  GRIT_ITEMS,
  CEMENT_ITEMS,
  SAND_ITEMS,
} from "@/assets/data/DATA";
import Sizes from "@/constants/Sizes";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const BrandItems: React.FC = () => {
  const { brandId } = useLocalSearchParams<{ brandId: string }>();
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const categoriesTranslateY = useRef(new Animated.Value(50)).current;
  const fastDeliveryScaleAnim = useRef(new Animated.Value(0.9)).current;
  const { activePath } = usePathChangeListener();

  const allBrands = useMemo(
    () => [
      ...BRICKS_BRANDS,
      ...BAJRI_BRANDS,
      ...GRIT_BRANDS,
      ...CEMENT_BRANDS,
      ...SAND_BRANDS,
    ],
    []
  );

  const resetAnimations = useCallback(() => {
    categoriesTranslateY.setValue(50);
    fastDeliveryScaleAnim.setValue(0.9);
  }, [categoriesTranslateY, fastDeliveryScaleAnim]);

  const playAnimations = useCallback(() => {
    Animated.parallel([
      Animated.spring(categoriesTranslateY, {
        toValue: 0,
        tension: 10,
        friction: 2,
        useNativeDriver: true,
      }),
      Animated.spring(fastDeliveryScaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 2,
        useNativeDriver: true,
      }),
    ]).start();
  }, [categoriesTranslateY, fastDeliveryScaleAnim]);

  useEffect(() => {
    const brand = allBrands.find((brand) => brand.brandId === brandId);
    setSelectedBrand(brand || null);
    setLoading(false);
  }, [brandId, allBrands]);

  useEffect(() => {
    if (activePath.includes("brand-items")) {
      resetAnimations();
      playAnimations();
    }
  }, [activePath, resetAnimations, playAnimations]);

  const getMeasurementType = useCallback((category: string): string => {
    switch (category) {
      case "Bricks":
        return t("Piece");
      case "Cement":
        return t("Packet");
      default:
        return t("Qui.");
    }
  }, []);

  const getCategoryItems = useCallback((category: string): ListItemProps[] => {
    switch (category) {
      case "Bricks":
        return BRICKS_ITEMS;
      case "Bajri":
        return BAJRI_ITEMS;
      case "Grit":
        return GRIT_ITEMS;
      case "Cement":
        return CEMENT_ITEMS;
      case "Sand":
        return SAND_ITEMS;
      default:
        return [];
    }
  }, []);

  const renderItem: ListRenderItem<ListItemProps> = useCallback(
    ({ item, index }) => (
      <Animated.View
        style={{
          opacity: fastDeliveryScaleAnim,
          transform: [
            {
              translateY: fastDeliveryScaleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50 * (index + 1), 0],
              }),
            },
          ],
        }}
      >
        <LargeListItem
          {...item}
          onPress={() =>
            router.push({
              pathname: "/product-detail/[productId]",
              params: { productId: item.productId ?? "" },
            })
          }
          mesurementType={
            selectedBrand ? getMeasurementType(selectedBrand.category) : ""
          }
          buttonTitle={t("More Information")}
        />
      </Animated.View>
    ),
    [fastDeliveryScaleAnim, getMeasurementType, selectedBrand]
  );

  const categoryItems = useMemo(() => {
    return selectedBrand ? getCategoryItems(selectedBrand.category) : [];
  }, [selectedBrand, getCategoryItems]);

  if (loading)
    return (
      <SafeAreaView
        style={[
          styles.container,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );

  if (!selectedBrand) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{t("Brand not found")}</Text>
      </SafeAreaView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <BrandHeader heading={selectedBrand.heading} />
      <FlatList
        data={categoryItems}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContent}
      />
    </ThemedView>
  );
};

const BrandHeader = ({ heading }: { heading: string }) => (
  <View style={styles.productHeadingContainer}>
    <IconButton
      iconName="chevron-back"
      size="small"
      variant="primary"
      style={{
        position: "absolute",
        left: 20,
        borderRadius: Sizes.borderRadiusFull,
        top: 5,
      }}
      onPress={() => router.back()}
    />
    <ThemedText style={styles.productHeading}>{t(heading)}</ThemedText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Sizes.marginHorizontal,
    paddingBottom: Sizes.marginLarge,
  },
  errorText: {
    textAlign: "center",
    fontSize: Sizes.textLarge,
    fontWeight: "bold",
    marginTop: Sizes.marginLarge,
  },
  productHeadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: Sizes.StatusBarHeight,
    paddingTop: Sizes.paddingSmall,
    paddingBottom: Sizes.paddingMedium,
  },
  productHeading: {
    fontSize: Sizes.textExtraLarge,
    fontWeight: "bold",
    paddingTop: Sizes.paddingSmall,
  },
});

export default BrandItems;
