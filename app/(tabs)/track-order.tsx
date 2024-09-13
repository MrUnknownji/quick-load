import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Sizes from "@/constants/Sizes";
import { ListItemProps } from "@/constants/types/types";
import { BRICKS_ITEMS, GRIT_ITEMS } from "@/assets/data/DATA";
import LargeListItem from "@/components/list-items/LargeListItem";
import { router } from "expo-router";
import { t } from "i18next";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const PENDING_ORDERS: ListItemProps[] = [BRICKS_ITEMS[0], GRIT_ITEMS[3]];
const DELIVERED_ORDERS: ListItemProps[] = [GRIT_ITEMS[1], BRICKS_ITEMS[2]];

const TrackOrder = () => {
  const onItemPress = (productId: string) => {
    router.push({
      pathname: "/order-detail/order-track",
      params: { productId },
    });
  };

  const renderSectionHeader = (title: string) => (
    <ThemedText style={styles.sectionHeaderText}>{t(title)}</ThemedText>
  );

  const renderItem = ({
    item,
    section,
  }: {
    item: ListItemProps;
    section: { title: string };
  }) => (
    <LargeListItem
      {...item}
      buttonTitle={
        section.title === t("Pending Orders")
          ? t("Track Order")
          : t("Delivered")
      }
      onPress={() => onItemPress(item.productId ?? "")}
      mesurementType={"Qui."}
    />
  );

  const sections = [
    { title: t("Pending Orders"), data: PENDING_ORDERS },
    { title: t("Delivered Orders"), data: DELIVERED_ORDERS },
  ];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headingText}>
          {t("Track your route")}
        </ThemedText>
      </View>
      <FlatList
        data={sections}
        renderItem={({ item: section }) => (
          <View>
            {renderSectionHeader(section.title)}
            <FlatList
              data={section.data}
              renderItem={({ item }) => renderItem({ item, section })}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        )}
        keyExtractor={(item) => item.title}
        contentContainerStyle={{ paddingBottom: 75 }}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Sizes.StatusBarHeight,
    paddingHorizontal: Sizes.marginHorizontal,
  },
  header: {
    paddingVertical: Sizes.paddingMedium,
  },
  headingText: {
    fontSize: Sizes.textLarge,
    fontWeight: "bold",
    textAlign: "center",
  },
  sectionHeaderText: {
    fontSize: Sizes.textMedium,
    marginHorizontal: Sizes.marginSmall,
    fontWeight: "bold",
    marginTop: Sizes.marginMedium,
    marginBottom: Sizes.marginSmall,
  },
});

export default TrackOrder;
