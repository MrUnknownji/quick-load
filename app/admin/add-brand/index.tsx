import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Colors from "@/constants/Colors";
import Sizes from "@/constants/Sizes";
import { t } from "i18next";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import TextInputField from "@/components/input-fields/TextInputField";
import IconButton from "@/components/button/IconButton";
import Button from "@/components/button/Button";
import { useThemeColor } from "@/hooks/useThemeColor";

interface BrandImage {
  uri: string;
}

const AddBrandPage: React.FC = () => {
  const [brandName, setBrandName] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [brandOwner, setBrandOwner] = useState("");
  const [brandWebsite, setBrandWebsite] = useState("");
  const [brandLogo, setBrandLogo] = useState<BrandImage | null>(null);

  const iconColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.dark.secondary },
    "primary"
  );

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setBrandLogo({ uri: result.assets[0].uri });
    }
  };

  const handleSaveAsDraft = () => console.log("Saving brand as draft");
  const handleAddBrand = () => console.log("Adding brand");
  const handleCancel = () => router.back();

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity style={styles.imagePickerMain} onPress={pickImage}>
            {brandLogo ? (
              <Image source={{ uri: brandLogo.uri }} style={styles.brandLogo} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera" size={40} color={iconColor} />
                <ThemedText style={styles.imagePlaceholderText}>
                  {t("Tap to add brand logo")}
                </ThemedText>
              </View>
            )}
          </TouchableOpacity>

          <TextInputField
            label={t("Brand Name")}
            value={brandName}
            onChangeText={setBrandName}
            style={styles.inputContainer}
          />

          <TextInputField
            label={t("Brand Description")}
            value={brandDescription}
            onChangeText={setBrandDescription}
            multiline
            style={[styles.inputContainer, styles.textArea]}
          />

          <TextInputField
            label={t("Owner Name")}
            value={brandOwner}
            onChangeText={setBrandOwner}
            style={styles.inputContainer}
          />

          <TextInputField
            label={t("Website (Optional)")}
            value={brandWebsite}
            onChangeText={setBrandWebsite}
            keyboardType="url"
            style={styles.inputContainer}
          />
        </ScrollView>

        <View style={styles.buttonRow}>
          <IconButton
            iconName="save-outline"
            variant="primary"
            size="small"
            onPress={handleSaveAsDraft}
          />
          <Button
            title={t("Add Brand")}
            size="medium"
            onPress={handleAddBrand}
          />
          <IconButton
            iconName="close-circle"
            variant="primary"
            size="small"
            onPress={handleCancel}
          />
        </View>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    borderTopLeftRadius: Sizes.borderRadiusLarge,
    borderTopRightRadius: Sizes.borderRadiusLarge,
    marginTop: Sizes.marginMedium,
    paddingBottom: 60,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Sizes.paddingMedium,
  },
  imagePickerMain: {
    width: "100%",
    height: 200,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: Sizes.borderRadiusMedium,
    overflow: "hidden",
    marginBottom: Sizes.marginLarge,
  },
  brandLogo: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    marginTop: Sizes.marginSmall,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: Sizes.marginMedium,
  },
  textArea: {
    height: "auto",
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingHorizontal: Sizes.marginMedium,
  },
});

export default AddBrandPage;
