import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  BackHandler,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import Alert from "@/components/popups/Alert";
import IconButton from "@/components/button/IconButton";
import TextInputField from "@/components/input-fields/TextInputField";
import SelectListWithDialog from "@/components/input-fields/SelectListWithDialog";
import FileUploadField from "@/components/input-fields/FileUploadField";
import { ThemedView } from "@/components/ThemedView";
import { User } from "@/types/User";
import { useUser } from "@/hooks/useUser";
import Colors from "@/constants/Colors";
import { responsive, vw, vh } from "@/utils/responsive";
import { t } from "i18next";
import * as DocumentPicker from "expo-document-picker";
import Sizes from "@/constants/Sizes";
import { useContextUser } from "@/contexts/userContext";

const userTypeOptions = [
  { label: "None", value: "customer" },
  { label: "Driver", value: "driver" },
  { label: "Merchant", value: "merchant" },
  { label: "Merchant-Driver", value: "merchant-driver" },
];

const UserInformationPage: React.FC = () => {
  const { canLeave } = useLocalSearchParams();
  const { loading, error, getUser, updateProfile } = useUser();
  const { user, setUser } = useContextUser();
  const [userId, setUserId] = useState<string | null>(null);
  const [formState, setFormState] = useState<Partial<User>>({});
  const [updatedFields, setUpdatedFields] = useState<{ [key: string]: any }>(
    {},
  );
  const [alertState, setAlertState] = useState({
    visible: false,
    message: "",
    type: "info" as "success" | "error" | "warning" | "info",
  });
  const [isDetailsSaved, setIsDetailsSaved] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        setUserId(storedUserId);
        if (storedUserId) {
          const userData = await getUser(storedUserId);
          setFormState(userData || {});
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setAlertState({
          visible: true,
          message: "Failed to fetch user information. Please try again.",
          type: "error",
        });
      }
    };

    fetchUserId();
  }, [getUser]);

  useEffect(() => {
    const backAction = () => {
      if (canLeave === "false" && !isDetailsSaved) {
        setAlertState({
          visible: true,
          message: "Please save your details before leaving the page.",
          type: "warning",
        });
        return true; // Prevent default behavior
      }
      return false; // Allow default behavior
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove();
  }, [canLeave, isDetailsSaved]);

  const handleInputChange = (field: keyof User) => (value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    setUpdatedFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (field: "panCard" | "aadharCard") => async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const selectedFile = result.assets[0];
        setFormState((prev) => ({ ...prev, [field]: selectedFile.name }));
        setUpdatedFields((prev) => ({ ...prev, [field]: selectedFile }));
      }
    } catch (error) {
      console.error("Error selecting file:", error);
    }
  };

  const handleSave = async () => {
    if (!userId) {
      setAlertState({
        visible: true,
        message: "User ID not found. Please try logging in again.",
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
        } else if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      const success = await updateProfile(userId, formData);

      if (success) {
        setAlertState({
          visible: true,
          message: "Your information has been saved successfully.",
          type: "success",
        });
        setUpdatedFields({});
        setIsDetailsSaved(true);
        setUser({ ...user, ...formState });
      } else {
        throw new Error("Profile update failed");
      }
    } catch (error) {
      console.error("Error saving user data:", error);
      setAlertState({
        visible: true,
        message: "Failed to save user data. Please try again.",
        type: "error",
      });
    }
  };

  const handleCloseAlert = () => {
    setAlertState((prev) => ({ ...prev, visible: false }));
    if (alertState.type === "success" && canLeave !== "false") {
      router.replace("/");
    }
  };

  const renderFormFields = () => (
    <ScrollView>
      <TextInputField
        label={t("First Name")}
        value={formState.firstName}
        onChangeText={handleInputChange("firstName")}
      />
      <TextInputField
        label={t("Last Name")}
        value={formState.lastName}
        onChangeText={handleInputChange("lastName")}
      />
      <TextInputField
        label={t("Email")}
        subLabel={t("For communication purposes")}
        isMandatory={true}
        iconName="mail"
        value={formState.email}
        onChangeText={handleInputChange("email")}
      />
      <TextInputField
        label={t("Phone")}
        subLabel={t("With country code")}
        isMandatory={true}
        iconName="call"
        value={formState.phone || "+91"}
        onChangeText={handleInputChange("phone")}
        keyboardType="phone-pad"
      />
      <TextInputField
        label={t("Address")}
        subLabel={t("Current residential address")}
        isMandatory={true}
        iconName="location"
        value={formState.address}
        onChangeText={handleInputChange("address")}
      />
      <TextInputField
        label={t("City")}
        subLabel={t("Current city of residence")}
        isMandatory={true}
        iconName="business"
        value={formState.city}
        onChangeText={handleInputChange("city")}
      />
      <FileUploadField
        label={t("Pan Card")}
        isMandatory
        onFileSelect={handleFileSelect("panCard")}
        selectedFile={formState.panCard}
        allowedExtensions={["jpg", "png", "pdf"]}
        subLabel={t("Only .jpg, .png, .pdf of max 10MB allowed")}
      />
      <FileUploadField
        label={t("Aadhaar Card")}
        isMandatory
        onFileSelect={handleFileSelect("aadharCard")}
        selectedFile={formState.aadharCard}
        allowedExtensions={["jpg", "png", "pdf"]}
        subLabel={t("Only .jpg, .png, .pdf of max 10MB allowed")}
      />
      <SelectListWithDialog
        label={t("User Type")}
        subLabel={t("Select your primary role")}
        isMandatory={true}
        iconName="people"
        options={userTypeOptions}
        selectedOption={formState.type || "customer"}
        onSelect={(value: string) => {
          handleInputChange("type")(value);
        }}
        displayValue={(value: string) => {
          const option = userTypeOptions.find((opt) => opt.value === value);
          return option ? option.label : "None";
        }}
      />
    </ScrollView>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
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
        <View style={styles.userImageContainer}>
          <Image
            source={"https://quick-load.onrender.com/assets/default-avatar.png"}
            style={styles.userImage}
          />
        </View>
        {renderFormFields()}
        <IconButton
          iconName="content-save-check"
          size="small"
          variant="primary"
          title={t("Save")}
          style={styles.saveButton}
          iconLibrary="MaterialCommunityIcons"
          onPress={handleSave}
        />
      </ThemedView>
      <Alert
        message={t(alertState.message)}
        type={alertState.type}
        visible={alertState.visible}
        onClose={handleCloseAlert}
      />
    </KeyboardAvoidingView>
  );
};

export default UserInformationPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileDetails: {
    flex: 1,
  },
  userImageContainer: {
    position: "absolute",
    zIndex: 2,
    top: responsive(-60),
    width: vw(100) - responsive(Sizes.paddingMedium * 2),
    height: responsive(100),
    alignItems: "center",
    justifyContent: "center",
  },
  userImage: {
    width: responsive(100),
    height: responsive(100),
    borderRadius: responsive(Sizes.borderRadiusFull),
  },
  loadingContainer: {
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
