import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import TextInputField from "@/components/input-fields/TextInputField";
import SelectListWithDialog from "@/components/input-fields/SelectListWithDialog";
import FileUploadField from "@/components/input-fields/FileUploadField";
import Button from "@/components/button/Button";
import CheckBoxDropdownWithDialog from "@/components/input-fields/CheckBoxDropdownWithDialog";
import { t } from "i18next";

const MyShopPage = () => {
  const [shopName, setShopName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [shopPhoto, setShopPhoto] = useState<string | undefined>();
  const [address, setAddress] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [otherCity, setOtherCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const states = ["State 1", "State 2", "State 3"];
  const cities = ["City 1", "City 2", "City 3", "Other"];
  const productTypes = ["Product 1", "Product 2", "Product 3"];

  const handleSubmit = () => {
    console.log("Form submitted");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <TextInputField
          label={t("Shop Name")}
          isMandatory
          value={shopName}
          onChangeText={setShopName}
        />
        <TextInputField
          label={t("Phone Number")}
          isMandatory
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
        <TextInputField
          label={t("GST Number")}
          isMandatory
          value={gstNumber}
          onChangeText={setGstNumber}
        />
        <FileUploadField
          label={t("Shop Photo")}
          subLabel={t(".jpeg, .jpg, .png of less than 10MB")}
          isMandatory
          selectedFile={shopPhoto}
          onFileSelect={(file) => setShopPhoto(file.assets?.[0].uri)}
        />
        <TextInputField
          label={t("Address")}
          isMandatory
          value={address}
          onChangeText={setAddress}
          multiline
          numberOfLines={3}
        />
        <View style={styles.row}>
          <SelectListWithDialog
            label={t("Select State")}
            defaultText={t("State")}
            isMandatory
            options={states}
            selectedOption={selectedState}
            onSelect={setSelectedState}
            containerStyle={styles.halfWidth}
          />
          <SelectListWithDialog
            label={t("Select City")}
            defaultText={t("City")}
            isMandatory
            options={cities}
            selectedOption={selectedCity}
            onSelect={setSelectedCity}
            containerStyle={styles.halfWidth}
          />
        </View>
        {selectedCity === "Other" && (
          <TextInputField
            label={t("Other City")}
            isMandatory
            value={otherCity}
            onChangeText={setOtherCity}
          />
        )}
        <TextInputField
          label={t("Zip Code")}
          isMandatory
          value={zipCode}
          onChangeText={setZipCode}
          keyboardType="numeric"
        />
        <CheckBoxDropdownWithDialog
          label={t("Select Product Types")}
          isMandatory
          options={productTypes}
          selectedOptions={selectedProducts}
          onSelect={setSelectedProducts}
        />
      </ScrollView>
      <Button
        title={t("Add")}
        onPress={handleSubmit}
        style={styles.submitButton}
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
});

export default MyShopPage;
