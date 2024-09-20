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
import * as ImagePicker from "expo-image-picker";
import Colors from "@/constants/Colors";
import Sizes from "@/constants/Sizes";
import { t } from "i18next";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import TextInputField from "@/components/input-fields/TextInputField";
import SelectListWithDialog from "@/components/input-fields/SelectListWithDialog";
import Button from "@/components/button/Button";
import { useThemeColor } from "@/hooks/useThemeColor";

interface Item {
  id: string;
  name: string;
  image: string;
  description?: string;
}

const EditProductBrandCategoryPage: React.FC = () => {
  const [itemType, setItemType] = useState<"product" | "brand" | "category">(
    "product"
  );
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedImage, setEditedImage] = useState("");

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

  useEffect(() => {
    const fetchItems = async () => {
      // In a real application, this would be an API call
      const mockItems: Item[] = [
        {
          id: "1",
          name: `${itemType} 1`,
          image: "https://via.placeholder.com/100",
          description: `Description for ${itemType} 1`,
        },
        {
          id: "2",
          name: `${itemType} 2`,
          image: "https://via.placeholder.com/100",
          description: `Description for ${itemType} 2`,
        },
        {
          id: "3",
          name: `${itemType} 3`,
          image: "https://via.placeholder.com/100",
          description: `Description for ${itemType} 3`,
        },
      ];
      setItems(mockItems);
      setSelectedItem(null);
      setEditedName("");
      setEditedDescription("");
      setEditedImage("");
    };

    fetchItems();
  }, [itemType]);

  const handleItemSelect = (item: Item) => {
    setSelectedItem(item);
    setEditedName(item.name);
    setEditedDescription(item.description || "");
    setEditedImage(item.image);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setEditedImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (selectedItem) {
      Alert.alert(
        t("Confirm Edit"),
        t(`Are you sure you want to save changes to this ${itemType}?`),
        [
          {
            text: t("Cancel"),
            style: "cancel",
          },
          {
            text: t("Save"),
            onPress: () => {
              const updatedItems = items.map((item) =>
                item.id === selectedItem.id
                  ? {
                      ...item,
                      name: editedName,
                      description: editedDescription,
                      image: editedImage,
                    }
                  : item
              );
              setItems(updatedItems);
              setSelectedItem(null);
              console.log(`Edited ${itemType}: ${editedName}`);
            },
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
            selectedOption={t(
              itemType.charAt(0).toUpperCase() + itemType.slice(1)
            )}
            onSelect={(value) =>
              setItemType(
                value.toLowerCase() as "product" | "brand" | "category"
              )
            }
            placeholder={t("Select Item Type")}
            defaultText={t("Select Item Type")}
            initialSelectedOption={t(
              itemType.charAt(0).toUpperCase() + itemType.slice(1)
            )}
          />

          <ThemedText style={styles.listHeader}>
            {t(`Select ${itemType} to edit`)}
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
              onPress={() => handleItemSelect(item)}
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

          {selectedItem && (
            <View style={styles.editSection}>
              <ThemedText style={styles.editHeader}>
                {t(`Edit ${itemType} Details`)}
              </ThemedText>

              <TouchableOpacity
                style={styles.imagePickerContainer}
                onPress={pickImage}
              >
                <Image source={{ uri: editedImage }} style={styles.editImage} />
                <ThemedText style={styles.changeImageText}>
                  {t("Change Image")}
                </ThemedText>
              </TouchableOpacity>

              <TextInputField
                label={t(
                  `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} Name`
                )}
                value={editedName}
                onChangeText={setEditedName}
                style={styles.inputContainer}
              />

              <TextInputField
                label={t(
                  `${
                    itemType.charAt(0).toUpperCase() + itemType.slice(1)
                  } Description`
                )}
                value={editedDescription}
                onChangeText={setEditedDescription}
                multiline
                style={[styles.inputContainer, styles.textArea]}
              />
            </View>
          )}
        </ScrollView>

        <ThemedView style={styles.buttonRow}>
          <Button
            title={t("Save Changes")}
            size="medium"
            onPress={handleSave}
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
  editSection: {
    marginTop: Sizes.marginLarge,
  },
  editHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: Sizes.marginMedium,
  },
  imagePickerContainer: {
    alignItems: "center",
    marginBottom: Sizes.marginMedium,
  },
  editImage: {
    width: 100,
    height: 100,
    borderRadius: Sizes.borderRadiusMedium,
    marginBottom: Sizes.marginSmall,
  },
  changeImageText: {
    color: Colors.light.primary,
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: Sizes.marginMedium,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
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

export default EditProductBrandCategoryPage;
