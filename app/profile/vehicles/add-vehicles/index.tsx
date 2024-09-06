import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ListRenderItem,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import IconButton from "@/components/button/IconButton";
import TextInputField from "@/components/input-fields/TextInputField";
import SelectList from "@/components/input-fields/SelectList";
import FileUploadField from "@/components/input-fields/FileUploadField";
import Sizes from "@/constants/Sizes";
import { t } from "i18next";
import { VEHICLES_LIST } from "@/assets/data/DATA";
import { CustomFile, VehicleTypeProps } from "@/constants/types/types";

type FormField = {
  type: "TextInputField" | "SelectList" | "FileUploadField";
  props: any;
};

const dummyVehicle: VehicleTypeProps = {
  id: "user23432",
  phone: "+91 9876543210",
  vehicleNumber: "GJ 12 K 0005",
  vehicleType: "Dumper",
  vehicleCapacity: "20-25tn",
  drivingLicense: undefined as CustomFile | undefined,
  vehicleRC: undefined as CustomFile | undefined,
  panCardFile: undefined as CustomFile | undefined,
  aadhaarCardFile: undefined as CustomFile | undefined,
  image: "https://placehold.co/200x200?text=Dumper",
  brand: "Tata",
};

const AddVehicles: React.FC = () => {
  const { vehicleId, isEdit } = useLocalSearchParams<{
    vehicleId: string;
    isEdit: string;
  }>();
  const [formState, setFormState] = useState<VehicleTypeProps>(dummyVehicle);

  useEffect(() => {
    if (vehicleId) {
      const vehicle = VEHICLES_LIST.find((vehicle) => vehicle.id === vehicleId);
      setFormState((prev) => ({ ...prev, ...vehicle }));
    }
  }, []);

  const handleInputChange = (field: string) => (value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveVehicle = () => {
    if (isEdit && vehicleId) {
      const vehicleIndex = VEHICLES_LIST.findIndex((v) => v.id === vehicleId);
      if (vehicleIndex !== -1) {
        VEHICLES_LIST[vehicleIndex] = {
          ...VEHICLES_LIST[vehicleIndex],
          ...formState,
        };
      }
    } else {
      VEHICLES_LIST.push({
        ...formState,
        id: `vehicle${VEHICLES_LIST.length + 1}`,
      });
    }
    router.back();
  };

  const handleFileSelect =
    (
      field: "panCardFile" | "aadhaarCardFile" | "drivingLicense" | "vehicleRC"
    ) =>
    (file: DocumentPicker.DocumentPickerResult) => {
      if (file.assets && file.assets.length > 0) {
        const selectedFile = file.assets[0];
        const customFile: CustomFile = {
          uri: selectedFile.uri,
          name: selectedFile.name || "unknown",
          size: selectedFile.size,
          type: selectedFile.mimeType || "unknown",
        };
        setFormState((prev) => ({ ...prev, [field]: customFile }));
      }
    };

  const formFields: FormField[] = [
    {
      type: "TextInputField",
      props: {
        label: t("Driver's Name"),
        iconName: "person",
        value: formState.id,
        onChangeText: handleInputChange("username"),
      },
    },
    {
      type: "TextInputField",
      props: {
        label: t("Phone"),
        iconName: "call",
        value: formState.phone,
        onChangeText: handleInputChange("phone"),
      },
    },
    {
      type: "TextInputField",
      props: {
        label: t("Vehicle Number"),
        iconName: "text",
        value: formState.vehicleNumber,
        onChangeText: handleInputChange("address"),
      },
    },
    {
      type: "TextInputField",
      props: {
        label: t("Brand"),
        iconName: "business",
        iconType: "MaterialIcons",
        value: formState.brand || "",
        onChangeText: handleInputChange("brand"),
      },
    },
    {
      type: "SelectList",
      props: {
        label: t("Vehicle Type"),
        iconName: "truck",
        iconType: "FontAwesome",
        options: ["Dumper", "Trailer", "Container"],
        selectedOption: formState.vehicleType,
        onSelect: handleInputChange("vehicleType"),
      },
    },
    {
      type: "SelectList",
      props: {
        label: t("Vehicle Load Capacity"),
        iconName: "weight",
        iconType: "MaterialCommunityIcons",
        options: ["20-25tn", "25-30tn", "30-35tn", "35-40tn", "40-45tn"],
        selectedOption: formState.vehicleCapacity,
        onSelect: handleInputChange("vehicleCapacity"),
        placeholder: t("Select a capacity"),
      },
    },
    {
      type: "FileUploadField",
      props: {
        label: t("Driving License"),
        onFileSelect: handleFileSelect("drivingLicense"),
        selectedFile: formState.drivingLicense?.name,
      },
    },
    {
      type: "FileUploadField",
      props: {
        label: t("RC"),
        onFileSelect: handleFileSelect("vehicleRC"),
        selectedFile: formState.vehicleRC?.name,
      },
    },
    {
      type: "FileUploadField",
      props: {
        label: t("Pan Card"),
        onFileSelect: handleFileSelect("panCardFile"),
        selectedFile: formState.panCardFile?.name,
      },
    },
    {
      type: "FileUploadField",
      props: {
        label: t("Aadhaar Card"),
        onFileSelect: handleFileSelect("aadhaarCardFile"),
        selectedFile: formState.aadhaarCardFile?.name,
      },
    },
  ];

  const renderItem: ListRenderItem<FormField> = ({ item }) => {
    const Component =
      item.type === "TextInputField"
        ? TextInputField
        : item.type === "SelectList"
        ? SelectList
        : item.type === "FileUploadField"
        ? FileUploadField
        : View;
    return <Component {...item.props} />;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.profileDetails}>
        <FlatList
          data={formFields}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.type}-${index}`}
          contentContainerStyle={{
            paddingBottom: 200,
            paddingTop: 20,
          }}
        />
        <IconButton
          iconName={isEdit ? "save" : "add"}
          size="small"
          title={isEdit ? t("Update Vehicle") : t("Add Vehicle")}
          variant="primary"
          style={{
            position: "absolute",
            bottom: Sizes.marginLarge,
            right: Sizes.marginHorizontal,
            borderRadius: Sizes.borderRadiusFull,
            paddingHorizontal: Sizes.paddingMedium,
            paddingVertical: Sizes.paddingMedium,
          }}
          onPress={handleSaveVehicle}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddVehicles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileDetails: {
    backgroundColor: "white",
    flex: 1,
  },
});
