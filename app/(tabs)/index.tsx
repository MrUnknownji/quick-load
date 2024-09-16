import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
  LayoutAnimation,
  UIManager,
  Platform,
  ActivityIndicator,
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
import usePathChangeListener from "@/hooks/usePathChangeListener";
import { Colors } from "@/constants/Colors";
import Sizes from "@/constants/Sizes";
import {
  CATEGORIES,
  //   BRICKS_BRANDS,
  //   BAJRI_BRANDS,
  //   GRIT_BRANDS,
  //   CEMENT_BRANDS,
  //   SAND_BRANDS,
} from "@/assets/data/DATA";
import { Brand, Category } from "@/types/types";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "@/components/ThemedView";
import {
  useFetchProductOwnersByType,
  useFetchProducts,
} from "@/hooks/useFetchProduct";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const MAX_ITEMS = Math.max(
  // BRICKS_BRANDS.length,
  // BAJRI_BRANDS.length,
  // GRIT_BRANDS.length,
  // CEMENT_BRANDS.length,
  // SAND_BRANDS.length,
  100
);

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const HomeScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const heroScaleAnim = useRef(new Animated.Value(0.9)).current;
  const categoriesTranslateY = useRef(new Animated.Value(50)).current;
  const fastDeliveryScaleAnim = useRef(new Animated.Value(0.9)).current;
  const listItemsAnim = useRef(
    Array(MAX_ITEMS)
      .fill(0)
      .map(() => new Animated.Value(0))
  ).current;
  const { activePath } = usePathChangeListener();
  const borderColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.dark.secondary },
    "primary"
  );
  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background"
  );

  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useFetchProducts();

  const {
    productOwners,
    loading: ownersLoading,
    error: ownersError,
  } = useFetchProductOwnersByType(selectedCategory);

  const uniqueCategories = useMemo(() => {
    if (productsLoading || productsError) return [];

    const categorySet = new Set<string>();
    products.forEach((product) => categorySet.add(product.productType));
    return Array.from(categorySet).map((categoryName) => ({
      name: categoryName,
      url:
        CATEGORIES.find((c) => c.name === categoryName)?.url ??
        `https://placehold.co/150x150?text=${categoryName}`,
    }));
  }, [products, productsLoading, productsError]);

  const resetAnimations = useCallback(() => {
    heroScaleAnim.setValue(0.9);
    categoriesTranslateY.setValue(50);
    fastDeliveryScaleAnim.setValue(0.9);
    listItemsAnim.forEach((anim) => anim.setValue(0));
  }, [
    heroScaleAnim,
    categoriesTranslateY,
    fastDeliveryScaleAnim,
    listItemsAnim,
  ]);

  const playAnimations = useCallback(
    (includeListItems = true) => {
      const animations = [
        Animated.spring(heroScaleAnim, {
          toValue: 1,
          tension: 10,
          friction: 2,
          useNativeDriver: true,
        }),
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
      ];

      if (includeListItems) {
        listItemsAnim.forEach((anim, index) => {
          animations.push(
            Animated.spring(anim, {
              toValue: 1,
              tension: 50,
              friction: 7,
              delay: index * 100,
              useNativeDriver: true,
            })
          );
        });
      }

      Animated.parallel(animations).start();
    },
    [heroScaleAnim, categoriesTranslateY, fastDeliveryScaleAnim, listItemsAnim]
  );

  useEffect(() => {
    console.log(productOwners);
  }, [ownersLoading]);

  useEffect(() => {
    if (activePath === "index") {
      resetAnimations();
      playAnimations();
    }
  }, [resetAnimations, playAnimations]);

  const handleCategoryPress = useCallback(
    (category: Category) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      if (selectedCategory !== category.name) {
        setSelectedCategory(category.name);
        listItemsAnim.forEach((anim) => anim.setValue(0));
        playAnimations(false);
        setTimeout(() => {
          Animated.stagger(
            100,
            listItemsAnim.map((anim) =>
              Animated.spring(anim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
              })
            )
          ).start();
        }, 300);
      } else {
        setSelectedCategory("");
      }
    },
    [selectedCategory, listItemsAnim, playAnimations]
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

  const renderProductOwners = useCallback(
    (brands?: any[]) => {
      const backgroundColor = useThemeColor(
        {
          light: Colors.light.backgroundSecondary,
          dark: Colors.dark.backgroundSecondary,
        },
        "backgroundSecondary"
      );
      // return brands.map((brand, index) => (
      //   <Animated.View
      //     key={brand.brandId}
      //     style={{ transform: [{ scale: listItemsAnim[index] }] }}
      //   >
      //     <LargeListItem
      //       {...brand}
      //       onPress={() =>
      //         router.push({
      //           pathname: "/brand-items",
      //           params: { brandId: brand.brandId },
      //         })
      //       }
      //       mesurementType={getMeasurementType(selectedCategory)}
      //       buttonTitle={t("More Information")}
      //       style={{ backgroundColor }}
      //     />
      //   </Animated.View>
      // ));
      return ownersLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size={"large"} />
        </View>
      ) : (
        productOwners.map((owner, index) => (
          <Animated.View
            key={owner.productOwnerId}
            style={{ transform: [{ scale: listItemsAnim[index] }] }}
          >
            <LargeListItem
              heading={owner.productOwnerName}
              imageUrl={owner.productImage}
              price={`${owner.productPrizeFrom} - ${owner.productPrizeTo}`}
              onPress={() =>
                router.push({
                  pathname: "/product-items",
                  params: {
                    productOwnerId: owner.productOwnerId,
                    productType: selectedCategory,
                  },
                })
              }
              mesurementType={getMeasurementType(selectedCategory)}
              buttonTitle={t("More Information")}
              style={{ backgroundColor }}
            />
          </Animated.View>
        ))
      );
    },
    [listItemsAnim, selectedCategory, getMeasurementType]
  );

  // const categoryItems = useMemo(() => {
  //   switch (selectedCategory) {
  //     case "Bricks":
  //     return BRICKS_BRANDS;
  //     case "Bajri":
  //     return BAJRI_BRANDS;
  //     case "Grit":
  //     return GRIT_BRANDS;
  //     case "Cement":
  //     return CEMENT_BRANDS;
  //     case "Sand":
  //     return SAND_BRANDS;
  //     default:
  //       return [];
  //   }
  // }, [selectedCategory]);

  return (
    <ThemedView style={styles.container}>
      <SearchHeader />
      <View>
        {selectedCategory === "" && (
          <Animated.View
            style={[
              styles.heroContainer,
              { transform: [{ scale: heroScaleAnim }] },
            ]}
          >
            <ImageCarousel />
          </Animated.View>
        )}
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.categories,
            { backgroundColor: backgroundColor },
          ]}
          style={{ transform: [{ translateY: categoriesTranslateY }] }}
        >
          {/* {CATEGORIES.map((category, index) => ( */}
          {productsLoading ? (
            <ActivityIndicator />
          ) : (
            uniqueCategories.map((category, index) => (
              <View key={index} style={styles.category}>
                <TouchableOpacity onPress={() => handleCategoryPress(category)}>
                  <View
                    style={[
                      styles.categoryImageContainer,
                      selectedCategory === category.name && { borderColor },
                    ]}
                  >
                    <Image source={category.url} style={styles.categoryImage} />
                  </View>
                </TouchableOpacity>
                <ThemedText style={styles.categoryLabel}>
                  {t(category.name)}
                </ThemedText>
              </View>
            ))
          )}
        </Animated.ScrollView>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView edges={["bottom"]}>
          {selectedCategory === "" && (
            <LargeImageView
              animationValue={fastDeliveryScaleAnim}
              imageUrl={`https://placehold.co/${
                SCREEN_WIDTH - Sizes.marginHorizontal * 2
              }x200?text=Fast-delivery`}
              style={{ elevation: 3 }}
            />
          )}
          <View style={styles.itemsContainer}>
            {/* {renderProductOwners(categoryItems)} */}
            {renderProductOwners()}
          </View>
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
});

export default HomeScreen;
