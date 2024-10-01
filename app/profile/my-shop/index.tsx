import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";
import { useUser as useContextUser } from "@/contexts/UserContext";
import TextInputField from "@/components/input-fields/TextInputField";
import SelectListWithDialog from "@/components/input-fields/SelectListWithDialog";
import Button from "@/components/button/Button";
import CheckBoxDropdownWithDialog from "@/components/input-fields/CheckBoxDropdownWithDialog";
import { useUpdateProductOwner } from "@/hooks/useFetchProduct";
import { responsive, vh, vw } from "@/utils/responsive";
import Colors from "@/constants/Colors";
import Sizes from "@/constants/Sizes";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";

const MyShopPage = () => {
  const { t } = useTranslation();
  const { currentUser } = useContextUser();
  const { updateProductOwner, loading, error } = useUpdateProductOwner();

  const [productOwnerName, setProductOwnerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [shopImage, setShopImage] = useState<string | null>(null);
  const [shopAddress, setShopAddress] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [otherCity, setOtherCity] = useState("");
  const [productType, setProductType] = useState<string[]>([]);

  const states = ["State 1", "State 2", "State 3"];
  const cities = ["City 1", "City 2", "City 3", "Other"];
  const productTypes = ["Bricks", "Grit", "Bajri", "Cement"];

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setShopImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!currentUser?._id) {
      console.error("User ID not found");
      return;
    }

    const formData = new FormData();
    formData.append("productOwnerName", productOwnerName);
    formData.append("phoneNumber", phoneNumber);
    formData.append("gstNumber", gstNumber);
    formData.append("shopAddress", shopAddress);
    formData.append("state", state);
    formData.append("city", city === "Other" ? otherCity : city);
    formData.append("shopRating", "0");
    productType.forEach((type) => formData.append("productType[]", type));
    if (shopImage) {
      formData.append("shopImage", {
        uri: shopImage,
        type: "image/jpeg",
        name: "shop_image.jpg",
      } as any);
    }

    try {
      await updateProductOwner(currentUser._id, formData);
      console.log("Shop information updated successfully");
    } catch (err) {
      console.error("Error updating shop information:", err);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: responsive(80) }}
      >
        <TextInputField
          label={t("Shop Name")}
          isMandatory
          value={productOwnerName}
          onChangeText={setProductOwnerName}
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
        <View style={styles.imagePickerContainer}>
          <ThemedText style={styles.label}>
            {t("Shop Photo")}
            <ThemedText style={styles.subLabel}>
              {" "}
              ({t(".jpeg, .jpg, .png of less than 10MB")})
            </ThemedText>
            <ThemedText style={styles.mandatoryIndicator}>*</ThemedText>
          </ThemedText>
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {shopImage ? (
              <Image source={{ uri: shopImage }} style={styles.image} />
            ) : (
              <View style={styles.placeholder}>
                <Ionicons
                  name="camera-outline"
                  size={24}
                  color={Colors.light.primary}
                />
                <ThemedText style={styles.placeholderText}>
                  {t("Select an image")}
                </ThemedText>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <TextInputField
          label={t("Address")}
          isMandatory
          value={shopAddress}
          onChangeText={setShopAddress}
          multiline
          numberOfLines={3}
        />
        <View style={styles.row}>
          <SelectListWithDialog
            label={t("Select State")}
            defaultText={t("State")}
            isMandatory
            options={states}
            selectedOption={state}
            onSelect={setState}
            containerStyle={styles.halfWidth}
          />
          <SelectListWithDialog
            label={t("Select City")}
            defaultText={t("City")}
            isMandatory
            options={cities}
            selectedOption={city}
            onSelect={setCity}
            containerStyle={styles.halfWidth}
          />
        </View>
        {city === "Other" && (
          <TextInputField
            label={t("Other City")}
            isMandatory
            value={otherCity}
            onChangeText={setOtherCity}
          />
        )}
        <CheckBoxDropdownWithDialog
          label={t("Select Product Types")}
          isMandatory
          options={productTypes}
          selectedOptions={productType}
          onSelect={setProductType}
        />
      </ScrollView>
      <Button
        title={t("Save")}
        onPress={handleSubmit}
        style={styles.submitButton}
        disabled={loading}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
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
});

export default MyShopPage;
