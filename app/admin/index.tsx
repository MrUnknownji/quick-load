import React from "react";
import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import Colors from "@/constants/Colors";
import Sizes from "@/constants/Sizes";
import { t } from "i18next";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";

interface DashboardOptionProps {
  title: string;
  icon: string;
  onPress: () => void;
}

const DashboardOption: React.FC<DashboardOptionProps> = ({
  title,
  icon,
  onPress,
}) => (
  <TouchableOpacity style={styles.optionCard} onPress={onPress}>
    <Ionicons name={icon as any} size={24} color={Colors.light.primary} />
    <ThemedText style={styles.optionText}>{title}</ThemedText>
  </TouchableOpacity>
);

const AdminDashboard: React.FC = () => {
  const dashboardOptions: DashboardOptionProps[] = [
    {
      title: "Add Product",
      icon: "add-circle",
      onPress: () => router.push("/admin/add-product"),
    },
    {
      title: "Add Brand",
      icon: "briefcase",
      onPress: () => router.push("/admin/add-brand"),
    },
    {
      title: "Add Category",
      icon: "list",
      onPress: () => router.push("/admin/add-category"),
    },
    {
      title: "Remove Product/Brand/Category",
      icon: "trash",
      onPress: () => router.push("/admin/remove-product-brand"),
    },
    {
      title: "Block/Delete Account",
      icon: "person-remove",
      onPress: () => router.push("/admin/manage-accounts"),
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.welcomeText}>{t("Welcome Admin")}</ThemedText>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.optionsContainer}>
          {dashboardOptions.map((option, index) => (
            <DashboardOption key={index} {...option} />
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcomeText: {
    textAlign: "center",
    fontSize: Sizes.textLarge,
    fontWeight: "bold",
    marginVertical: Sizes.marginMedium,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Sizes.paddingMedium,
    paddingTop: 0,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  optionCard: {
    width: "48%",
    aspectRatio: 1,
    backgroundColor: Colors.light.background,
    borderRadius: Sizes.borderRadiusMedium,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Sizes.marginMedium,
    elevation: 2,
    padding: Sizes.paddingSmall,
  },
  optionText: {
    marginTop: Sizes.marginSmall,
    textAlign: "center",
    fontSize: Sizes.textSmall,
    fontWeight: "bold",
  },
});

export default AdminDashboard;
