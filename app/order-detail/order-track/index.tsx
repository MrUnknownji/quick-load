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
import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { responsive, vw, vh } from "@/utils/responsive";

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
    "primary",
  );

  return (
    <SafeAreaWrapper>
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
          <ThemedText style={styles.headingText}>
            {t("Order Status")}
          </ThemedText>
        </View>
        <View style={styles.secondaryHeader}>
          <Text
            style={styles.routeText}
          >{`${t("Your Route")}:- ${t("abc")} > ${t(
            "efg",
          )} > ${t("ijk")} > ${t("mno")}...`}</Text>
        </View>
        <ScrollView style={styles.content}>
          <View style={styles.timeline}>
            {orderSteps.map((step, index) => (
              <View key={index} style={styles.timelineItem}>
                <View
                  style={[
                    styles.timelineDot,
                    { backgroundColor: primaryColor },
                  ]}
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
    borderRadius: responsive(Sizes.borderRadiusFull),
  },
  headingText: {
    fontSize: responsive(Sizes.textLarge),
    fontWeight: "bold",
    marginTop: responsive(Sizes.marginLarge),
  },
  secondaryHeader: {
    backgroundColor: Colors.light.primary,
    padding: responsive(Sizes.paddingMedium),
    marginHorizontal: responsive(Sizes.marginHorizontal),
    marginVertical: responsive(Sizes.marginExtraSmall),
    borderRadius: responsive(Sizes.borderRadiusLarge),
  },
  routeText: {
    color: "white",
    fontSize: responsive(Sizes.textNormal),
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
  timelineDate: {
    fontSize: responsive(Sizes.textNormal),
  },
  timelineTime: {
    fontSize: responsive(14),
    color: Colors.light.textSecondary,
  },
});

export default OrderStatus;
