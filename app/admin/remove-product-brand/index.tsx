import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Sizes from "@/constants/Sizes";
import { t } from "i18next";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import SelectListWithDialog from "@/components/input-fields/SelectListWithDialog";
import Button from "@/components/button/Button";
import { useThemeColor } from "@/hooks/useThemeColor";

interface Item {
  id: string;
  name: string;
  image: string;
}

const RemoveProductOrBrandPage: React.FC = () => {
  const [itemType, setItemType] = useState<"product" | "brand" | "category">(
    "product"
  );
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const selectedBorderColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.dark.secondary },
    "primary"
  );
  const selectedBackgroundColor = useThemeColor(
    {
      light: Colors.light.backgroundSecondary,
      dark: Colors.dark.backgroundSecondary,
    },
    "backgroundSecondary"
  );
  const iconColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.dark.secondary },
    "primary"
  );

  // Simulated data fetch
  useEffect(() => {
    const fetchItems = async () => {
      // In a real application, this would be an API call
      const mockItems: Item[] =
        itemType === "product"
          ? [
              {
                id: "1",
                name: "Product 1",
                image: "https://via.placeholder.com/100",
              },
              {
                id: "2",
                name: "Product 2",
                image: "https://via.placeholder.com/100",
              },
              {
                id: "3",
                name: "Product 3",
                image: "https://via.placeholder.com/100",
              },
            ]
          : itemType === "brand"
          ? [
              {
                id: "1",
                name: "Brand 1",
                image: "https://via.placeholder.com/100",
              },
              {
                id: "2",
                name: "Brand 2",
                image: "https://via.placeholder.com/100",
              },
              {
                id: "3",
                name: "Brand 3",
                image: "https://via.placeholder.com/100",
              },
            ]
          : [
              {
                id: "1",
                name: "Category 1",
                image: "https://via.placeholder.com/100",
              },
              {
                id: "2",
                name: "Category 2",
                image: "https://via.placeholder.com/100",
              },
              {
                id: "3",
                name: "Category 3",
                image: "https://via.placeholder.com/100",
              },
            ];
      setItems(mockItems);
      setSelectedItem(null);
    };

    fetchItems();
  }, [itemType]);

  const handleRemove = () => {
    if (selectedItem) {
      Alert.alert(
        t("Confirm Removal"),
        t(`Are you sure you want to remove this ${itemType}?`),
        [
          {
            text: t("Cancel"),
            style: "cancel",
          },
          {
            text: t("Remove"),
            onPress: () => {
              console.log(`Removing ${itemType}: ${selectedItem.name}`);
              setItems(items.filter((item) => item.id !== selectedItem.id));
              setSelectedItem(null);
            },
            style: "destructive",
          },
        ]
      );
    }
  };

  const handleCancel = () => router.back();

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <SelectListWithDialog
            label={t("Select Item Type")}
            options={[t("Product"), t("Brand"), t("Category")]}
            selectedOption={
              itemType === "product"
                ? t("Product")
                : itemType === "brand"
                ? t("Brand")
                : t("Category")
            }
            onSelect={(value) =>
              setItemType(
                value.toLowerCase() as "product" | "brand" | "category"
              )
            }
            placeholder={t("Select Item Type")}
            defaultText={t("Select Item Type")}
            initialSelectedOption={
              itemType === "product"
                ? t("Product")
                : itemType === "brand"
                ? t("Brand")
                : t("Category")
            }
          />

          <ThemedText style={styles.listHeader}>
            {t(`Select ${itemType} to remove`)}
          </ThemedText>

          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.itemContainer,
                selectedItem?.id === item.id && {
                  borderColor: selectedBorderColor,
                  backgroundColor: selectedBackgroundColor,
                },
              ]}
              onPress={() => setSelectedItem(item)}
            >
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <ThemedText style={styles.itemName}>{item.name}</ThemedText>
              {selectedItem?.id === item.id && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={iconColor}
                  style={styles.checkmark}
                />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ThemedView style={styles.buttonRow}>
          <Button
            title={t(`Remove ${itemType}`)}
            size="medium"
            onPress={handleRemove}
            disabled={!selectedItem}
          />
          <Button
            title={t("Cancel")}
            size="medium"
            variant="secondary"
            onPress={handleCancel}
          />
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    borderTopLeftRadius: Sizes.borderRadiusLarge,
    borderTopRightRadius: Sizes.borderRadiusLarge,
    marginTop: Sizes.marginMedium,
    paddingBottom: 60,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Sizes.paddingMedium,
  },
  listHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: Sizes.marginMedium,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: Sizes.paddingSmall,
    borderRadius: Sizes.borderRadiusMedium,
    marginBottom: Sizes.marginSmall,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: Sizes.borderRadiusSmall,
    marginRight: Sizes.marginMedium,
  },
  itemName: {
    flex: 1,
    fontSize: 16,
  },
  checkmark: {
    marginLeft: Sizes.marginSmall,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingHorizontal: Sizes.marginMedium,
    paddingVertical: Sizes.paddingSmall,
  },
});

export default RemoveProductOrBrandPage;
