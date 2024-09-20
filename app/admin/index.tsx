import React from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  TouchableHighlightComponent,
  TouchableNativeFeedback,
  View,
  TouchableNativeFeedbackComponent,
} from "react-native";
import { router } from "expo-router";
import Colors from "@/constants/Colors";
import Sizes from "@/constants/Sizes";
import { t } from "i18next";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";

interface DashboardOptionProps {
  title: string;
  icon: string;
  onPress: () => void;
}

const DashboardOption: React.FC<DashboardOptionProps> = ({
  title,
  icon,
  onPress,
}) => {
  const backgroundColor = useThemeColor(
    {
      light: Colors.light.backgroundSecondary,
      dark: Colors.dark.backgroundSecondary,
    },
    "backgroundSecondary"
  );
  const iconColor = useThemeColor(
    {
      light: Colors.light.primary,
      dark: Colors.dark.secondary,
    },
    "primary"
  );
  return (
    <View style={styles.optionCardItemContainer}>
      <TouchableNativeFeedback onPress={onPress}>
        <View style={[styles.optionCard, { backgroundColor }]}>
          <Ionicons name={icon as any} size={24} color={iconColor} />
          <ThemedText style={styles.optionText}>{title}</ThemedText>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

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
      title: "Edit Product/Brand/Category",
      icon: "pencil",
      onPress: () => router.push("/admin/edit-page"),
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
  optionCardItemContainer: {
    width: "48%",
    borderRadius: Sizes.borderRadiusMedium,
    overflow: "hidden",
    aspectRatio: 1,
    elevation: 2,
    marginBottom: Sizes.marginMedium,
  },
  optionCard: {
    aspectRatio: 1,
    borderRadius: Sizes.borderRadiusMedium,
    justifyContent: "center",
    alignItems: "center",
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
