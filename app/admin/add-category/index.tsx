import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
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
import IconButton from "@/components/button/IconButton";
import Button from "@/components/button/Button";

interface CategoryImage {
  uri: string;
}

const parentCategories = ["None", "Electronics", "Clothing", "Home", "Books"];

const AddCategoryPage: React.FC = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [parentCategory, setParentCategory] = useState(parentCategories[0]);
  const [categoryImage, setCategoryImage] = useState<CategoryImage | null>(
    null
  );

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setCategoryImage({ uri: result.assets[0].uri });
    }
  };

  const handleSaveAsDraft = () => console.log("Saving category as draft");
  const handleAddCategory = () => console.log("Adding category");
  const handleCancel = () => router.back();

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity style={styles.imagePickerMain} onPress={pickImage}>
            {categoryImage ? (
              <Image
                source={{ uri: categoryImage.uri }}
                style={styles.categoryImage}
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons
                  name="camera"
                  size={40}
                  color={Colors.light.primary}
                />
                <ThemedText style={styles.imagePlaceholderText}>
                  {t("Tap to add category image")}
                </ThemedText>
              </View>
            )}
          </TouchableOpacity>

          <TextInputField
            label={t("Category Name")}
            value={categoryName}
            onChangeText={setCategoryName}
            style={styles.inputContainer}
          />

          <TextInputField
            label={t("Category Description")}
            value={categoryDescription}
            onChangeText={setCategoryDescription}
            multiline
            style={[styles.inputContainer, styles.textArea]}
          />

          <SelectListWithDialog
            label={t("Parent Category")}
            options={parentCategories}
            selectedOption={parentCategory}
            onSelect={(value) => setParentCategory(value as string)}
            placeholder={t("Select Parent Category")}
            defaultText={t("Select Parent Category")}
            initialSelectedOption={parentCategory}
          />
        </ScrollView>
        <View style={styles.buttonRow}>
          <IconButton
            iconName="save-outline"
            variant="primary"
            size="small"
            onPress={handleSaveAsDraft}
          />
          <Button
            title={t("Add Category")}
            size="medium"
            onPress={handleAddCategory}
          />
          <IconButton
            iconName="close-circle"
            variant="primary"
            size="small"
            onPress={handleCancel}
          />
        </View>
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
  imagePickerMain: {
    width: "100%",
    height: 200,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: Sizes.borderRadiusMedium,
    overflow: "hidden",
    marginBottom: Sizes.marginLarge,
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    marginTop: Sizes.marginSmall,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: Sizes.marginMedium,
  },
  textArea: {
    height: 120,
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
  },
});

export default AddCategoryPage;
