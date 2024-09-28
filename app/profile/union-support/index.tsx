import { Pressable, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";
import Sizes from "@/constants/Sizes";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { t } from "i18next";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import Alert from "@/components/popups/Alert";

const UnionSupport = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [issueDetails, setIssueDetails] = useState("");
  const [inputHeight, setInputHeight] = useState(Sizes.searchBarHeight);
  const [alertVisible, setAlertVisible] = useState(false);

  const placeholderColor = useThemeColor(
    { light: Colors.light.textSecondary, dark: Colors.dark.textSecondary },
    "textSecondary",
  );

  const textColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );

  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background",
  );

  const handleSubmit = () => {
    if (!orderNumber || !issueDetails) {
      setAlertVisible(true);
      return;
    }
    router.push({
      pathname: "/thank-you",
      params: {
        message: t("Your support request has been submitted"),
        type: "union_support",
        orderNumber,
        issueDetails,
      },
    });
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <ThemedText style={styles.title}>{t("Union Support")}</ThemedText>
        <View style={styles.inputContainer}>
          <ThemedText style={styles.inputText}>
            {t("Enter the order number")}
          </ThemedText>
          <TextInput
            placeholder={t("Order Number")}
            style={[
              styles.inputField,
              { borderColor: textColor, color: textColor },
            ]}
            value={orderNumber}
            onChangeText={setOrderNumber}
            placeholderTextColor={placeholderColor}
          />
        </View>
        <View style={styles.inputContainer}>
          <ThemedText style={styles.inputText}>
            {t("Enter the issue details")}
          </ThemedText>
          <TextInput
            placeholder={t("Issue Details")}
            style={[
              styles.inputField,
              { height: inputHeight, borderColor: textColor, color: textColor },
            ]}
            value={issueDetails}
            onChangeText={setIssueDetails}
            multiline
            onContentSizeChange={(e) =>
              setInputHeight(
                e.nativeEvent.contentSize.height + Sizes.paddingMedium,
              )
            }
            placeholderTextColor={placeholderColor}
          />
        </View>
      </ScrollView>
      <Pressable style={styles.sendButton} onPress={handleSubmit}>
        <ThemedText style={styles.sendButtonText}>{t("Send")}</ThemedText>
        <Ionicons name="send" size={Sizes.icon["small"]} color="white" />
      </Pressable>
      <Alert
        message={t("Please fill in all fields")}
        type="warning"
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
      />
    </ThemedView>
  );
};

export default UnionSupport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: Sizes.paddingMedium,
    alignItems: "center",
    gap: Sizes.marginMedium,
  },
  title: {
    fontSize: Sizes.textExtraLarge,
    fontWeight: "bold",
    marginBottom: Sizes.marginLarge,
  },
  inputContainer: {
    width: "100%",
    marginBottom: Sizes.marginMedium,
  },
  inputField: {
    width: "100%",
    borderWidth: 1,
    borderRadius: Sizes.borderRadiusMedium,
    paddingVertical: Sizes.paddingSmall,
    paddingHorizontal: Sizes.paddingMedium,
    fontSize: Sizes.textMedium,
  },
  inputText: {
    fontSize: Sizes.textMedium,
    fontWeight: "bold",
    marginBottom: Sizes.marginSmall,
  },
  sendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: Sizes.marginHorizontal,
    right: Sizes.marginHorizontal,
    borderRadius: Sizes.borderRadiusFull,
    paddingVertical: Sizes.paddingMedium,
    paddingHorizontal: Sizes.paddingHorizontal,
    backgroundColor: Colors.light.primary,
    overflow: "hidden",
    gap: Sizes.marginMedium,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sendButtonText: {
    fontSize: Sizes.textLarge,
    color: "white",
    fontWeight: "bold",
  },
});
