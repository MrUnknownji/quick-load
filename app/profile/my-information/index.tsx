import React, { useEffect, useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
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
import { t } from "i18next";
import * as DocumentPicker from "expo-document-picker";
import { useContextUser } from "@/contexts/userContext";
import Sizes from "@/constants/Sizes";
import { responsive, vw } from "@/utils/responsive";

const userTypeOptions = [
  { label: "Default", value: "customer" },
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
        return true;
      }
      return false;
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

  const handleFileSelect = (
    field: "panCard" | "aadharCard",
    result: DocumentPicker.DocumentPickerResult,
  ) => {
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedFile = result.assets[0];
      setFormState((prev) => ({ ...prev, [field]: selectedFile.name }));
      setUpdatedFields((prev) => ({ ...prev, [field]: selectedFile }));
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
        setUser((prevUser) => ({ ...prevUser, ...formState }));
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
    if (alertState.type === "success") {
      if (canLeave === "false") {
        router.replace({
          pathname: "/thank-you",
          params: {
            message:
              "Your profile has been submitted and is currently under review. We'll notify you once it's approved.",
            loginAgain: "true",
          },
        });
      } else {
        router.back();
      }
    }
  };

  const renderFormFields = () => (
    <ScrollView>
      <TextInputField
        label={t("First Name")}
        value={formState.firstName}
        isMandatory
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
        iconName="mail"
        value={formState.email}
        onChangeText={handleInputChange("email")}
      />
      <TextInputField
        label={t("Phone")}
        isMandatory={true}
        iconName="call"
        value={formState.phone || "+91"}
        onChangeText={handleInputChange("phone")}
        keyboardType="phone-pad"
      />
      <TextInputField
        label={t("Address")}
        iconName="location"
        value={formState.address}
        onChangeText={handleInputChange("address")}
      />
      <TextInputField
        label={t("City")}
        isMandatory={true}
        iconName="business"
        value={formState.city}
        onChangeText={handleInputChange("city")}
      />
      <FileUploadField
        label={t("Pan Card")}
        subLabel={t("Upload a Pan Card picture")}
        onFileSelect={(result) => {
          handleFileSelect("panCard", result);
        }}
        selectedFile={formState.panCard}
        allowedExtensions={["jpg", "png", "pdf"]}
      />
      <FileUploadField
        label={t("Aadhaar Card")}
        onFileSelect={(result) => {
          handleFileSelect("aadharCard", result);
        }}
        selectedFile={formState.aadharCard}
        allowedExtensions={["jpg", "png", "pdf"]}
        subLabel={t("Only .jpg, .png, .pdf of max 10MB allowed")}
      />
      {canLeave === "false" && (
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
            return option ? option.label : "Default";
          }}
          disabled={canLeave !== "false"}
        />
      )}
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
            source={`http://movingrolls.online/assets/default-avatar.png`}
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
