import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";
import Sizes from "@/constants/Sizes";
import { router, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { t } from "i18next";

const UnionSupport = () => {
  const [orderNumber, setOrderNumber] = React.useState("");
  const [issueDetails, setIssueDetails] = React.useState("");
  const [inputHeight, setInputHeight] = React.useState(Sizes.searchBarHeight);
  const [successMessage, setSuccessMessage] = React.useState(
    `${t("Our customer care representative will contact you soon.")} ${t(
      "Your order number is "
    )} ${orderNumber}`
  );
  const pathname = usePathname();

  const handleInputChangeListener = (text: string) => {
    setOrderNumber(text);
    setSuccessMessage(
      `${t("Our customer care representative will contact you soon.")} ${t(
        "Your order number is "
      )} ${text}`
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <Text style={styles.inputText}>{t("Enter the order number")}</Text>
        <TextInput
          placeholder={t("Order Number")}
          style={styles.inputField}
          value={orderNumber}
          onChangeText={handleInputChangeListener}
        />
        <Text style={styles.inputText}>{t("Enter the issue details")}</Text>
        <TextInput
          placeholder={t("Issue Details")}
          style={[styles.inputField, { height: inputHeight }]}
          value={issueDetails}
          onChangeText={setIssueDetails}
          multiline
          onContentSizeChange={(e) =>
            setInputHeight(
              e.nativeEvent.contentSize.height + Sizes.paddingMedium
            )
          }
        />
      </ScrollView>
      <Pressable
        style={styles.sendButton}
        onPress={() =>
          router.push({
            pathname: "/thank-you",
            params: { message: successMessage },
          })
        }
      >
        <Text style={styles.sendButtonText}>{t("Send")}</Text>
        <Ionicons name="send" size={Sizes.icon["small"]} color="white" />
      </Pressable>
    </View>
  );
};

export default UnionSupport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: Sizes.paddingMedium,
    backgroundColor: "white",
    alignItems: "center",
    gap: Sizes.marginSmall,
  },
  inputField: {
    width: "100%",
    borderWidth: 0.5,
    borderColor: Colors.light.text,
    borderRadius: Sizes.borderRadiusMedium,
    paddingVertical: Sizes.paddingSmall,
    paddingHorizontal: Sizes.paddingMedium,
  },
  inputText: {
    fontSize: Sizes.textMedium,
    fontWeight: "bold",
  },
  sendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    bottom: Sizes.marginHorizontal,
    right: Sizes.marginHorizontal,
    borderRadius: Sizes.borderRadiusFull,
    paddingVertical: Sizes.paddingSmall,
    paddingHorizontal: Sizes.paddingHorizontal,
    backgroundColor: Colors.light.primary,
    overflow: "hidden",
    gap: Sizes.marginMedium,
  },
  sendButtonText: {
    fontSize: Sizes.textLarge,
    color: "white",
  },
});
