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
import SelectListWithDialog from "@/components/input-fields/SelectListWithDialog";
import FileUploadField from "@/components/input-fields/FileUploadField";
import Sizes from "@/constants/Sizes";
import { t } from "i18next";
import { VehicleFormState } from "@/types/Vehicle";
import { ThemedView } from "@/components/ThemedView";
import {
  useFetchVehicleById,
  useAddVehicle,
  useUpdateVehicle,
  useFetchVehicleTypes,
} from "@/hooks/useFetchVehicle";

type FormField = {
  type: "TextInputField" | "SelectListWithDialog" | "FileUploadField";
  props: any;
};

const AddVehicles: React.FC = () => {
  const { vehicleId, isEdit } = useLocalSearchParams<{
    vehicleId: string;
    isEdit: string;
  }>();
  const [formState, setFormState] = useState<VehicleFormState>({});

  const {
    vehicle,
    loading: vehicleLoading,
    error: vehicleError,
  } = useFetchVehicleById(vehicleId || "");
  const {
    vehicleTypes,
    loading: typesLoading,
    error: typesError,
  } = useFetchVehicleTypes();
  const { addVehicle, loading: addLoading, error: addError } = useAddVehicle();
  const {
    updateVehicle,
    loading: updateLoading,
    error: updateError,
  } = useUpdateVehicle();

  useEffect(() => {
    if (vehicleId && isEdit === "true" && vehicle) {
      setFormState(vehicle);
    }
  }, [vehicleId, isEdit, vehicle]);

  const handleInputChange =
    (field: keyof VehicleFormState) => (value: string) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
    };

  const handleSaveVehicle = async () => {
    try {
      const formData = new FormData();
      Object.entries(formState).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === "string") {
          formData.append(key, value);
        }
      });

      if (isEdit === "true" && vehicleId) {
        await updateVehicle(vehicleId, formData);
      } else {
        await addVehicle(formData);
      }
      router.back();
    } catch (error) {
      console.error("Error saving vehicle:", error);
    }
  };

  const handleFileSelect =
    (field: keyof VehicleFormState) =>
    (file: DocumentPicker.DocumentPickerResult) => {
      if (file.assets && file.assets.length > 0) {
        const selectedFile = file.assets[0];
        setFormState((prev) => ({ ...prev, [field]: selectedFile }));
      }
    };

  const formFields: FormField[] = [
    {
      type: "TextInputField",
      props: {
        label: t("Driver's Name"),
        iconName: "person",
        value: formState.driverName,
        onChangeText: handleInputChange("driverName"),
      },
    },
    {
      type: "TextInputField",
      props: {
        label: t("Phone"),
        iconName: "call",
        value: formState.phoneNumber,
        onChangeText: handleInputChange("phoneNumber"),
      },
    },
    {
      type: "TextInputField",
      props: {
        label: t("Vehicle Number"),
        iconName: "text",
        value: formState.vehicleNumber,
        onChangeText: handleInputChange("vehicleNumber"),
      },
    },
    {
      type: "SelectListWithDialog",
      props: {
        label: t("Vehicle Type"),
        iconName: "truck",
        iconType: "FontAwesome",
        options: vehicleTypes,
        selectedOption: formState.vehicleType,
        onSelect: handleInputChange("vehicleType"),
      },
    },
    {
      type: "FileUploadField",
      props: {
        label: t("Driving License"),
        onFileSelect: handleFileSelect("drivingLicence"),
        selectedFile:
          formState.drivingLicence instanceof File
            ? formState.drivingLicence.name
            : formState.drivingLicence,
      },
    },
    {
      type: "FileUploadField",
      props: {
        label: t("RC"),
        onFileSelect: handleFileSelect("rc"),
        selectedFile:
          formState.rc instanceof File ? formState.rc.name : formState.rc,
      },
    },
    {
      type: "FileUploadField",
      props: {
        label: t("Pan Card"),
        onFileSelect: handleFileSelect("panCard"),
        selectedFile:
          formState.panCard instanceof File
            ? formState.panCard.name
            : formState.panCard,
      },
    },
    {
      type: "FileUploadField",
      props: {
        label: t("Aadhaar Card"),
        onFileSelect: handleFileSelect("aadharCard"),
        selectedFile:
          formState.aadharCard instanceof File
            ? formState.aadharCard.name
            : formState.aadharCard,
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ThemedView style={styles.profileDetails}>
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
      </ThemedView>
    </KeyboardAvoidingView>
  );
};

export default AddVehicles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileDetails: {
    flex: 1,
  },
});
