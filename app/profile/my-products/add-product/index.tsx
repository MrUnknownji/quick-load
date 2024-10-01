import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
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
import { responsive } from "@/utils/responsive";
import Alert from "@/components/popups/Alert";
import {
  useFetchProductById,
  useAddProduct,
  useUpdateProduct,
} from "@/hooks/useFetchProduct";
import { useUser } from "@/contexts/UserContext";

const productTypes = ["Grit", "Bajri", "Bricks"];

const AddProductPage: React.FC = () => {
  const { productId, isEdit } = useLocalSearchParams<{
    productId: string;
    isEdit: string;
  }>();
  const { currentUser } = useUser();
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productType, setProductType] = useState(productTypes[0]);
  const [productSize, setProductSize] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productLocation, setProductLocation] = useState("");
  const [productRating, setProductRating] = useState("");
  const [productImage, setProductImage] = useState<string | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const {
    product,
    loading: productLoading,
    error: productError,
  } = useFetchProductById(isEdit === "true" ? productId || "" : "");

  const { addProduct, loading: addLoading, error: addError } = useAddProduct();
  const {
    updateProduct,
    loading: updateLoading,
    error: updateError,
  } = useUpdateProduct();

  const iconColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.dark.secondary },
    "primary",
  );

  useEffect(() => {
    if (isEdit === "true" && product) {
      setProductDescription(product.productDetails);
      setProductPrice(product.productPrice.toString());
      setProductType(product.productType);
      setProductSize(product.productSize);
      setProductImage(product.productImage);
    }
    setIsLoading(productLoading);
  }, [isEdit, product, productLoading]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setProductImage(result.assets[0].uri);
    }
  };

  const handleAddProduct = async () => {
    const requiredFields = [
      { field: "Image", value: productImage },
      { field: "Product Type", value: productType },
      { field: "Product Size", value: productSize },
      { field: "Product Quantity", value: productQuantity },
      { field: "Price", value: productPrice },
      { field: "Description", value: productDescription },
    ];

    const missingFields = requiredFields.filter((field) => !field.value);

    if (missingFields.length > 0) {
      const missingFieldNames = missingFields
        .map((field) => field.field)
        .join(", ");

      setAlertMessage(
        `${t("Please fill in the following required fields:")}\n\n${missingFieldNames}`,
      );
      setAlertVisible(true);
      return;
    }
    setProductLocation(currentUser?.address ?? "");
    setProductRating("0");
    try {
      const formData = new FormData();
      formData.append("productOwner", currentUser?._id || "");
      formData.append("productPrice", productPrice);
      formData.append("productSize", productSize);
      formData.append("productQuantity", productQuantity);
      formData.append("productLocation", productLocation);
      formData.append("productRating", productRating);
      formData.append("productType", productType);
      formData.append("productDetails", productDescription);

      if (productImage) {
        formData.append("productImage", {
          uri: productImage,
          type: "image/jpeg",
          name: "product_image.jpg",
        } as any);
      }

      if (isEdit === "true" && productId) {
        await updateProduct(productId, formData);
      } else {
        await addProduct(formData);
      }
      router.back();
    } catch (error) {
      console.error("Error saving product:", error);
      setAlertMessage("Failed to save product data. Please try again.");
      setAlertVisible(true);
    }
  };

  const handleCloseAlert = () => {
    setAlertVisible(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ThemedView style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity style={styles.imagePickerMain} onPress={pickImage}>
            {productImage ? (
              <Image
                source={{ uri: productImage }}
                style={styles.productImage}
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera" size={40} color={iconColor} />
                <ThemedText style={styles.imagePlaceholderText}>
                  {t("Tap to add product image")}
                </ThemedText>
              </View>
            )}
          </TouchableOpacity>

          <SelectListWithDialog
            label={t("Product Type")}
            options={productTypes}
            selectedOption={productType}
            onSelect={(value) => setProductType(value as string)}
            placeholder={t("Select Product Type")}
            initialSelectedOption={productType}
            isMandatory
          />

          <TextInputField
            label={t("Product Size")}
            value={productSize}
            onChangeText={setProductSize}
            placeholder={productType === "Bricks" ? "ex. 1 Number" : "ex. 1 mm"}
            isMandatory
          />
          <TextInputField
            label={t("Product Quantity")}
            subLabel={
              productType === "Bricks"
                ? "Number of pieces"
                : "Number of quintals"
            }
            value={productQuantity}
            onChangeText={setProductQuantity}
            placeholder={"Number only"}
            isMandatory
          />
          <TextInputField
            label={t("Price")}
            subLabel={
              productType === "Bricks"
                ? "Rs. per 1000 pieces"
                : "Rs. per quintal"
            }
            placeholder="ex. 3500"
            value={productPrice}
            onChangeText={setProductPrice}
            keyboardType="numeric"
            style={styles.flex1}
            isMandatory
          />

          <TextInputField
            label={t("Product Description")}
            placeholder={t("Describe your product in detail")}
            value={productDescription}
            onChangeText={setProductDescription}
            multiline
            numberOfLines={2}
            style={[styles.inputContainer, styles.textArea]}
            isMandatory
          />
        </ScrollView>
        <Button
          title={isEdit === "true" ? t("Update Product") : t("Add Product")}
          size="medium"
          onPress={handleAddProduct}
          style={styles.addButton}
        />
      </ThemedView>
      <Alert
        message={alertMessage}
        type="error"
        visible={alertVisible}
        onClose={handleCloseAlert}
      />
    </KeyboardAvoidingView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AddProductPage;
