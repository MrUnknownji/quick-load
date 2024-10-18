import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Sizes from "@/constants/Sizes";
import LargeListItem from "@/components/list-items/LargeListItem";
import { router } from "expo-router";
import { t } from "i18next";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
// import { ORDERS } from "@/assets/data/DATA";
import { Order } from "@/types/Order";
import SafeAreaWrapper from "@/components/SafeAreaWrapper";

const TrackOrder = () => {
  // const { currentUser } = useUser();

  // const userOrders = ORDERS.filter((order) => order.userId === currentUser?.id);
  // const userOrders = ORDERS;
  // const pendingOrders = userOrders.filter(
  //   (order) => order.status === "pending",
  // );
  // const deliveredOrders = userOrders.filter(
  //   (order) => order.status === "delivered",
  // );
  const pendingOrders: Order[] = [];
  const deliveredOrders: Order[] = [];

  const onItemPress = (orderId: string) => {
    router.push({
      pathname: "/order-detail/order-track",
      params: { orderId },
    });
  };

  const renderSectionHeader = (title: string) => (
    <ThemedText style={styles.sectionHeaderText}>{t(title)}</ThemedText>
  );

  const renderItem = ({
    item,
    section,
  }: {
    item: Order;
    section: { title: string };
  }) => (
    <LargeListItem
      heading={item.productName}
      price={item.price.toString()}
      onPress={() => onItemPress(item.id)}
      measurementType="Qui."
      buttonTitle={
        section.title === t("Pending Orders")
          ? t("Track Order")
          : t("Delivered")
      }
      imageUrl={`https://movingrolls.online/assets/${item.productName.toLowerCase() === "grit" ? "product-grit-3.jpeg" : "product-bricks-3.jpeg"}`}
    />
  );

  const sections: { title: string; data: Order[] }[] = [
    { title: t("Pending Orders"), data: pendingOrders },
    { title: t("Delivered Orders"), data: deliveredOrders },
  ];

  return (
    <SafeAreaWrapper>
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
                keyExtractor={(item) => item.id}
              />
            </View>
          )}
          keyExtractor={(item) => item.title}
          contentContainerStyle={{ paddingBottom: 75 }}
        />
      </ThemedView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: Sizes.marginHorizontal,
  },
  header: {
    paddingVertical: Sizes.paddingMedium,
  },
  headingText: {
    fontSize: Sizes.textLarge,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 6,
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
