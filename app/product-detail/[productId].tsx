import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ListItemProps } from "@/constants/types/types";
import {
  BRICKS_ITEMS,
  BAJRI_ITEMS,
  GRIT_ITEMS,
  CEMENT_ITEMS,
  SAND_ITEMS,
  FEATURES,
} from "@/assets/data/DATA";
import IconButton from "@/components/button/IconButton";
import Sizes from "@/constants/Sizes";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import LargeImageView from "@/components/image-views/LargeImageView";
import { Image } from "expo-image";
import Button from "@/components/button/Button";

const { width: screenWidth } = Dimensions.get("screen");

const ProductDetailPage = () => {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const [product, setProduct] = useState<ListItemProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = () => {
      if (productId.includes("bricks")) {
        const product = BRICKS_ITEMS.find((p) => p.productId === productId);
        if (product) {
          setProduct(product);
          setLoading(false);
        }
      } else if (productId.includes("bajri")) {
        const product = BAJRI_ITEMS.find((p) => p.productId === productId);
        if (product) {
          setProduct(product);
          setLoading(false);
        }
      } else if (productId.includes("grit")) {
        const product = GRIT_ITEMS.find((p) => p.productId === productId);
        if (product) {
          setProduct(product);
          setLoading(false);
        }
      } else if (productId.includes("cement")) {
        const product = CEMENT_ITEMS.find((p) => p.productId === productId);
        if (product) {
          setProduct(product);
          setLoading(false);
        }
      } else if (productId.includes("sand")) {
        const product = SAND_ITEMS.find((p) => p.productId === productId);
        if (product) {
          setProduct(product);
          setLoading(false);
        }
      }
    };
    fetchProduct();
  }, [productId]);

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );

  if (!product)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
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
        <Text style={styles.productHeading}>{product?.heading}</Text>
      </View>
      <View style={styles.productContainer}>
        <LargeImageView
          imageUrl={product?.imageUrl}
          style={{ marginHorizontal: 0 }}
        />
        <View style={styles.productDetailContainer}>
          <Text style={styles.productDescription}>
            {product?.productDescription}
          </Text>
          <View style={styles.productFeaturesCard}>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Text style={styles.featureCardHeading}>Our Features</Text>
              <Text style={styles.featureCardPrice}>
                {product?.price}
                <Text style={styles.perPieceText}>/piece</Text>
              </Text>
            </View>
            <FlatList data={FEATURES} renderItem={renderFeatureItem} />
          </View>
        </View>
      </View>
      <Button
        title="Buy Now"
        variant="primary"
        size="medium"
        style={{
          position: "absolute",
          bottom: 10,
          marginHorizontal: Sizes.marginHorizontal,
          width: screenWidth - Sizes.marginHorizontal * 2,
        }}
      />
    </View>
  );
};

const renderFeatureItem = ({ item }: { item: string }) => {
  return (
    <View style={styles.featureItem}>
      <Ionicons
        name="checkmark-circle"
        size={Sizes.icon["small"]}
        color={Colors.light.primary}
      />
      <Text style={styles.featureText}>{item}</Text>
    </View>
  );
};
export default ProductDetailPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  productHeadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: Sizes.StatusBarHeight,
    paddingTop: Sizes.paddingSmall,
  },
  productHeading: {
    fontSize: Sizes.textExtraLarge,
    fontWeight: "bold",
  },
  productContainer: {
    marginTop: Sizes.marginLarge,
    marginHorizontal: Sizes.marginHorizontal,
  },
  productImage: {
    width: screenWidth,
    height: 200,
    borderRadius: Sizes.borderRadiusLarge,
  },
  productDetailContainer: {
    marginTop: Sizes.marginMedium,
    gap: Sizes.marginLarge,
  },
  productDescription: {
    fontSize: Sizes.textMedium,
    fontWeight: "normal",
  },
  productFeaturesCard: {
    marginTop: Sizes.marginMedium,
    padding: Sizes.paddingMedium,
    backgroundColor: "white",
    borderRadius: Sizes.borderRadiusLarge,
    elevation: 3,
    gap: Sizes.marginSmall,
  },
  featureCardHeading: {
    fontSize: Sizes.textLarge,
    fontWeight: "bold",
  },
  featureCardPrice: {
    fontSize: Sizes.textLarge,
    fontWeight: "bold",
  },
  perPieceText: {
    fontSize: Sizes.textSmall,
    fontWeight: "normal",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Sizes.marginSmall,
    width: "100%",
  },
  featureText: {
    fontSize: Sizes.textSmall,
    fontWeight: "normal",
  },
  errorText: {
    fontSize: Sizes.textSmall,
    color: Colors.light.error,
    marginTop: Sizes.marginSmall,
  },
});
