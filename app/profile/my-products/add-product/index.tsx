import React, { useEffect, useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Colors from "@/constants/Colors";
import { t } from "i18next";
import { ThemedView } from "@/components/ThemedView";
import TextInputField from "@/components/input-fields/TextInputField";
import SelectListWithDialog from "@/components/input-fields/SelectListWithDialog";
import IconButton from "@/components/button/IconButton";
import Alert from "@/components/popups/Alert";
import {
  useFetchProductById,
  useAddProduct,
  useUpdateProduct,
  useFetchProductOwnerByUserId,
} from "@/hooks/useFetchProduct";
import * as DocumentPicker from "expo-document-picker";
import FileUploadField from "@/components/input-fields/FileUploadField";
import { Product } from "@/types/Product";
import { responsive } from "@/utils/responsive";
import Sizes from "@/constants/Sizes";

const productTypes = ["Grit", "Bajri", "Bricks", "Cement"];

const AddProductPage: React.FC = () => {
  const { productId, isEdit } = useLocalSearchParams<{
    productId: string;
    isEdit: string;
  }>();
  const [formState, setFormState] = useState<Partial<Product>>({});
  const [updatedFields, setUpdatedFields] = useState<{ [key: string]: any }>(
    {},
  );
  const [alertState, setAlertState] = useState({
    visible: false,
    message: "",
    type: "error" as "error" | "success",
  });

  const { product, loading: productLoading } = useFetchProductById(
    isEdit === "true" ? productId || "" : "",
  );
  const { addProduct, loading: addLoading } = useAddProduct();
  const { updateProduct, loading: updateLoading } = useUpdateProduct();
  const { productOwner, loading: ownerLoading } =
    useFetchProductOwnerByUserId();

  useEffect(() => {
    if (isEdit === "true" && product) {
      setFormState(product);
    }
  }, [isEdit, product]);

  const handleInputChange = (field: keyof Product) => (value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    setUpdatedFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (result: DocumentPicker.DocumentPickerResult) => {
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      setFormState((prev) => ({ ...prev, productImage: file.name }));
      setUpdatedFields((prev) => ({ ...prev, productImage: file }));
    }
  };

  const handleAddProduct = async () => {
    const requiredFields: (keyof Product)[] = [
      "productPrice",
      "productSize",
      "productQuantity",
      "productType",
      "productDetails",
      "productImage",
    ];

    const missingFields = requiredFields.filter(
      (field) => !formState[field] || formState[field] === "",
    );

    if (missingFields.length > 0) {
      setAlertState({
        visible: true,
        message: `${t("Please fill in all required fields:")} ${missingFields.join(", ")}`,
        type: "error",
      });
      return;
    }

    if (!productOwner) {
      setAlertState({
        visible: true,
        message: t("Product owner information not found"),
        type: "error",
      });
      return;
    }

    try {
      const formData = new FormData();

      Object.entries(updatedFields).forEach(([key, value]) => {
        if (value && typeof value === "object" && "uri" in value) {
          formData.append(key, {
            uri: value.uri,
            type: value.mimeType,
            name: value.name,
          } as any);
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      formData.append("productOwnerId", productOwner._id || "");
      formData.append("productLocation", productOwner.shopAddress || "");
      formData.append("productRating", "0");

      let result: Product | undefined;
      if (isEdit === "true" && productId) {
        result = await updateProduct(productId, formData);
      } else {
        result = await addProduct(formData);
      }

      if (result && result._id) {
        setAlertState({
          visible: true,
          message: t("Product saved successfully"),
          type: "success",
        });
      } else {
        throw new Error("Failed to save product");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      setAlertState({
        visible: true,
        message:
          error instanceof Error
            ? error.message
            : t("Failed to save product data. Please try again."),
        type: "error",
      });
    }
  };

  const handleCloseAlert = () => {
    setAlertState((prev) => ({ ...prev, visible: false }));
    if (alertState.type === "success") {
      router.back();
    }
  };

  const isLoading =
    productLoading || addLoading || updateLoading || ownerLoading;

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
          <SelectListWithDialog
            label={t("Product Type")}
            options={productTypes}
            selectedOption={formState.productType || ""}
            onSelect={handleInputChange("productType")}
            placeholder={t("Select Product Type")}
            isMandatory={true}
          />
          <TextInputField
            label={t("Product Size")}
            value={formState.productSize}
            onChangeText={handleInputChange("productSize")}
            placeholder={
              formState.productType === "Bricks" ? "ex. 1 Number" : "ex. 1 mm"
            }
            isMandatory={true}
          />
          <TextInputField
            label={t("Product Quantity")}
            subLabel={
              formState.productType === "Bricks"
                ? t("Number of pieces")
                : t("Number of quintals")
            }
            value={formState.productQuantity?.toString()}
            onChangeText={handleInputChange("productQuantity")}
            placeholder={`${t("Number only")}`}
            keyboardType="numeric"
            isMandatory={true}
          />
          <TextInputField
            label={t("Price")}
            subLabel={
              formState.productType === "Bricks"
                ? t("Rs. per 1000 pieces")
                : t("Rs. per quintal")
            }
            placeholder="ex. 3500"
            value={formState.productPrice?.toString()}
            onChangeText={handleInputChange("productPrice")}
            keyboardType="numeric"
            isMandatory={true}
          />
          <FileUploadField
            label={t("Product Image")}
            onFileSelect={handleFileSelect}
            selectedFile={formState.productImage}
            allowedExtensions={["jpg", "jpeg", "png"]}
            isMandatory={true}
          />
          <TextInputField
            label={t("Product Description")}
            placeholder={t("Describe your product in detail")}
            value={formState.productDetails}
            onChangeText={handleInputChange("productDetails")}
            multiline={true}
            numberOfLines={2}
            isMandatory={true}
          />
        </ScrollView>
        <IconButton
          iconName={isEdit === "true" ? "save" : "add"}
          size="small"
          title={isEdit === "true" ? t("Update Product") : t("Add Product")}
          variant="primary"
          style={styles.addButton}
          onPress={handleAddProduct}
        />
      </ThemedView>
      <Alert
        message={alertState.message}
        type={alertState.type}
        visible={alertState.visible}
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
  },
  scrollContent: {
    flexGrow: 1,
    padding: responsive(Sizes.paddingMedium),
    paddingBottom: responsive(400),
  },
  addButton: {
    position: "absolute",
    bottom: responsive(Sizes.marginLarge),
    right: responsive(Sizes.marginHorizontal),
    borderRadius: responsive(Sizes.borderRadiusFull),
    paddingHorizontal: responsive(Sizes.paddingMedium),
    paddingVertical: responsive(Sizes.paddingMedium),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AddProductPage;
