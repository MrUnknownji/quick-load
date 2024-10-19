import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import TextInputField from "@/components/input-fields/TextInputField";
import SelectListWithDialog from "@/components/input-fields/SelectListWithDialog";
import Button from "@/components/button/Button";
import CheckBoxDropdownWithDialog from "@/components/input-fields/CheckBoxDropdownWithDialog";
import {
  useAddProductOwner,
  useUpdateProductOwner,
  useFetchProductOwnerByUserId,
} from "@/hooks/useFetchProduct";
import { responsive, vh, vw } from "@/utils/responsive";
import Colors from "@/constants/Colors";
import Sizes from "@/constants/Sizes";
import FileUploadField from "@/components/input-fields/FileUploadField";
import Alert from "@/components/popups/Alert";
import * as DocumentPicker from "expo-document-picker";
import { INDIAN_CITIES, INDIAN_STATES } from "@/assets/data/DATA";
import { useContextUser } from "@/contexts/userContext";
import { router } from "expo-router";

const MyShopPage = () => {
  const { t } = useTranslation();
  const { addProductOwner, loading: addLoading } = useAddProductOwner();
  const { updateProductOwner, loading: updateLoading } =
    useUpdateProductOwner();
  const {
    productOwner,
    loading: fetchLoading,
    error: fetchError,
  } = useFetchProductOwnerByUserId();

  const { user } = useContextUser();

  const [formState, setFormState] = useState({
    productOwnerName: "",
    phoneNumber: user?.phone ?? "",
    gstNumber: "",
    shopImage: "",
    shopAddress: "",
    shopRating: 4,
    state: "",
    city: "",
    otherCity: "",
    productType: [] as string[],
  });
  const [updatedFields, setUpdatedFields] = useState<{ [key: string]: any }>(
    {},
  );
  const [alertState, setAlertState] = useState({
    visible: false,
    message: "",
    type: "info" as "error" | "success" | "info",
  });

  const states = INDIAN_STATES;
  const cities = [...INDIAN_CITIES, "Other"];
  const productTypes = ["Bricks", "Grit", "Bajri", "Cement"];

  useEffect(() => {
    if (productOwner) {
      setFormState({
        productOwnerName: productOwner.productOwnerName,
        phoneNumber: productOwner.phoneNumber.toString(),
        gstNumber: productOwner.gstNumber,
        shopImage: productOwner.shopImage,
        shopAddress: productOwner.shopAddress,
        shopRating: productOwner.shopRating,
        state: productOwner.state,
        city: productOwner.city,
        otherCity: "",
        productType: productOwner.productType,
      });
    }
  }, [productOwner]);

  const handleInputChange = (field: string) => (value: string | string[]) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    setUpdatedFields((prev) => ({
      ...prev,
      [field]: value,
      phoneNumber: formState.phoneNumber,
    }));
  };

  const handleFileSelect = (result: DocumentPicker.DocumentPickerResult) => {
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      setFormState((prev) => ({ ...prev, shopImage: file.name }));
      setUpdatedFields((prev) => ({ ...prev, shopImage: file }));
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(updatedFields).length === 0) {
      router.back();
      return;
    }
    const requiredFields = [
      "productOwnerName",
      "phoneNumber",
      "gstNumber",
      "shopImage",
      "shopAddress",
      "state",
      "city",
      "productType",
    ];

    const missingFields = requiredFields.filter(
      (field) => !formState[field as keyof typeof formState],
    );

    if (missingFields.length > 0) {
      setAlertState({
        visible: true,
        message: `${t("Please fill in all required fields:")} ${missingFields.join(", ")}`,
        type: "error",
      });
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(updatedFields).forEach(([key, value]) => {
        if (key === "productType") {
          (value as string[]).forEach((type) =>
            formData.append("productType[]", type),
          );
        } else if (value && typeof value === "object" && "uri" in value) {
          formData.append(key, {
            uri: value.uri,
            type: value.mimeType,
            name: value.name,
          } as any);
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      formData.append("shopRating", formState.shopRating.toString());

      let result;
      if (productOwner && productOwner.userId) {
        result = await updateProductOwner(productOwner?._id ?? "", formData);
      } else {
        result = await addProductOwner(formData);
      }

      if (result && result._id) {
        setAlertState({
          visible: true,
          message: t("Shop information saved successfully"),
          type: "success",
        });
      } else {
        throw new Error("Failed to save shop information");
      }
    } catch (error) {
      console.error("Error saving shop information:", error);
      setAlertState({
        visible: true,
        message:
          error instanceof Error
            ? error.message
            : t("Failed to save shop information. Please try again."),
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

  if (fetchLoading || addLoading || updateLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: responsive(80) }}
      >
        <TextInputField
          label={t("Shop Name")}
          isMandatory
          value={formState.productOwnerName}
          onChangeText={handleInputChange("productOwnerName")}
        />
        <TextInputField
          label={t("Phone Number")}
          isMandatory
          value={formState.phoneNumber}
          onChangeText={handleInputChange("phoneNumber")}
          keyboardType="phone-pad"
        />
        <TextInputField
          label={t("GST Number")}
          isMandatory
          value={formState.gstNumber}
          onChangeText={handleInputChange("gstNumber")}
        />
        <FileUploadField
          label={t("Shop Photo")}
          // subLabel={t(".jpeg, .jpg, .png of less than 1MB")}
          isMandatory
          onFileSelect={handleFileSelect}
          selectedFile={formState.shopImage}
          allowedExtensions={["jpg", "jpeg", "png"]}
        />
        <TextInputField
          label={t("Address")}
          isMandatory
          value={formState.shopAddress}
          onChangeText={handleInputChange("shopAddress")}
          multiline
          numberOfLines={3}
        />
        <View style={styles.row}>
          <SelectListWithDialog
            label={t("Select State")}
            defaultText={t("State")}
            isMandatory
            options={states}
            selectedOption={formState.state}
            onSelect={handleInputChange("state")}
            containerStyle={styles.halfWidth}
          />
          <SelectListWithDialog
            label={t("Select City")}
            defaultText={t("City")}
            isMandatory
            options={cities}
            selectedOption={formState.city}
            onSelect={handleInputChange("city")}
            containerStyle={styles.halfWidth}
          />
        </View>
        {formState.city === "Other" && (
          <TextInputField
            label={t("Other City")}
            isMandatory
            value={formState.otherCity}
            onChangeText={handleInputChange("otherCity")}
          />
        )}
        <CheckBoxDropdownWithDialog
          label={t("Select Product Types")}
          isMandatory
          options={productTypes}
          selectedOptions={formState.productType}
          onSelect={handleInputChange("productType")}
        />
      </ScrollView>
      <Button
        title={
          productOwner && productOwner.userId ? t("Update Shop") : t("Add Shop")
        }
        onPress={handleSubmit}
        style={styles.submitButton}
        disabled={addLoading || updateLoading}
      />
      <Alert
        message={alertState.message}
        type={alertState.type}
        visible={alertState.visible}
        onClose={handleCloseAlert}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },
  submitButton: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  errorText: {
    fontSize: responsive(Sizes.textSmall),
    color: Colors.light.error,
    marginTop: vh(1),
  },
  imagePickerContainer: {
    marginBottom: vh(2),
  },
  label: {
    fontSize: responsive(Sizes.textSmall),
    marginBottom: vh(1),
  },
  subLabel: {
    fontSize: responsive(Sizes.textSmall),
    color: Colors.light.textSecondary,
  },
  mandatoryIndicator: {
    fontSize: responsive(Sizes.textSmall),
    color: Colors.light.error,
    marginLeft: vw(0.5),
  },
  imagePicker: {
    width: "100%",
    height: vh(20),
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: responsive(Sizes.borderRadiusSmall),
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholder: {
    alignItems: "center",
  },
  placeholderText: {
    marginTop: vh(1),
    fontSize: responsive(Sizes.textSmall),
    color: Colors.light.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MyShopPage;
