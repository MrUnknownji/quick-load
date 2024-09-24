import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ListRenderItem,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Alert from "@/components/popups/Alert";
import { useLocalSearchParams, router } from "expo-router";
import { Image } from "expo-image";
import * as DocumentPicker from "expo-document-picker";
import IconButton from "@/components/button/IconButton";
import TextInputField from "@/components/input-fields/TextInputField";
import SelectListWithDialog from "@/components/input-fields/SelectListWithDialog";
import FileUploadField from "@/components/input-fields/FileUploadField";
import Sizes from "@/constants/Sizes";
import { t } from "i18next";
import { ThemedView } from "@/components/ThemedView";
import { useUser } from "@/contexts/UserContext";
import { User } from "@/types/User";

type FormField = {
  type: "TextInputField" | "SelectListWithDialog" | "FileUploadField";
  props: any;
};

const { width: screenWidth } = Dimensions.get("window");

const UserInformationPage: React.FC = () => {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { currentUser, setCurrentUser } = useUser();
  const [isNewUser, setIsNewUser] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [formState, setFormState] = useState<Partial<User>>({
    name: "",
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
    if (currentUser) {
      setIsNewUser(!currentUser.isVerified);
      setFormState(currentUser);
    }
  }, [currentUser]);

  const handleInputChange = (field: keyof User) => (value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect =
    (field: "panCard" | "aadharCard") =>
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
        label: t("Name"),
        iconName: "person",
        value: formState.name,
        onChangeText: handleInputChange("name"),
      },
    },
    {
      type: "TextInputField",
      props: {
        label: t("Email"),
        iconName: "mail",
        value: formState.email,
        onChangeText: handleInputChange("email"),
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
        label: t("Address"),
        iconName: "location",
        value: formState.address,
        onChangeText: handleInputChange("address"),
      },
    },
    {
      type: "TextInputField",
      props: {
        label: t("City"),
        iconName: "business",
        value: formState.city,
        onChangeText: handleInputChange("city"),
      },
    },
    {
      type: "FileUploadField",
      props: {
        label: t("Pan Card"),
        onFileSelect: handleFileSelect("panCard"),
        selectedFile: formState.panCard,
      },
    },
    {
      type: "FileUploadField",
      props: {
        label: t("Aadhaar Card"),
        onFileSelect: handleFileSelect("aadharCard"),
        selectedFile: formState.aadharCard,
      },
    },
    {
      type: "SelectListWithDialog",
      props: {
        label: t("User Type"),
        iconName: "people",
        options: ["customer", "driver", "merchant"],
        selectedOption: formState.type,
        onSelect: handleInputChange("type"),
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

  const handleSave = () => {
    const requiredFields: (keyof User)[] = [
      "name",
      "email",
      "phone",
      "address",
      "city",
      "type",
      "panCard",
      "aadharCard",
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
      setAlertVisible(true);
      return;
    }

    const updatedUser = { ...formState, isVerified: true } as User;
    setCurrentUser(updatedUser);

    if (isNewUser) {
      router.replace({
        pathname: "/thank-you",
        params: {
          message: "Your information has been saved successfully.",
          type: "new_user",
        },
      });
    } else {
      router.replace("/");
    }
  };

  const handleCloseAlert = () => {
    setAlertVisible(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ThemedView style={styles.profileDetails}>
        <View style={styles.userImageContainer}>
          <Image
            source={"https://placehold.co/200x200?text=User"}
            style={styles.userImage}
          />
        </View>
        <FlatList
          data={formFields}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.type}-${index}`}
          contentContainerStyle={{
            paddingVertical: 30,
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
        type="error"
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
    top: -50,
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
});
