import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Sizes from "@/constants/Sizes";
import { ListItemProps } from "@/constants/types/types";
import { BRICKS_ITEMS, GRIT_ITEMS } from "@/assets/data/DATA";
import LargeListItem from "@/components/list-items/LargeListItem";
import { router } from "expo-router";

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
    <Text style={styles.sectionHeaderText}>{title}</Text>
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
        section.title === "Pending Orders" ? "Track Order" : "Delivered"
      }
      onPress={() => onItemPress(item.productId)}
    />
  );

  const sections = [
    { title: "Pending Orders", data: PENDING_ORDERS },
    { title: "Delivered Orders", data: DELIVERED_ORDERS },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headingText}>Track your route</Text>
      </View>
      <FlatList
        data={sections}
        renderItem={({ item: section }) => (
          <View>
            {renderSectionHeader(section.title)}
            <FlatList
              data={section.data}
              renderItem={({ item }) => renderItem({ item, section })}
              keyExtractor={(item) => item.productId}
            />
          </View>
        )}
        keyExtractor={(item) => item.title}
        contentContainerStyle={{ paddingBottom: 75 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Sizes.StatusBarHeight,
    marginHorizontal: Sizes.marginHorizontal,
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
