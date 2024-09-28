import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ListRenderItem,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import Alert from "@/components/popups/Alert";
import { router } from "expo-router";
import { Image } from "expo-image";
import * as DocumentPicker from "expo-document-picker";
import IconButton from "@/components/button/IconButton";
import TextInputField from "@/components/input-fields/TextInputField";
import SelectListWithDialog from "@/components/input-fields/SelectListWithDialog";
import FileUploadField from "@/components/input-fields/FileUploadField";
import Sizes from "@/constants/Sizes";
import { t } from "i18next";
import { ThemedView } from "@/components/ThemedView";
import { User } from "@/types/User";
import { useUser } from "@/hooks/useUser";
import { useUser as useContextUser } from "@/contexts/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "@/constants/Colors";

type FormField = {
  type: "TextInputField" | "SelectListWithDialog" | "FileUploadField";
  props: any;
};

const { width: screenWidth } = Dimensions.get("window");

const UserInformationPage: React.FC = () => {
  const { user, loading, error, getUser, updateProfile } = useUser();
  const { setCurrentUser } = useContextUser();
  const [userId, setUserId] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<
    "success" | "error" | "warning" | "info"
  >("info");
  const [formState, setFormState] = useState<Partial<User>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    type: "customer",
    panCard: "",
    aadharCard: "",
    username: "",
    language: "en",
    gender: "other",
    countryCode: "+91",
    timezone: 0,
    birthDate: "",
    isActivated: false,
    isVerified: false,
    deviceId: "",
    platform: "android",
  });

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        setUserId(storedUserId);
        if (storedUserId) {
          getUser(storedUserId);
        }
      } catch (error) {
        console.error("Error fetching userId from AsyncStorage:", error);
        setAlertMessage("Failed to fetch user information. Please try again.");
        setAlertVisible(true);
      }
    };

    fetchUserId();
  }, [getUser]);

  useEffect(() => {
    if (user) {
      setFormState(user);
      setIsNewUser(!user.isVerified);
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      setAlertMessage(error);
      setAlertVisible(true);
    }
  }, [error]);

  const handleInputChange = (field: keyof User) => (value: string) => {
    if (field === "phone") {
      const phoneNumber = value.startsWith("+91")
        ? value.slice(0, 13)
        : "+91" + value.slice(3, 13);
      setFormState((prev) => ({ ...prev, [field]: phoneNumber }));
    } else {
      setFormState((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleFileSelect =
    (field: "panCard" | "aadharCard") =>
    (file: DocumentPicker.DocumentPickerResult) => {
      if (file.assets && file.assets.length > 0) {
        const selectedFile = file.assets[0];
        setFormState((prev) => ({ ...prev, [field]: selectedFile.name }));
      }
    };

  const userTypeOptions = [
    { label: "None", value: "customer" },
    { label: "Driver", value: "driver" },
    { label: "Merchant", value: "merchant" },
    { label: "Merchant-Driver", value: "merchant-driver" },
  ];

  const formFields: FormField[] = [
    {
      type: "TextInputField",
      props: {
        label: t("First Name"),
        subLabel: t("As per official documents"),
        isMandatory: true,
        iconName: "person",
        value: formState.firstName,
        onChangeText: handleInputChange("firstName"),
      },
    },
    {
      type: "TextInputField",
      props: {
        label: t("Last Name"),
        subLabel: t("As per official documents"),
        isMandatory: true,
        iconName: "person-add",
        value: formState.lastName,
        onChangeText: handleInputChange("lastName"),
      },
    },
    {
      type: "TextInputField",
      props: {
        label: t("Email"),
        subLabel: t("For communication purposes"),
        isMandatory: true,
        iconName: "mail",
        value: formState.email,
        onChangeText: handleInputChange("email"),
      },
    },
    {
      type: "TextInputField",
      props: {
        label: t("Phone"),
        subLabel: t("With country code"),
        isMandatory: true,
        iconName: "call",
        value: formState.phone || "+91",
        onChangeText: handleInputChange("phone"),
        keyboardType: "phone-pad",
        maxLength: 13,
      },
    },
    {
      type: "TextInputField",
      props: {
        label: t("Address"),
        subLabel: t("Current residential address"),
        isMandatory: true,
        iconName: "location",
        value: formState.address,
        onChangeText: handleInputChange("address"),
      },
    },
    {
      type: "TextInputField",
      props: {
        label: t("City"),
        subLabel: t("Current city of residence"),
        isMandatory: true,
        iconName: "business",
        value: formState.city,
        onChangeText: handleInputChange("city"),
      },
    },
    {
      type: "FileUploadField",
      props: {
        label: t("Pan Card"),
        subLabel: t("Only .jpg, .png, .pdf of max 10MB allowed"),
        isMandatory: true,
        onFileSelect: handleFileSelect("panCard"),
        selectedFile: formState.panCard,
        allowedExtensions: ["jpg", "png", "pdf"],
      },
    },
    {
      type: "FileUploadField",
      props: {
        label: t("Aadhaar Card"),
        subLabel: t("Only .jpg, .png, .pdf of max 10MB allowed"),
        isMandatory: true,
        onFileSelect: handleFileSelect("aadharCard"),
        selectedFile: formState.aadharCard,
        allowedExtensions: ["jpg", "png", "pdf"],
      },
    },
    {
      type: "SelectListWithDialog",
      props: {
        label: t("User Type"),
        subLabel: t("Select your primary role"),
        isMandatory: true,
        iconName: "people",
        options: userTypeOptions,
        selectedOption: formState.type || "customer",
        onSelect: (value: string) => {
          handleInputChange("type")(value);
        },
        displayValue: (value: string) => {
          const option = userTypeOptions.find((opt) => opt.value === value);
          return option ? option.label : "None";
        },
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

  const handleSave = async () => {
    const requiredFields: (keyof User)[] = [
      "firstName",
      "phone",
      "address",
      "city",
    ];

    const missingFields = requiredFields.filter(
      (field) => !formState[field] || formState[field] === "",
    );

    if (missingFields.length > 0) {
      const missingFieldNames = missingFields
        .map((field) => field.charAt(0).toUpperCase() + field.slice(1))
        .join(", ");

      setAlertMessage(
        `Please fill in the following required fields:\n\n${missingFieldNames}`,
      );
      setAlertType("warning");
      setAlertVisible(true);
      return;
    }

    if (!userId) {
      setAlertMessage("User ID not found. Please try logging in again.");
      setAlertType("error");
      setAlertVisible(true);
      return;
    }

    try {
      const formData = new FormData();
      let hasChanges = false;

      Object.entries(formState).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== user?.[key as keyof User]
        ) {
          hasChanges = true;
          formData.append(key, value as string | Blob);
        }
      });

      if (hasChanges) {
        await updateProfile(userId, formData);
        const user = await getUser(userId);
        setCurrentUser(user);

        setAlertMessage("Your information has been saved successfully.");
        setAlertType("success");
        setAlertVisible(true);

        if (isNewUser) {
          setTimeout(() => {
            router.replace({
              pathname: "/thank-you",
              params: {
                message: "Your information has been saved successfully.",
                type: "new_user",
              },
            });
          }, 2000);
        }
      } else {
        setAlertMessage("No changes detected.");
        setAlertType("info");
        setAlertVisible(true);
      }
    } catch (error) {
      console.error("Error saving user data:", error);
      setAlertMessage("Failed to save user data. Please try again.");
      setAlertType("error");
      setAlertVisible(true);
    }
  };

  const handleCloseAlert = () => {
    setAlertVisible(false);
    if (alertType === "success" && !isNewUser) {
      router.replace("/");
    }
  };

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
        <FlatList
          data={formFields}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.type}-${index}`}
          contentContainerStyle={{
            paddingVertical: 50,
          }}
        />
        <IconButton
          iconName="content-save-check"
          size="small"
          variant="primary"
          title={t("Save")}
          style={{
            position: "absolute",
            bottom: Sizes.marginLarge,
            right: Sizes.marginHorizontal,
            borderRadius: Sizes.borderRadiusFull,
            paddingHorizontal: Sizes.paddingMedium,
          }}
          iconLibrary="MaterialCommunityIcons"
          onPress={handleSave}
        />
      </ThemedView>
      <Alert
        message={alertMessage}
        type={alertType}
        visible={alertVisible}
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
    top: -60,
    width: screenWidth - Sizes.paddingMedium * 2,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: Sizes.borderRadiusFull,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
