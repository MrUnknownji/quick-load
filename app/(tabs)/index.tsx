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
import usePathChangeListener from "@/hooks/usePathChangeListener";
import { Colors } from "@/constants/Colors";
import Sizes from "@/constants/Sizes";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "@/components/ThemedView";
import {
  useFetchProductOwnersByType,
  useFetchProducts,
} from "@/hooks/useFetchProduct";
import Loading from "@/components/Loading";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const MAX_ITEMS = 100;

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const HomeScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categoryChangeToFetch, setCategoryChangeToFetch] =
    useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  const heroScaleAnim = useRef(new Animated.Value(0.9)).current;
  const categoriesTranslateY = useRef(new Animated.Value(50)).current;
  const fastDeliveryScaleAnim = useRef(new Animated.Value(0.9)).current;
  const listItemsAnim = useRef(
    Array(MAX_ITEMS)
      .fill(0)
      .map(() => new Animated.Value(0)),
  ).current;
  const { activePath } = usePathChangeListener();
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
    error: ownersError,
    fetchOwners,
  } = useFetchProductOwnersByType(categoryChangeToFetch);

  const uniqueCategories = useMemo(() => {
    if (productsLoading || productsError) return [];

    const categorySet = new Set<string>();
    products.forEach((product) => categorySet.add(product.productType));
    return Array.from(categorySet).map((categoryName) => ({
      name: categoryName,
      url: `https://placehold.co/150x150?text=${categoryName}`,
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
            }),
          );
        });
      }

      Animated.parallel(animations).start();
    },
    [heroScaleAnim, categoriesTranslateY, fastDeliveryScaleAnim, listItemsAnim],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setSelectedCategory("");
    setCategoryChangeToFetch("");
    await Promise.all([fetchProducts(), fetchOwners("")]);
    resetAnimations();
    playAnimations();
    setRefreshing(false);
  }, [fetchProducts, fetchOwners, resetAnimations, playAnimations]);

  useEffect(() => {
    console.log(productOwners);
  }, [productOwners]);

  useEffect(() => {
    if (activePath === "index") {
      resetAnimations();
      playAnimations();
    }
  }, [activePath, resetAnimations, playAnimations]);

  const handleCategoryPress = useCallback(
    (category: any) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      if (selectedCategory !== category.name) {
        setSelectedCategory(category.name);
        setCategoryChangeToFetch(category.name);
        fetchOwners(category.name);
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
              }),
            ),
          ).start();
        }, 300);
      } else {
        setSelectedCategory("");
      }
    },
    [selectedCategory, listItemsAnim, playAnimations, fetchOwners],
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
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Loading />
        </View>
      );
    }

    return productOwners.map((owner, index) => (
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
          measurementType={getMeasurementType(selectedCategory)}
          buttonTitle={t("More Information")}
          location={owner.productLocation}
          rating={owner.productRating}
        />
      </Animated.View>
    ));
  }, [
    productOwners,
    ownersLoading,
    listItemsAnim,
    selectedCategory,
    getMeasurementType,
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
          contentContainerStyle={styles.categories}
          style={{ transform: [{ translateY: categoriesTranslateY }] }}
        >
          {productsLoading ? (
            <Loading />
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
        <SafeAreaView edges={["bottom"]}>
          {selectedCategory === "" ? (
            <LargeImageView
              animationValue={fastDeliveryScaleAnim}
              imageUrl={`https://placehold.co/${
                SCREEN_WIDTH - Sizes.marginHorizontal * 2
              }x200?text=Fast-delivery`}
              style={{ elevation: 3 }}
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
});

export default HomeScreen;
