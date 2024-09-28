import React, { useState, useCallback, useMemo } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { router } from "expo-router";
import { t } from "i18next";
import SearchHeader from "@/components/input-fields/SearchHeader";
import { ThemedText } from "@/components/ThemedText";
import LargeListItem from "@/components/list-items/LargeListItem";
import ImageCarousel from "@/components/image-views/ImageCarousel";
import LargeImageView from "@/components/image-views/LargeImageView";
import { Colors } from "@/constants/Colors";
import Sizes from "@/constants/Sizes";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "@/components/ThemedView";
import {
  useFetchProductOwnersByType,
  useFetchProducts,
} from "@/hooks/useFetchProduct";
import Loading from "@/components/Loading";
import CategorySkeleton from "@/components/Loading/CategorySkeleton";

const HomeScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  const borderColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.dark.secondary },
    "primary",
  );

  const {
    products,
    loading: productsLoading,
    error: productsError,
    fetchProducts,
  } = useFetchProducts();

  const {
    productOwners,
    loading: ownersLoading,
    fetchOwners,
  } = useFetchProductOwnersByType(selectedCategory);

  const uniqueCategories = useMemo(() => {
    if (productsLoading || productsError) return [];

    const categorySet = new Set<string>();
    products.forEach((product) => categorySet.add(product.productType));
    return Array.from(categorySet).map((categoryName) => ({
      name: categoryName,
      url: `https://quick-load.onrender.com/assets/${
        categoryName === "Bricks" ? "bricks.webp" : "grit.png"
      }`,
    }));
  }, [products, productsLoading, productsError]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setSelectedCategory("");
    await Promise.all([fetchProducts(), fetchOwners("")]);
    setRefreshing(false);
  }, [fetchProducts, fetchOwners]);

  const handleCategoryPress = useCallback(
    (category: any) => {
      if (selectedCategory !== category.name) {
        setSelectedCategory(category.name);
        fetchOwners(category.name);
      } else {
        setSelectedCategory("");
      }
    },
    [selectedCategory, fetchOwners],
  );

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

  const renderProductOwners = useCallback(() => {
    if (ownersLoading) {
      return (
        <View style={styles.loadingContainer}>
          <Loading />
        </View>
      );
    }

    return productOwners.map((owner) => (
      <LargeListItem
        key={owner.productOwnerId}
        heading={owner.productOwnerName}
        imageUrl={`https://quick-load.onrender.com/assets/${owner.productImage}`}
        price={`${owner.productPrizeFrom} - ${owner.productPrizeTo}`}
        onPress={() =>
          router.push({
            pathname: "/product-items",
            params: {
              productOwnerId: owner._id,
              productType: selectedCategory,
            },
          })
        }
        measurementType={getMeasurementType(selectedCategory)}
        buttonTitle={t("More Information")}
        location={owner.productLocation}
        rating={owner.productRating}
      />
    ));
  }, [productOwners, ownersLoading, selectedCategory, getMeasurementType]);

  return (
    <ThemedView style={styles.container}>
      <SearchHeader />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {selectedCategory === "" && (
          <View style={styles.heroContainer}>
            <ImageCarousel />
          </View>
        )}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
        >
          {productsLoading
            ? Array(4)
                .fill(0)
                .map((_, index) => <CategorySkeleton key={index} />)
            : uniqueCategories.map((category, index) => (
                <View key={index} style={styles.category}>
                  <TouchableOpacity
                    onPress={() => handleCategoryPress(category)}
                  >
                    <View
                      style={[
                        styles.categoryImageContainer,
                        selectedCategory === category.name && { borderColor },
                      ]}
                    >
                      <Image
                        source={category.url}
                        style={styles.categoryImage}
                      />
                    </View>
                  </TouchableOpacity>
                  <ThemedText style={styles.categoryLabel}>
                    {t(category.name)}
                  </ThemedText>
                </View>
              ))}
        </ScrollView>
        <SafeAreaView edges={["bottom"]}>
          {selectedCategory === "" ? (
            <LargeImageView
              imageUrl="https://quick-load.onrender.com/assets/fast-deliver-truck.png"
              style={styles.largeImageView}
            />
          ) : (
            <View style={styles.itemsContainer}>{renderProductOwners()}</View>
          )}
        </SafeAreaView>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 80,
  },
  heroContainer: {
    marginHorizontal: Sizes.marginHorizontal,
    marginTop: Sizes.marginMedium,
    height: Sizes.carouselHeight,
    borderRadius: Sizes.borderRadiusLarge,
    overflow: "hidden",
  },
  categories: {
    paddingHorizontal: Sizes.paddingHorizontal,
    paddingTop: Sizes.paddingMedium,
    backgroundColor: "transparent",
  },
  category: {
    alignItems: "center",
    marginHorizontal: Sizes.marginSmall,
  },
  categoryImageContainer: {
    borderRadius: Sizes.borderRadiusFull,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  categoryImage: {
    width: 60,
    height: 60,
  },
  categoryLabel: {
    fontSize: Sizes.textSmall,
    textAlign: "center",
    fontWeight: "bold",
    marginVertical: 4,
  },
  itemsContainer: {
    marginTop: Sizes.marginLarge,
    marginHorizontal: Sizes.marginHorizontal,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  largeImageView: {
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: "white",
  },
});

export default HomeScreen;
