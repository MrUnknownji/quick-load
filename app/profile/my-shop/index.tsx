import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import { useUser as useContextUser } from "@/contexts/UserContext";
import TextInputField from "@/components/input-fields/TextInputField";
import SelectListWithDialog from "@/components/input-fields/SelectListWithDialog";
import Button from "@/components/button/Button";
import CheckBoxDropdownWithDialog from "@/components/input-fields/CheckBoxDropdownWithDialog";
import {
  useAddProductOwner,
  useUpdateProductOwner,
} from "@/hooks/useFetchProduct";
import { responsive, vh, vw } from "@/utils/responsive";
import Colors from "@/constants/Colors";
import Sizes from "@/constants/Sizes";
import FileUploadField from "@/components/input-fields/FileUploadField";
import Alert from "@/components/popups/Alert";
import * as DocumentPicker from "expo-document-picker";

const MyShopPage = () => {
  const { t } = useTranslation();
  const { currentUser } = useContextUser();
  const {
    addProductOwner,
    loading: addLoading,
    error: addError,
  } = useAddProductOwner();
  const {
    updateProductOwner,
    loading: updateLoading,
    error: updateError,
  } = useUpdateProductOwner();

  const [formState, setFormState] = useState({
    productOwnerName: "",
    phoneNumber: "",
    gstNumber: "",
    shopImage: "",
    shopAddress: "",
    state: "",
    city: "",
    otherCity: "",
    productType: [] as string[],
  });
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const states = ["State 1", "State 2", "State 3"];
  const cities = ["City 1", "City 2", "City 3", "Other"];
  const productTypes = ["Bricks", "Grit", "Bajri", "Cement"];

  useEffect(() => {
    setTimeout(() => {
      if (currentUser?.productOwnerId) {
        setFormState({
          productOwnerName: "Sample Shop",
          phoneNumber: "1234567890",
          gstNumber: "GST1234567",
          shopImage: "",
          shopAddress: "123 Main St",
          state: "State 1",
          city: "City 1",
          otherCity: "",
          productType: ["Bricks", "Grit"],
        });
      }
      setIsLoading(false);
    }, 1000);
  }, [currentUser]);

  const handleInputChange = (field: string) => (value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (file: DocumentPicker.DocumentPickerResult) => {
    if (file.assets && file.assets.length > 0) {
      const selectedFile = file.assets[0];
      setFormState((prev) => ({ ...prev, shopImage: selectedFile.uri }));
    }
  };

  const handleSubmit = async () => {
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
      setAlertMessage(
        `Please fill in all required fields: ${missingFields.join(", ")}`,
      );
      setAlertVisible(true);
      return;
    }

    const formData = new FormData();
    Object.entries(formState).forEach(([key, value]) => {
      if (key === "productType") {
        (value as string[]).forEach((type) =>
          formData.append("productType[]", type),
        );
      } else if (key === "shopImage") {
        const uri = value as string;
        const name = uri.split("/").pop();
        const type = "image/jpeg";
        formData.append("shopImage", { uri, name, type } as any);
      } else {
        formData.append(key, value as string);
      }
    });

    try {
      if (currentUser?.productOwnerId) {
        await updateProductOwner(currentUser.productOwnerId, formData);
      } else {
        await addProductOwner(formData);
      }
      setAlertMessage("Shop information saved successfully");
      setAlertVisible(true);
    } catch (error) {
      console.error("Error saving shop information:", error);
      setAlertMessage("Failed to save shop information. Please try again.");
      setAlertVisible(true);
    }
  };

  if (isLoading) {
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
          subLabel={t(".jpeg, .jpg, .png of less than 10MB")}
          isMandatory
          onFileSelect={handleFileSelect}
          selectedFile={formState.shopImage}
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
          onSelect={(selected) =>
            setFormState((prev) => ({ ...prev, productType: selected }))
          }
        />
      </ScrollView>
      <Button
        title={currentUser?.productOwnerId ? t("Update Shop") : t("Add Shop")}
        onPress={handleSubmit}
        style={styles.submitButton}
        disabled={addLoading || updateLoading}
      />
      <Alert
        message={alertMessage}
        type="info"
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
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
