import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
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
import { responsive, vw, vh } from "@/utils/responsive";

type PriceBasedOn = "piece" | "quintal";
type ImageType = "main" | "extra";

interface ProductImage {
  uri: string;
  type: ImageType;
}

const productCategories = ["Electronics", "Clothing", "Toys", "Books", "Home"];
const productBrands = ["Apple", "Samsung", "Google", "Microsoft", "Amazon"];

const AddProductPage: React.FC = () => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productSubheading, setProductSubheading] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [priceBasedOn, setPriceBasedOn] = useState<PriceBasedOn>("piece");
  const [productStock, setProductStock] = useState("");
  const [productCategory, setProductCategory] = useState(productCategories[0]);
  const [productBrand, setProductBrand] = useState(productBrands[0]);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const iconColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.dark.secondary },
    "primary",
  );

  const pickImage = async (type: ImageType) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      const newImage = { uri: result.assets[0].uri, type };
      setProductImages((prev) =>
        type === "main"
          ? [
              { uri: result.assets[0].uri, type },
              ...prev.filter((img) => img.type !== "main"),
            ]
          : [...prev, newImage],
      );
    }
  };

  const removeImage = (index: number) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddProduct = () => console.log("Adding product");

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity
            style={styles.imagePickerMain}
            onPress={() => pickImage("main")}
          >
            {productImages.find((img) => img.type === "main") ? (
              <Image
                source={{
                  uri: productImages.find((img) => img.type === "main")!.uri,
                }}
                style={styles.productImage}
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera" size={40} color={iconColor} />
                <ThemedText style={styles.imagePlaceholderText}>
                  {t("Tap to add main product image")}
                </ThemedText>
              </View>
            )}
          </TouchableOpacity>

          {[
            {
              label: t("Product Name"),
              value: productName,
              setter: setProductName,
            },
            {
              label: t("Product Subheading (Optional)"),
              value: productSubheading,
              setter: setProductSubheading,
            },
          ].map((input, index) => (
            <TextInputField
              key={index}
              label={input.label}
              value={input.value}
              onChangeText={input.setter}
              style={styles.inputContainer}
            />
          ))}

          <TextInputField
            label={t("Product Description")}
            value={productDescription}
            onChangeText={setProductDescription}
            multiline
            style={[styles.inputContainer, styles.textArea]}
          />

          <SelectListWithDialog
            label={t("Product Category")}
            options={productCategories}
            selectedOption={productCategory}
            onSelect={(value) => setProductCategory(value as string)}
            placeholder={t("Select Category")}
            defaultText={t("Select Category")}
            initialSelectedOption={productCategory}
          />

          <SelectListWithDialog
            label={t("Product Brand")}
            options={productBrands}
            selectedOption={productBrand}
            onSelect={(value) => setProductBrand(value as string)}
            placeholder={t("Select Brand")}
            defaultText={t("Select Brand")}
            initialSelectedOption={productBrand}
          />

          <View style={styles.row}>
            <TextInputField
              label={t("Price")}
              value={productPrice}
              onChangeText={setProductPrice}
              keyboardType="numeric"
              style={styles.flex1}
            />
            <View style={[styles.flex1, styles.marginLeft]}>
              <SelectListWithDialog
                options={[t("Piece"), t("Quintal")]}
                selectedOption={priceBasedOn}
                onSelect={(value) => setPriceBasedOn(value as PriceBasedOn)}
                placeholder={t("Unit")}
                defaultText={t("Unit")}
                initialSelectedOption={priceBasedOn}
                label={t("Price Per")}
              />
            </View>
          </View>

          <TextInputField
            label={t("Product Stock")}
            value={productStock}
            onChangeText={setProductStock}
            keyboardType="numeric"
            style={styles.inputContainer}
          />

          <View style={styles.extraImagesContainer}>
            <ThemedText style={styles.label}>
              {t("Additional Product Images")}
            </ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={styles.imagePickerExtra}
                onPress={() => pickImage("extra")}
              >
                <Ionicons name="add" size={40} color={iconColor} />
                <ThemedText style={styles.addExtraImageText}>
                  {t("Add")}
                </ThemedText>
              </TouchableOpacity>
              {productImages
                .filter((img) => img.type === "extra")
                .map((image, index) => (
                  <View key={index} style={styles.extraImageContainer}>
                    <Image
                      source={{ uri: image.uri }}
                      style={styles.extraImage}
                    />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}
                    >
                      <Ionicons
                        name="close-circle"
                        size={24}
                        color={Colors.light.error}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
            </ScrollView>
          </View>
        </ScrollView>
        <Button
          title={t("Add Product")}
          size="medium"
          onPress={handleAddProduct}
          style={styles.addButton}
        />
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
    borderTopLeftRadius: responsive(Sizes.borderRadiusLarge),
    borderTopRightRadius: responsive(Sizes.borderRadiusLarge),
    marginTop: responsive(Sizes.marginMedium),
    paddingBottom: responsive(60),
  },
  scrollContent: {
    flexGrow: 1,
    padding: responsive(Sizes.paddingMedium),
  },
  imagePickerMain: {
    width: "100%",
    height: responsive(200),
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: responsive(Sizes.borderRadiusMedium),
    overflow: "hidden",
    marginBottom: responsive(Sizes.marginLarge),
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    marginTop: responsive(Sizes.marginSmall),
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: responsive(Sizes.marginMedium),
  },
  textArea: {
    height: "auto",
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flex1: {
    flex: 1,
  },
  marginLeft: {
    marginLeft: responsive(Sizes.marginMedium),
  },
  extraImagesContainer: {
    marginTop: responsive(Sizes.marginLarge),
  },
  label: {
    marginBottom: responsive(Sizes.marginSmall),
  },
  imagePickerExtra: {
    width: responsive(100),
    height: responsive(100),
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: responsive(Sizes.borderRadiusSmall),
    justifyContent: "center",
    alignItems: "center",
    marginRight: responsive(Sizes.marginMedium),
    marginVertical: responsive(Sizes.marginMedium),
  },
  extraImageContainer: {
    width: responsive(100),
    height: responsive(100),
    position: "relative",
    marginRight: responsive(Sizes.marginMedium),
    marginVertical: responsive(Sizes.marginMedium),
  },
  extraImage: {
    width: "100%",
    height: "100%",
    borderRadius: responsive(Sizes.borderRadiusSmall),
  },
  removeImageButton: {
    position: "absolute",
    top: responsive(-10),
    right: responsive(-10),
  },
  addExtraImageText: {
    marginTop: responsive(Sizes.marginSmall),
    textAlign: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});

export default AddProductPage;
