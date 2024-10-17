import { StyleSheet, View, Linking } from "react-native";
import React from "react";
import { Image } from "expo-image";
import Sizes from "@/constants/Sizes";
import LargeImageView from "@/components/image-views/LargeImageView";
import IconButton from "@/components/button/IconButton";
import { t } from "i18next";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import SafeAreaWrapper from "@/components/SafeAreaWrapper";

const ContactUs = () => {
  const phoneNumber = "999999999";

  const handleCall = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleWhatsApp = () => {
    Linking.openURL(`whatsapp://send?phone=${phoneNumber}`);
  };

  return (
    <SafeAreaWrapper>
      <ThemedView style={{ flex: 1 }}>
        <View style={styles.iconContainer}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.icon}
          />
        </View>
        <ThemedView style={styles.contactCard}>
          <LargeImageView
            imageUrl={`http://movingrolls.online/assets/contact-us.jpeg`}
            height={200}
            style={{
              padding: 0,
              margin: 0,
              marginHorizontal: 0,
              marginVertical: 0,
              borderRadius: Sizes.borderRadiusMedium,
            }}
          />
          <ThemedText style={styles.contactCardText}>{phoneNumber}</ThemedText>
          <IconButton
            iconName="phone"
            size="medium"
            variant="primary"
            iconLibrary="FontAwesome"
            title={t("Call Us")}
            onPress={handleCall}
          />
          <IconButton
            iconName="whatsapp"
            size="medium"
            variant="primary"
            iconLibrary="FontAwesome"
            title={t("WhatsApp")}
            onPress={handleWhatsApp}
          />
        </ThemedView>
      </ThemedView>
    </SafeAreaWrapper>
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
    marginTop: 50,
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
