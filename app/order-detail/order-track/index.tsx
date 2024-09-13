import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import IconButton from "@/components/button/IconButton";
import Sizes from "@/constants/Sizes";
import Colors from "@/constants/Colors";
import { t } from "i18next";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

const OrderStatus = () => {
  const { productId } = useLocalSearchParams<{ productId: string }>();

  const orderSteps = [
    {
      title: "Order",
      date: "Fri, 24th Aug 2024",
      time: "Payment Completed - 06:02pm",
    },
    {
      title: "Loaded",
      date: "Sat, 25th Aug 2024",
      time: "Loaded successfully - 07:30am",
    },
    { title: "Abc", date: "Sat, 25th Aug 2024", time: "Arrived - 07:30am" },
    { title: "Efg", date: "Sat, 25th Aug 2024", time: "Arrived - 07:30am" },
    { title: "Ijk", date: "Sat, 25th Aug 2024", time: "Arrived - 07:30am" },
    { title: "Mno", date: "Sat, 25th Aug 2024", time: "Arrived - 07:30am" },
    { title: "Delivery Expected", date: "Sat, 25th Aug 2024", time: "" },
    {
      title: "Delivered",
      date: "Sat, 25th Aug 2024",
      time: "Arrived - 07:30am",
    },
  ];

  const primaryColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.dark.secondary },
    "primary"
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          iconName="chevron-back"
          size="small"
          variant="primary"
          style={styles.backButton}
          iconStyle={{ color: "white" }}
          onPress={() => router.back()}
        />
        <ThemedText style={styles.headingText}>{t("Order Status")}</ThemedText>
      </View>
      <View style={styles.secondaryHeader}>
        <Text style={styles.routeText}>{`${t("Your Route")}:- ${t("abc")} > ${t(
          "efg"
        )} > ${t("ijk")} > ${t("mno")}...`}</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.timeline}>
          {orderSteps.map((step, index) => (
            <View key={index} style={styles.timelineItem}>
              <View
                style={[styles.timelineDot, { backgroundColor: primaryColor }]}
              />
              {index !== orderSteps.length - 1 && (
                <View
                  style={[
                    styles.timelineLine,
                    { backgroundColor: primaryColor },
                  ]}
                />
              )}
              <View style={styles.timelineContent}>
                <ThemedText style={styles.timelineTitle}>
                  {t(step.title)}
                </ThemedText>
                <ThemedText style={styles.timelineDate}>
                  {t(step.date)}
                </ThemedText>
                {step.time && (
                  <Text style={styles.timelineTime}>{t(step.time)}</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Sizes.StatusBarHeight,
    paddingBottom: Sizes.paddingLarge,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: Sizes.marginHorizontal,
    top: Sizes.StatusBarHeight,
    borderRadius: Sizes.borderRadiusFull,
  },
  headingText: {
    fontSize: Sizes.textLarge,
    fontWeight: "bold",
    marginTop: Sizes.marginExtraSmall,
  },
  secondaryHeader: {
    backgroundColor: Colors.light.primary,
    padding: Sizes.paddingMedium,
    marginHorizontal: Sizes.marginHorizontal,
    marginVertical: Sizes.marginExtraSmall,
    borderRadius: Sizes.borderRadiusLarge,
  },
  routeText: {
    color: "white",
    fontSize: Sizes.textNormal,
  },
  content: {
    flex: 1,
    padding: Sizes.paddingHorizontal,
  },
  timeline: {
    paddingLeft: Sizes.paddingExtraLarge,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: Sizes.marginMedium,
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
    marginLeft: -29,
  },
  timelineLine: {
    position: "absolute",
    left: -20,
    top: 20,
    bottom: -20,
    width: 2,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: Sizes.textMedium,
    fontWeight: "bold",
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: Sizes.textNormal,
  },
  timelineTime: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
});

export default OrderStatus;
