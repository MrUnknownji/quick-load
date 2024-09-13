import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Image } from "expo-image";
import Sizes from "@/constants/Sizes";
import LargeImageView from "@/components/image-views/LargeImageView";
import IconButton from "@/components/button/IconButton";
import { t } from "i18next";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

const { width: screenWidth } = Dimensions.get("window");

const ContactUs = () => {
  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={styles.iconContainer}>
        <Image
          source={require("@/assets/images/icon.png")}
          style={styles.icon}
        />
      </View>
      <ThemedView style={styles.contactCard}>
        <LargeImageView
          imageUrl={`https://placehold.co/${
            screenWidth - Sizes.marginHorizontal * 2 - Sizes.paddingMedium * 2
          }x${Sizes.carouselHeight}?text=Contact+Us`}
          style={{
            padding: 0,
            margin: 0,
            marginHorizontal: 0,
            marginVertical: 0,
          }}
        />
        <ThemedText style={styles.contactCardText}>+91 9876543210</ThemedText>
        <IconButton
          iconName="phone"
          size="medium"
          variant="primary"
          iconLibrary="FontAwesome"
          title={t("Call Us")}
        />
        <IconButton
          iconName="whatsapp"
          size="medium"
          variant="primary"
          iconLibrary="FontAwesome"
          title={t("WhatsApp")}
        />
      </ThemedView>
    </ThemedView>
  );
};

export default ContactUs;

const styles = StyleSheet.create({
  iconContainer: {
    marginHorizontal: Sizes.marginHorizontal,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 150,
    height: 150,
    marginTop: 100,
  },
  contactCard: {
    elevation: 3,
    marginHorizontal: Sizes.marginHorizontal,
    marginTop: Sizes.marginLarge,
    padding: Sizes.paddingMedium,
    borderRadius: Sizes.borderRadiusLarge,
    gap: Sizes.marginExtraSmall,
  },
  contactCardText: {
    fontSize: Sizes.textLarge,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: Sizes.marginSmall,
  },
});
