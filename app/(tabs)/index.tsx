import React, { useState, useRef, useEffect } from "react";
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import SearchHeader from "@/components/input-fields/SearchHeader";
import { Image } from "expo-image";
import { ThemedText } from "@/components/ThemedText";
import usePathChangeListener from "@/hooks/usePathChangeListener";
import { Colors } from "@/constants/Colors";
import LargeListItem from "@/components/list-items/LargeListItem";
import {
  CATEGORIES,
  BRICKS_ITEMS,
  BAJRI_ITEMS,
  GRIT_ITEMS,
  CEMENT_ITEMS,
  SAND_ITEMS,
} from "@/assets/data/DATA";
import { Category, ListItemProps } from "@/constants/types/types";
import { useTheme } from "@react-navigation/native";
import Sizes from "@/constants/Sizes";
import ImageCarousel from "@/components/image-views/ImageCarousel";
import LargeImageView from "@/components/image-views/LargeImageView";
import { router } from "expo-router";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const MAX_ITEMS = Math.max(
  BRICKS_ITEMS.length,
  BAJRI_ITEMS.length,
  GRIT_ITEMS.length,
  CEMENT_ITEMS.length,
  SAND_ITEMS.length
);

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const heroScaleAnim = useRef(new Animated.Value(0.9)).current;
  const categoriesTranslateY = useRef(new Animated.Value(50)).current;
  const fastDeliveryScaleAnim = useRef(new Animated.Value(0.9)).current;
  const listItemsAnim = useRef(
    Array(MAX_ITEMS)
      .fill(0)
      .map(() => new Animated.Value(0))
  ).current;
  const { activePath } = usePathChangeListener();

  const resetAnimations = () => {
    heroScaleAnim.setValue(0.9);
    categoriesTranslateY.setValue(50);
    fastDeliveryScaleAnim.setValue(0.9);
    listItemsAnim.forEach((anim) => anim.setValue(0));
  };

  const playAnimations = (includeListItems = true) => {
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
  };

  useEffect(() => {
    if (activePath === "index") {
      resetAnimations();
      playAnimations();
    }
  }, [activePath]);

  const handleCategoryPress = (category: Category) => {
    if (selectedCategory !== category.name) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setSelectedCategory("");
    }
  };

  const renderCategoryItems = (items: ListItemProps[]) => {
    return items.map((item, index) => (
      <Animated.ScrollView
        key={index}
        style={{ transform: [{ scale: listItemsAnim[index] }] }}
      >
        <LargeListItem
          {...item}
          onPress={() =>
            router.push({
              pathname: "/product-detail/[productId]",
              params: { productId: item.productId },
            })
          }
          mesurementType={getMeasurementType(selectedCategory)}
        />
      </Animated.ScrollView>
    ));
  };

  const getMeasurementType = (category: string) => {
    switch (category) {
      case "Bricks":
        return "piece";
      case "Cement":
        return "packet";
      default:
        return "qui";
    }
  };

  return (
    <View style={styles.container}>
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
          contentContainerStyle={[
            styles.categories,
            { backgroundColor: useTheme().colors.background },
          ]}
          style={{ transform: [{ translateY: categoriesTranslateY }] }}
        >
          {CATEGORIES.map((category, index) => (
            <View key={index} style={styles.category}>
              <TouchableOpacity onPress={() => handleCategoryPress(category)}>
                <View
                  style={[
                    styles.categoryImageContainer,
                    selectedCategory === category.name &&
                      styles.selectedCategory,
                  ]}
                >
                  <Image source={category.url} style={styles.categoryImage} />
                </View>
              </TouchableOpacity>
              <ThemedText style={styles.categoryLabel}>
                {category.name}
              </ThemedText>
            </View>
          ))}
        </Animated.ScrollView>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <SafeAreaView>
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
            {selectedCategory === "Bricks" && renderCategoryItems(BRICKS_ITEMS)}
            {selectedCategory === "Bajri" && renderCategoryItems(BAJRI_ITEMS)}
            {selectedCategory === "Grit" && renderCategoryItems(GRIT_ITEMS)}
            {selectedCategory === "Cement" && renderCategoryItems(CEMENT_ITEMS)}
            {selectedCategory === "Sand" && renderCategoryItems(SAND_ITEMS)}
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

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
  heroImage: {
    width: "100%",
    height: "100%",
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
  selectedCategory: {
    borderColor: Colors.light.primary,
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
  bricksContainer: {
    marginTop: Sizes.marginLarge,
    marginHorizontal: Sizes.marginHorizontal,
  },
  itemsContainer: {
    marginTop: Sizes.marginLarge,
    marginHorizontal: Sizes.marginHorizontal,
  },
});
