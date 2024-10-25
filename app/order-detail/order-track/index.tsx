import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import IconButton from "@/components/button/IconButton";
import Sizes from "@/constants/Sizes";
import Colors from "@/constants/Colors";
import { t } from "i18next";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { responsive } from "@/utils/responsive";
import { useOrder } from "@/hooks/useOrder";
import { useContextUser } from "@/contexts/userContext";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Clipboard from "expo-clipboard";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

const OrderStatus = () => {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { user } = useContextUser();
  const { orders, fetchUserOrders, loading } = useOrder();
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  useEffect(() => {
    if (user?._id) {
      fetchUserOrders(user._id);
    }
  }, [user?._id]);

  const currentOrder = orders.find((order) => order._id === orderId);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(currentOrder?._id || "");
    setCopiedToClipboard(true);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setCopiedToClipboard(false), 2000);
  };

  const getOrderSteps = () => {
    switch (currentOrder?.status) {
      case "pending":
        return [
          { title: "Order Placed", isCompleted: true },
          { title: "Order Processing", isCompleted: true },
          { title: "Out for Delivery", isCompleted: false },
          { title: "Delivered", isCompleted: false },
        ];
      case "completed":
        return [
          { title: "Order Placed", isCompleted: true },
          { title: "Order Processing", isCompleted: true },
          { title: "Out for Delivery", isCompleted: true },
          { title: "Delivered", isCompleted: true },
        ];
      case "canceled":
        return [
          { title: "Order Placed", isCompleted: true },
          { title: "Order Canceled", isCompleted: true },
        ];
      default:
        return [
          { title: "Order Placed", isCompleted: false },
          { title: "Order Processing", isCompleted: false },
          { title: "Out for Delivery", isCompleted: false },
          { title: "Delivered", isCompleted: false },
        ];
    }
  };

  const primaryColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.dark.secondary },
    "primary",
  );

  if (loading) {
    return (
      <SafeAreaWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={primaryColor} />
          <ThemedText style={styles.loadingText}>
            {t("Loading order details...")}
          </ThemedText>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper>
      <ThemedView style={styles.container}>
        <Animated.View entering={FadeIn} style={styles.header}>
          <IconButton
            iconName="chevron-back"
            size="small"
            variant="primary"
            style={styles.backButton}
            iconStyle={{ color: "white" }}
            onPress={() => router.back()}
          />
          <ThemedText style={styles.headingText}>
            {t("Order Status")}
          </ThemedText>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200)}
          style={styles.secondaryHeader}
        >
          <View style={styles.orderIdContainer}>
            <ThemedText style={styles.orderInfoText}>
              {t("Order ID")}: {currentOrder?._id}
            </ThemedText>
            <TouchableOpacity
              onPress={copyToClipboard}
              style={styles.copyButton}
            >
              <Ionicons
                name={copiedToClipboard ? "checkmark-circle" : "copy-outline"}
                size={20}
                color="white"
              />
            </TouchableOpacity>
          </View>
          <ThemedText style={styles.orderInfoText}>
            {t("Total Amount")}: {t("Rs.")}
            {currentOrder?.totalAmount?.toFixed(2)}
          </ThemedText>
        </Animated.View>

        <ScrollView style={styles.content}>
          <View style={styles.timeline}>
            {getOrderSteps().map((step, index) => (
              <Animated.View
                key={index}
                entering={FadeInDown.delay(300 + index * 100)}
                style={styles.timelineItem}
              >
                <View
                  style={[
                    styles.timelineDot,
                    {
                      backgroundColor: step.isCompleted
                        ? primaryColor
                        : Colors.light.textSecondary,
                    },
                  ]}
                />
                {index !== getOrderSteps().length - 1 && (
                  <View
                    style={[
                      styles.timelineLine,
                      {
                        backgroundColor: step.isCompleted
                          ? primaryColor
                          : Colors.light.textSecondary,
                      },
                    ]}
                  />
                )}
                <View style={styles.timelineContent}>
                  <ThemedText style={styles.timelineTitle}>
                    {t(step.title)}
                  </ThemedText>
                </View>
              </Animated.View>
            ))}
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: responsive(Sizes.paddingLarge),
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: responsive(Sizes.marginHorizontal),
    top: responsive(5),
    borderRadius: responsive(Sizes.borderRadiusFull),
  },
  headingText: {
    fontSize: responsive(Sizes.textLarge),
    fontWeight: "bold",
    paddingTop: responsive(Sizes.paddingSmall),
  },
  secondaryHeader: {
    backgroundColor: Colors.light.primary,
    padding: responsive(Sizes.paddingMedium),
    marginHorizontal: responsive(Sizes.marginHorizontal),
    marginVertical: responsive(Sizes.marginExtraSmall),
    borderRadius: responsive(Sizes.borderRadiusLarge),
  },
  orderInfoText: {
    color: "white",
    fontSize: responsive(Sizes.textNormal),
    marginVertical: 2,
  },
  content: {
    flex: 1,
    padding: responsive(Sizes.paddingHorizontal),
  },
  timeline: {
    paddingLeft: responsive(Sizes.paddingExtraLarge),
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: responsive(Sizes.marginMedium),
  },
  timelineDot: {
    width: responsive(20),
    height: responsive(20),
    borderRadius: responsive(10),
    marginRight: responsive(10),
    marginLeft: responsive(-29),
  },
  timelineLine: {
    position: "absolute",
    left: responsive(-20),
    top: responsive(20),
    bottom: responsive(-20),
    width: responsive(2),
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: responsive(Sizes.textMedium),
    fontWeight: "bold",
    marginBottom: responsive(4),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: responsive(Sizes.marginMedium),
    fontSize: responsive(Sizes.textNormal),
  },
  orderIdContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  copyButton: {
    padding: responsive(Sizes.paddingSmall),
  },
});

export default OrderStatus;
