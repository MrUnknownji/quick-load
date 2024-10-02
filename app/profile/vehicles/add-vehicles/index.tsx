import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ListRenderItem,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import IconButton from "@/components/button/IconButton";
import TextInputField from "@/components/input-fields/TextInputField";
import SelectListWithDialog from "@/components/input-fields/SelectListWithDialog";
import Sizes from "@/constants/Sizes";
import { t } from "i18next";
import { Vehicle, VehicleFormState } from "@/types/Vehicle";
import { ThemedView } from "@/components/ThemedView";
import {
  useFetchVehicleById,
  useAddVehicle,
  useUpdateVehicle,
  useFetchVehicleTypes,
} from "@/hooks/useFetchVehicle";
import Alert from "@/components/popups/Alert";
import Colors from "@/constants/Colors";
import { responsive, vw, vh } from "@/utils/responsive";
import FileUploadField from "@/components/input-fields/FileUploadField";

type FormField = {
  type: "TextInputField" | "SelectListWithDialog" | "FileUploadField";
  props: any;
};

const AddVehicles: React.FC = () => {
  const { vehicleId, isEdit } = useLocalSearchParams<{
    vehicleId: string;
    isEdit: string;
  }>();
  const [formState, setFormState] = useState<Partial<Vehicle>>({
    driverName: "John Doe",
    phoneNumber: "+911234567890",
    vehicleNumber: "AB 12 C 3456",
    vehicleType: "Truck",
    drivingLicence: "",
    rc: "",
    panCard: "",
    aadharCard: "",
  });
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const {
    vehicle,
    loading: vehicleLoading,
    error: vehicleError,
  } = useFetchVehicleById(isEdit === "true" ? vehicleId || "" : "");

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
    if (isEdit === "true" && vehicle) {
      setFormState((prev) => ({
        ...prev,
        ...vehicle,
        drivingLicence: vehicle.drivingLicence || prev.drivingLicence,
        rc: vehicle.rc || prev.rc,
        panCard: vehicle.panCard || prev.panCard,
        aadharCard: vehicle.aadharCard || prev.aadharCard,
      }));
    }
    setIsLoading(vehicleLoading || typesLoading);
  }, [isEdit, vehicle, vehicleLoading, typesLoading]);

  const handleInputChange =
    (field: keyof VehicleFormState) => (value: string) => {
      if (field === "phoneNumber") {
        const phoneNumber = value.startsWith("+91")
          ? value.slice(0, 13)
          : "+91" + value.slice(3, 13);
        setFormState((prev) => ({ ...prev, [field]: phoneNumber }));
      } else if (field === "vehicleNumber") {
        const formattedValue = formatVehicleNumber(value);
        setFormState((prev) => ({ ...prev, [field]: formattedValue }));
      } else if (field === "driverName") {
        setFormState((prev) => ({ ...prev, [field]: value.slice(0, 25) }));
      } else {
        setFormState((prev) => ({ ...prev, [field]: value }));
      }
    };

  const formatVehicleNumber = (value: string): string => {
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

    let formatted = "";
    if (cleaned.length > 0) formatted += cleaned.slice(0, 2);
    if (cleaned.length > 2) formatted += " " + cleaned.slice(2, 4);
    if (cleaned.length > 4) formatted += " " + cleaned.slice(4, 5);
    if (cleaned.length > 5) formatted += " " + cleaned.slice(5, 9);

    return formatted;
  };

  const handleSaveVehicle = async () => {
    const requiredFields: (keyof VehicleFormState)[] = [
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
      Object.entries(formState).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== vehicle?.[key as keyof Vehicle]
        ) {
          formData.append(key, value as string | Blob);
        }
      });
      if (isEdit === "true" && vehicleId) {
        await updateVehicle(vehicleId, formState);
      } else {
        await addVehicle(formData);
      }
      router.back();
    } catch (error) {
      console.error("Error saving vehicle:", error);
      setAlertMessage("Failed to save vehicle data. Please try again.");
      setAlertVisible(true);
    }
  };

  const handleCloseAlert = () => {
    setAlertVisible(false);
  };

  const handleFileSelect =
    (field: "drivingLicence" | "rc" | "panCard" | "aadharCard") =>
    (file: DocumentPicker.DocumentPickerResult) => {
      if (file.assets && file.assets.length > 0) {
        const selectedFile = file.assets[0];
        setFormState((prev) => ({ ...prev, [field]: selectedFile.name }));
      }
    };

  const formFields: FormField[] = [
    {
      type: "TextInputField",
      props: {
        label: t("Driver's Name"),
        subLabel: t("max 25 characters"),
        isMandatory: true,
        iconName: "person",
        value: formState.driverName,
        onChangeText: handleInputChange("driverName"),
        maxLength: 25,
      },
    },
    {
      type: "TextInputField",
      props: {
        label: t("Phone"),
        subLabel: t("with country code"),
        isMandatory: true,
        iconName: "call",
        value: formState.phoneNumber || "+91",
        onChangeText: handleInputChange("phoneNumber"),
        keyboardType: "phone-pad",
        maxLength: 13,
      },
    },
    {
      type: "TextInputField",
      props: {
        label: t("Vehicle Number"),
        subLabel: t("e.g., AB 12 C 3456"),
        isMandatory: true,
        iconName: "text",
        value: formState.vehicleNumber,
        onChangeText: handleInputChange("vehicleNumber"),
        autoCapitalize: "characters",
        maxLength: 13,
      },
    },
    {
      type: "SelectListWithDialog",
      props: {
        label: t("Vehicle Type"),
        isMandatory: true,
        iconName: "truck",
        iconType: "FontAwesome",
        options: vehicleTypes.map((vt) => vt.type),
        selectedOption: formState.vehicleType || "",
        onSelect: handleInputChange("vehicleType"),
      },
    },
    {
      type: "FileUploadField",
      props: {
        label: t("Driving License"),
        subLabel: t("only .jpeg,.jpg,.png of max 10MB"),
        isMandatory: true,
        onFileSelect: handleFileSelect("drivingLicence"),
        selectedFile: formState.drivingLicence,
        allowedExtensions: ["jpg", "jpeg", "png"],
      },
    },
    {
      type: "FileUploadField",
      props: {
        label: t("RC"),
        subLabel: t("only .jpeg,.jpg,.png of max 10MB"),
        isMandatory: true,
        onFileSelect: handleFileSelect("rc"),
        selectedFile: formState.rc,
        allowedExtensions: ["jpg", "jpeg", "png"],
      },
    },
    {
      type: "FileUploadField",
      props: {
        label: t("Pan Card"),
        subLabel: t("only .jpeg,.jpg,.png of max 10MB"),
        isMandatory: true,
        onFileSelect: handleFileSelect("panCard"),
        selectedFile: formState.panCard,
        allowedExtensions: ["jpg", "jpeg", "png"],
      },
    },
    {
      type: "FileUploadField",
      props: {
        label: t("Aadhaar Card"),
        subLabel: t("only .jpeg,.jpg,.png of max 10MB"),
        isMandatory: true,
        onFileSelect: handleFileSelect("aadharCard"),
        selectedFile: formState.aadharCard,
        allowedExtensions: ["jpg", "jpeg", "png"],
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
      <ThemedView style={styles.profileDetails}>
        <FlatList
          data={formFields}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.type}-${index}`}
          contentContainerStyle={{
            paddingBottom: responsive(200),
            paddingTop: responsive(20),
          }}
        />
        <IconButton
          iconName={isEdit === "true" ? "save" : "add"}
          size="small"
          title={isEdit === "true" ? t("Update Vehicle") : t("Add Vehicle")}
          variant="primary"
          style={{
            position: "absolute",
            bottom: responsive(Sizes.marginLarge),
            right: responsive(Sizes.marginHorizontal),
            borderRadius: responsive(Sizes.borderRadiusFull),
            paddingHorizontal: responsive(Sizes.paddingMedium),
            paddingVertical: responsive(Sizes.paddingMedium),
          }}
          onPress={handleSaveVehicle}
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

export default AddVehicles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileDetails: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
