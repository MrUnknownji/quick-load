import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  FlatList,
  ListRenderItem,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Colors from "@/constants/Colors";
import Sizes from "@/constants/Sizes";
import { t } from "i18next";
import { ThemedView } from "@/components/ThemedView";
import TextInputField from "@/components/input-fields/TextInputField";
import SelectListWithDialog from "@/components/input-fields/SelectListWithDialog";
import IconButton from "@/components/button/IconButton";
import { responsive } from "@/utils/responsive";
import Alert from "@/components/popups/Alert";
import {
  useFetchProductById,
  useAddProduct,
  useUpdateProduct,
} from "@/hooks/useFetchProduct";
import { useUser } from "@/contexts/UserContext";
import * as DocumentPicker from "expo-document-picker";
import FileUploadField from "@/components/input-fields/FileUploadField";
import { Product } from "@/types/Product";

const productTypes = ["Grit", "Bajri", "Bricks"];

type FormField = {
  type: "TextInputField" | "SelectListWithDialog" | "FileUploadField";
  props: any;
};

const AddProductPage: React.FC = () => {
  const { productId, isEdit } = useLocalSearchParams<{
    productId: string;
    isEdit: string;
  }>();
  const { currentUser } = useUser();
  const [formState, setFormState] = useState<Partial<Product>>({
    productDetails: "",
    productPrice: 0,
    productType: productTypes[0],
    productSize: "",
    productQuantity: 0,
    productLocation: "",
    productRating: 0,
    productImage: "",
  });
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

  useEffect(() => {
    if (isEdit === "true" && product) {
      setFormState((prev) => ({
        ...prev,
        ...product,
      }));
    }
    setIsLoading(productLoading);
  }, [isEdit, product, productLoading]);

  const handleInputChange = (field: keyof Product) => (value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddProduct = async () => {
    const requiredFields: (keyof Product)[] = [
      "productPrice",
      "productSize",
      "productQuantity",
      "productType",
      "productDetails",
    ];

    const missingFields = requiredFields.filter(
      (field) => !formState[field] || formState[field] === "",
    );

    if (missingFields.length > 0) {
      const missingFieldNames = missingFields
        .map((field) =>
          field
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())
            .trim(),
        )
        .join(", ");

      setAlertMessage(
        `${t("Please fill in the following required fields:")}\n\n${missingFieldNames}`,
      );
      setAlertVisible(true);
      return;
    }

    try {
      const formData = new FormData();

      // Add required fields
      formData.append("productOwnerId", currentUser?._id || "");
      formData.append("productPrice", formState.productPrice?.toString() || "");
      formData.append("productSize", formState.productSize || "");
      formData.append(
        "productQuantity",
        formState.productQuantity?.toString() || "",
      );
      formData.append("productLocation", currentUser?.address || "");
      formData.append("productRating", "0"); // Default to 0 for new products
      formData.append("productType", formState.productType || "");
      formData.append("productDetails", formState.productDetails || "");

      // Handle image upload
      if (formState.productImage) {
        const imageUri = formState.productImage;
        const filename = imageUri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename || "");
        const type = match ? `image/${match[1]}` : "image";

        formData.append("productImage", {
          uri: imageUri,
          name: filename,
          type,
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

  const handleFileSelect = (file: DocumentPicker.DocumentPickerResult) => {
    if (file.assets && file.assets.length > 0) {
      const selectedFile = file.assets[0];
      setFormState((prev) => ({ ...prev, productImage: selectedFile.name }));
    }
  };

  const formFields: FormField[] = [
    {
      type: "SelectListWithDialog",
      props: {
        label: t("Product Type"),
        options: productTypes,
        selectedOption: formState.productType || "",
        onSelect: handleInputChange("productType"),
        placeholder: t("Select Product Type"),
        isMandatory: true,
      },
    },
    {
      type: "TextInputField",
      props: {
        label: t("Product Size"),
        value: formState.productSize,
        onChangeText: handleInputChange("productSize"),
        placeholder:
          formState.productType === "Bricks" ? "ex. 1 Number" : "ex. 1 mm",
        isMandatory: true,
      },
    },
    {
      type: "TextInputField",
      props: {
        label: t("Product Quantity"),
        subLabel:
          formState.productType === "Bricks"
            ? "Number of pieces"
            : "Number of quintals",
        value: formState.productQuantity?.toString(),
        onChangeText: handleInputChange("productQuantity"),
        placeholder: "Number only",
        keyboardType: "numeric",
        isMandatory: true,
      },
    },
    {
      type: "TextInputField",
      props: {
        label: t("Price"),
        subLabel:
          formState.productType === "Bricks"
            ? "Rs. per 1000 pieces"
            : "Rs. per quintal",
        placeholder: "ex. 3500",
        value: formState.productPrice?.toString(),
        onChangeText: handleInputChange("productPrice"),
        keyboardType: "numeric",
        isMandatory: true,
      },
    },
    {
      type: "FileUploadField",
      props: {
        label: t("Product Image"),
        onFileSelect: handleFileSelect,
        selectedFile: formState.productImage,
        allowedExtensions: ["jpg", "jpeg", "png"],
        isMandatory: true,
      },
    },
    {
      type: "TextInputField",
      props: {
        label: t("Product Description"),
        placeholder: t("Describe your product in detail"),
        value: formState.productDetails,
        onChangeText: handleInputChange("productDetails"),
        multiline: true,
        numberOfLines: 2,
        isMandatory: true,
      },
    },
  ];

  const renderItem: ListRenderItem<FormField> = ({ item }) => {
    const Component =
      item.type === "TextInputField"
        ? TextInputField
        : item.type === "SelectListWithDialog"
          ? SelectListWithDialog
          : item.type === "FileUploadField"
            ? FileUploadField
            : View;
    return <Component {...item.props} />;
  };

  if (isLoading || addLoading || updateLoading) {
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
        <FlatList
          data={formFields}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.type}-${index}`}
          contentContainerStyle={styles.scrollContent}
        />
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
