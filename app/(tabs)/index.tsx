import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Animated,
  LayoutAnimation,
  UIManager,
  Platform,
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
import CategorySkeleton from "@/components/Loading/CategorySkeleton";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const HomeScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  const [showOwners, setShowOwners] = useState(false);
  const listItemsAnim = useRef(new Animated.Value(0)).current;
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

  useEffect(() => {
    if (selectedCategory) {
      fetchOwners(selectedCategory);
      // Add a small delay before showing the owners list
      setTimeout(() => setShowOwners(true), 50);
    } else {
      setShowOwners(false);
    }
  }, [selectedCategory, fetchOwners]);

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
    setShowOwners(false);
    await Promise.all([fetchProducts(), fetchOwners("")]);
    setRefreshing(false);
  }, [fetchProducts, fetchOwners]);

  const handleCategoryPress = useCallback(
    (category: any) => {
      if (selectedCategory === "") {
        // Selecting a category when none was selected
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSelectedCategory(category.name);
        listItemsAnim.setValue(0);
        Animated.spring(listItemsAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }).start();
      } else if (selectedCategory === category.name) {
        // Deselecting the current category
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSelectedCategory("");
        setShowOwners(false);
      } else {
        // Switching between categories
        setShowOwners(false);
        setTimeout(() => {
          setSelectedCategory(category.name);
        }, 50);
      }
    },
    [selectedCategory, listItemsAnim],
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
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      );
    }

    if (!selectedCategory || productOwners.length === 0 || !showOwners) {
      return null;
    }

    return (
      <View>
        {productOwners.map((owner) => (
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
        ))}
      </View>
    );
  }, [
    productOwners,
    ownersLoading,
    selectedCategory,
    getMeasurementType,
    showOwners,
  ]);

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
