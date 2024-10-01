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
  Animated,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
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
import FlexibleSkeleton from "@/components/Loading/FlexibleSkeleton";
import { responsive, vw, vh } from "@/utils/responsive";
import { SafeAreaView } from "react-native-safe-area-context";
import SafeAreaWrapper from "@/components/SafeAreaWrapper";

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
      setTimeout(() => setShowOwners(true), 50);
    } else {
      setShowOwners(false);
    }
  }, [selectedCategory, fetchOwners]);

  const uniqueCategories = useMemo(() => {
    if (productsLoading || productsError || !products) return [];

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
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSelectedCategory("");
        setShowOwners(false);
      } else {
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
    if (!selectedCategory || !showOwners) {
      return null;
    }

    if (ownersLoading) {
      return Array(3)
        .fill(0)
        .map((_, index) => (
          <View key={`skeleton-${index}`} style={styles.skeletonContainer}>
            <FlexibleSkeleton
              width={vw(25)}
              height={vw(25)}
              borderRadius={Sizes.borderRadius}
            />
            <View style={styles.skeletonContent}>
              <FlexibleSkeleton
                width="80%"
                height={vh(2.5)}
                borderRadius={Sizes.borderRadius}
              />
              <FlexibleSkeleton
                width="60%"
                height={vh(2)}
                borderRadius={Sizes.borderRadius}
              />
              <FlexibleSkeleton
                width="40%"
                height={vh(2)}
                borderRadius={Sizes.borderRadius}
              />
            </View>
          </View>
        ));
    }

    return productOwners.map((owner) => (
      <LargeListItem
        key={owner._id}
        heading={owner.productOwnerName}
        imageUrl={`https://quick-load.onrender.com/assets/${owner.shopImage}`}
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
        location={owner.shopAddress}
        rating={owner.shopRating}
      />
    ));
  }, [
    productOwners,
    ownersLoading,
    selectedCategory,
    getMeasurementType,
    showOwners,
  ]);

  return (
    <SafeAreaWrapper>
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
                  .map((_, index) => (
                    <CategorySkeleton key={`category-skeleton-${index}`} />
                  ))
              : uniqueCategories.map((category, index) => (
                  <View key={`category-${index}`} style={styles.category}>
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
                key={Date.now()}
              />
            ) : (
              <View style={styles.itemsContainer}>{renderProductOwners()}</View>
            )}
          </SafeAreaView>
        </ScrollView>
      </ThemedView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: vh(10),
  },
  heroContainer: {
    height: vh(25),
    marginHorizontal: vw(4),
    marginTop: vh(2),
    borderRadius: responsive(Sizes.borderRadiusLarge),
    overflow: "hidden",
  },
  categories: {
    paddingHorizontal: vw(4),
    paddingTop: vh(2),
    backgroundColor: "transparent",
  },
  category: {
    alignItems: "center",
    marginHorizontal: vw(2),
  },
  categoryImageContainer: {
    borderRadius: responsive(30),
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  categoryImage: {
    width: responsive(60),
    height: responsive(60),
  },
  categoryLabel: {
    fontSize: responsive(Sizes.textSmall),
    textAlign: "center",
    fontWeight: "bold",
    marginVertical: vh(0.5),
  },
  itemsContainer: {
    marginTop: vh(2),
    marginHorizontal: vw(4),
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
  skeletonContainer: {
    flexDirection: "row",
    marginVertical: vh(1),
    borderRadius: responsive(Sizes.borderRadius),
    padding: vw(3),
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  skeletonContent: {
    flex: 1,
    marginLeft: vw(3),
    justifyContent: "space-between",
  },
});

export default HomeScreen;
