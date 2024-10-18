import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import IconButton from "@/components/button/IconButton";
import TextInputField from "@/components/input-fields/TextInputField";
import SelectListWithDialog from "@/components/input-fields/SelectListWithDialog";
import Sizes from "@/constants/Sizes";
import { t } from "i18next";
import { Vehicle } from "@/types/Vehicle";
import { ThemedView } from "@/components/ThemedView";
import {
  useFetchVehicleById,
  useAddVehicle,
  useUpdateVehicle,
  useFetchVehicleTypes,
} from "@/hooks/useFetchVehicle";
import Alert from "@/components/popups/Alert";
import Colors from "@/constants/Colors";
import { responsive } from "@/utils/responsive";
import FileUploadField from "@/components/input-fields/FileUploadField";
import { useContextUser } from "@/contexts/userContext";

const AddVehicles: React.FC = () => {
  const { vehicleId, isEdit } = useLocalSearchParams<{
    vehicleId: string;
    isEdit: string;
  }>();
  const { user } = useContextUser();
  const [formState, setFormState] = useState<Partial<Vehicle>>({
    phoneNumber: user?.phone ?? "",
  });
  const [updatedFields, setUpdatedFields] = useState<{ [key: string]: any }>(
    {},
  );
  const [alertState, setAlertState] = useState({
    visible: false,
    message: "",
    type: "error" as "error" | "success",
  });

  const { vehicle, loading: vehicleLoading } = useFetchVehicleById(
    isEdit === "true" ? vehicleId || "" : "",
  );
  const { vehicleTypes, loading: typesLoading } = useFetchVehicleTypes();
  const { addVehicle, loading: addLoading } = useAddVehicle();
  const { updateVehicle, loading: updateLoading } = useUpdateVehicle();

  useEffect(() => {
    if (isEdit === "true" && vehicle) {
      setFormState(vehicle);
    }
  }, [isEdit, vehicle]);

  const handleInputChange = (field: keyof Vehicle) => (value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    setUpdatedFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect =
    (field: keyof Vehicle) => (result: DocumentPicker.DocumentPickerResult) => {
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setFormState((prev) => ({ ...prev, [field]: file.name }));
        setUpdatedFields((prev) => ({ ...prev, [field]: file }));
      }
    };

  const handleSaveVehicle = async () => {
    if (Object.keys(updatedFields).length === 0) {
      router.back();
      return;
    }
    const requiredFields: (keyof Vehicle)[] = [
      "driverName",
      "phoneNumber",
      "vehicleNumber",
      "vehicleType",
      "drivingLicence",
      "rc",
      "panCard",
      "aadharCard",
    ];

    const missingFields = requiredFields.filter(
      (field) => !formState[field] || formState[field] === "",
    );

    if (missingFields.length > 0) {
      setAlertState({
        visible: true,
        message: `Please fill in all required fields: ${missingFields.join(", ")}`,
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

      let result;
      if (isEdit === "true" && vehicleId) {
        result = await updateVehicle(vehicleId, formData);
      } else {
        result = await addVehicle(formData);
      }

      if (result) {
        setAlertState({
          visible: true,
          message:
            isEdit === "true"
              ? "Vehicle updated successfully"
              : "Vehicle added successfully",
          type: "success",
        });
      } else {
        throw new Error("No result returned from server");
      }
    } catch (error) {
      console.error("Error saving vehicle:", error);
      setAlertState({
        visible: true,
        message: `Failed to ${isEdit === "true" ? "update" : "add"} vehicle. Please try again.`,
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
    vehicleLoading || typesLoading || addLoading || updateLoading;

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
          <TextInputField
            label={t("Driver's Name")}
            value={formState.driverName}
            onChangeText={handleInputChange("driverName")}
            maxLength={25}
          />
          <TextInputField
            label={t("Phone")}
            value={formState.phoneNumber}
            onChangeText={handleInputChange("phoneNumber")}
            keyboardType="phone-pad"
          />
          <TextInputField
            label={t("Vehicle Number")}
            value={formState.vehicleNumber}
            onChangeText={handleInputChange("vehicleNumber")}
            autoCapitalize="characters"
          />
          <SelectListWithDialog
            label={t("Vehicle Type")}
            options={vehicleTypes.map((vt) => vt.type)}
            selectedOption={formState.vehicleType || ""}
            onSelect={handleInputChange("vehicleType")}
          />
          <FileUploadField
            label={t("Driving License")}
            onFileSelect={handleFileSelect("drivingLicence")}
            selectedFile={formState.drivingLicence}
            allowedExtensions={["jpg", "jpeg", "png", "pdf"]}
          />
          <FileUploadField
            label={t("RC")}
            onFileSelect={handleFileSelect("rc")}
            selectedFile={formState.rc}
            allowedExtensions={["jpg", "jpeg", "png", "pdf"]}
          />
          <FileUploadField
            label={t("Pan Card")}
            onFileSelect={handleFileSelect("panCard")}
            selectedFile={formState.panCard}
            allowedExtensions={["jpg", "jpeg", "png", "pdf"]}
          />
          <FileUploadField
            label={t("Aadhaar Card")}
            onFileSelect={handleFileSelect("aadharCard")}
            selectedFile={formState.aadharCard}
            allowedExtensions={["jpg", "jpeg", "png", "pdf"]}
          />
        </ScrollView>
        <IconButton
          iconName={isEdit === "true" ? "save" : "add"}
          size="small"
          title={isEdit === "true" ? t("Update Vehicle") : t("Add Vehicle")}
          variant="primary"
          style={styles.saveButton}
          onPress={handleSaveVehicle}
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
  },
  scrollContent: {
    padding: responsive(Sizes.paddingMedium),
    paddingBottom: responsive(100),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButton: {
    position: "absolute",
    bottom: responsive(Sizes.marginLarge),
    right: responsive(Sizes.marginHorizontal),
    borderRadius: responsive(Sizes.borderRadiusFull),
    paddingHorizontal: responsive(Sizes.paddingMedium),
  },
});

export default AddVehicles;
