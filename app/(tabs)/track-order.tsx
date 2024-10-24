import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Sizes from "@/constants/Sizes";
import LargeListItem from "@/components/list-items/LargeListItem";
import { router } from "expo-router";
import { t } from "i18next";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { useOrder } from "@/hooks/useOrder";
import { useContextUser } from "@/contexts/userContext";
import { Order } from "@/types/Order";

const TrackOrder = () => {
  const { user } = useContextUser();
  const { orders, fetchUserOrders, loading } = useOrder();

  useEffect(() => {
    if (user?._id) {
      fetchUserOrders(user._id);
    }
  }, [user?._id]);

  const pendingOrders = orders.filter((order) => order.status === "pending");
  const deliveredOrders = orders.filter(
    (order) => order.status === "completed",
  );
  const canceledOrders = orders.filter((order) => order.status === "canceled");

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
      heading={item.productType}
      price={item.productPrice.toString()}
      onPress={() => onItemPress(item._id!)}
      totalAmount={item.totalAmount?.toFixed(2)}
      contentFit="contain"
      measurementType="Qui."
      buttonTitle={
        section.title === t("Pending Orders")
          ? t("Track Order")
          : t("Delivered")
      }
      imageUrl={`https://movingrolls.online/assets/quick-load-icon.png`}
    />
  );

  const sections = [
    { title: t("Pending Orders"), data: pendingOrders },
    { title: t("Delivered Orders"), data: deliveredOrders },
    { title: t("Canceled Orders"), data: canceledOrders },
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
                keyExtractor={(item) => item._id!}
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
