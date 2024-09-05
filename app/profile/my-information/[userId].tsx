import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ListRenderItem,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import * as DocumentPicker from "expo-document-picker";
import IconButton from "@/components/button/IconButton";
import TextInputField from "@/components/input-fields/TextInputField";
import SelectList from "@/components/input-fields/SelectList";
import FileUploadField from "@/components/input-fields/FileUploadField";
import Sizes from "@/constants/Sizes";

type CustomFile = {
  uri: string;
  name: string;
  size?: number;
  type: string;
};

type FormField = {
  type: "TextInputField" | "SelectList" | "FileUploadField";
  props: any;
};

const { width: screenWidth } = Dimensions.get("window");

const UserInformationPage: React.FC = () => {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [disabled, setDisabled] = useState(true);
  const [formState, setFormState] = useState({
    username: userId,
    email: "email@example.com",
    phone: "+91 9876543210",
    address: "123 Main Street",
    city: "New York",
    userType: "Customer",
    vehicleNumber: "XX3422",
    vehicleType: "Dumper",
    panCardFile: undefined as CustomFile | undefined,
    aadhaarCardFile: undefined as CustomFile | undefined,
  });

  const [keyboardHeight, setKeyboardHeight] = useState(200);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        setKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleInputChange = (field: string) => (value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect =
    (field: "panCardFile" | "aadhaarCardFile") =>
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
        label: "Name",
        iconName: "person",
        value: formState.username,
        onChangeText: handleInputChange("username"),
        disabled,
      },
    },
    {
      type: "TextInputField",
      props: {
        label: "Email",
        iconName: "mail",
        value: formState.email,
        onChangeText: handleInputChange("email"),
        disabled,
      },
    },
    {
      type: "TextInputField",
      props: {
        label: "Phone",
        iconName: "call",
        value: formState.phone,
        onChangeText: handleInputChange("phone"),
        disabled,
      },
    },
    {
      type: "TextInputField",
      props: {
        label: "Address",
        iconName: "location",
        value: formState.address,
        onChangeText: handleInputChange("address"),
        disabled,
      },
    },
    {
      type: "TextInputField",
      props: {
        label: "City",
        iconName: "business",
        value: formState.city,
        onChangeText: handleInputChange("city"),
        disabled,
      },
    },
    {
      type: "FileUploadField",
      props: {
        label: "Pan Card",
        onFileSelect: handleFileSelect("panCardFile"),
        selectedFile: formState.panCardFile?.name,
        disabled,
      },
    },
    {
      type: "FileUploadField",
      props: {
        label: "Aadhaar Card",
        onFileSelect: handleFileSelect("aadhaarCardFile"),
        selectedFile: formState.aadhaarCardFile?.name,
        disabled,
      },
    },
    {
      type: "SelectList",
      props: {
        label: "User Type",
        iconName: "people",
        options: ["Customer", "Supplier"],
        selectedOption: formState.userType,
        onSelect: handleInputChange("userType"),
        disabled,
      },
    },
    {
      type: "TextInputField",
      props: {
        label: "Vehicle Number",
        iconName: "car",
        value: formState.vehicleNumber,
        onChangeText: handleInputChange("vehicleNumber"),
        disabled,
      },
    },
    {
      type: "SelectList",
      props: {
        label: "Vehicle Type",
        iconName: "truck",
        iconType: "FontAwesome",
        options: ["Dumper", "Trailer", "Container"],
        selectedOption: formState.vehicleType,
        onSelect: handleInputChange("vehicleType"),
        disabled,
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
            paddingBottom: isKeyboardVisible ? 0 : keyboardHeight,
            paddingTop: 20,
          }}
        />
        <IconButton
          iconName={disabled ? "account-edit" : "content-save-check"}
          size="small"
          variant="primary"
          style={{
            position: "absolute",
            bottom: Sizes.marginLarge,
            right: Sizes.marginHorizontal,
            borderRadius: Sizes.borderRadiusFull,
          }}
          iconLibrary="MaterialCommunityIcons"
          onPress={() => {
            setDisabled(!disabled);
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default UserInformationPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileDetails: {
    backgroundColor: "white",
    flex: 1,
  },
  userImageContainer: {
    position: "absolute",
    zIndex: 2,
    top: -50,
    width: screenWidth,
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
