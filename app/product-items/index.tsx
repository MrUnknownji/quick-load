import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  UIManager,
  View,
  ListRenderItem,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { t } from "i18next";

import LargeListItem from "@/components/list-items/LargeListItem";
import IconButton from "@/components/button/IconButton";
import usePathChangeListener from "@/hooks/usePathChangeListener";
import Sizes from "@/constants/Sizes";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  useFetchProductOwnersByType,
  useFetchProductsByOwnerAndType,
} from "@/hooks/useFetchProduct";
import { Product, ProductOwner } from "@/types/Product";
import Colors from "@/constants/Colors";
import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { responsive, vw, vh } from "@/utils/responsive";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ProductItems: React.FC = () => {
  const { productOwnerId, productType } = useLocalSearchParams<{
    productOwnerId: string;
    productType: string;
  }>();
  const categoriesTranslateY = useRef(new Animated.Value(50)).current;
  const fastDeliveryScaleAnim = useRef(new Animated.Value(0.9)).current;
  const [selectedOwner, setSelectedOwner] = useState<ProductOwner | null>(null);
  const { activePath } = usePathChangeListener();
  const [refreshing, setRefreshing] = useState(false);

  const {
    products,
    loading: productsLoading,
    error: productsError,
    fetchProducts,
  } = useFetchProductsByOwnerAndType(productOwnerId, productType || "");

  const {
    productOwners,
    loading: ownersLoading,
    error: ownersError,
    fetchOwners,
  } = useFetchProductOwnersByType(productType);

  useEffect(() => {
    if (productOwners && productOwnerId) {
      const owner = productOwners.find((o) => o._id === productOwnerId);
      setSelectedOwner(owner || null);
    }
  }, [productOwners, productOwnerId, products]);

  const verifiedProducts =
    products?.filter((product) => product.isVerified) || [];

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
    if (activePath.includes("product-items")) {
      resetAnimations();
      playAnimations();
    }
  }, [activePath, resetAnimations, playAnimations]);

  const getMeasurementType = useCallback((category: string): string => {
    switch (category) {
      case "Bricks":
        return t("Piece(1000)");
      case "Cement":
        return t("Packet");
      default:
        return t("Qui.");
    }
  }, []);

  const renderItem: ListRenderItem<Product> = useCallback(
    ({ item, index }) => (
      <Animated.View
        style={{
          opacity: fastDeliveryScaleAnim,
          transform: [
            {
              translateY: fastDeliveryScaleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [responsive(50 * (index + 1)), 0],
              }),
            },
          ],
        }}
      >
        <LargeListItem
          heading={item.productSize}
          imageUrl={`http://movingrolls.online${item.productImage}`}
          price={item.productPrice.toString()}
          location={item.productLocation}
          rating={item.productRating}
          onPress={() =>
            router.push({
              pathname: "/product-detail/[productId]",
              params: { productId: item._id ?? "" },
            })
          }
          measurementType={productType ? getMeasurementType(productType) : ""}
          buttonTitle={t("More Information")}
        />
      </Animated.View>
    ),
    [fastDeliveryScaleAnim, getMeasurementType, productType],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      fetchProducts(productOwnerId, productType || ""),
      fetchOwners(productType),
    ]);
    setRefreshing(false);
  }, [fetchProducts, fetchOwners, productOwnerId, productType]);

  if (productsLoading && !refreshing)
    return (
      <ThemedView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </ThemedView>
    );

  if (!productOwnerId) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ThemedText style={styles.errorText}>{t("Owner not found")}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <SafeAreaWrapper>
      <ThemedView style={styles.container}>
        <ProductOwnerHeader heading={selectedOwner?.productOwnerName ?? ""} />
        <FlatList
          data={verifiedProducts}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </ThemedView>
    </SafeAreaWrapper>
  );
};

const ProductOwnerHeader = ({ heading }: { heading: string }) => (
  <View style={styles.productHeadingContainer}>
    <IconButton
      iconName="chevron-back"
      size="small"
      variant="primary"
      style={{
        position: "absolute",
        left: responsive(20),
        borderRadius: responsive(Sizes.borderRadiusFull),
        top: responsive(5),
      }}
      onPress={() => router.back()}
    />
    <ThemedText style={styles.productHeading}>{t(heading)}</ThemedText>
  </View>
);

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: responsive(Sizes.marginHorizontal),
    paddingBottom: responsive(Sizes.marginLarge),
  },
  errorText: {
    textAlign: "center",
    fontSize: responsive(Sizes.textLarge),
    fontWeight: "bold",
    marginTop: responsive(Sizes.marginLarge),
  },
  productHeadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: responsive(Sizes.paddingMedium),
  },
  productHeading: {
    fontSize: responsive(Sizes.textExtraLarge),
    fontWeight: "bold",
    paddingTop: responsive(Sizes.paddingLarge),
  },
});

export default ProductItems;
