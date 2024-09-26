import { Pressable, StyleSheet, Text, View } from "react-native";
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

const UnionSupport = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [issueDetails, setIssueDetails] = useState("");
  const [inputHeight, setInputHeight] = useState(Sizes.searchBarHeight);
  const [error, setError] = useState("");

  const placeholderColor = useThemeColor(
    { light: Colors.light.textSecondary, dark: Colors.dark.textSecondary },
    "textSecondary",
  );

  const textColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );

  const handleSubmit = () => {
    if (!orderNumber || !issueDetails) {
      setError(t("Please fill in all fields"));
      return;
    }
    setError("");
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
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.innerContainer}>
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
        {error ? (
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        ) : null}
      </ScrollView>
      <Pressable style={styles.sendButton} onPress={handleSubmit}>
        <Text style={styles.sendButtonText}>{t("Send")}</Text>
        <Ionicons name="send" size={Sizes.icon["small"]} color="white" />
      </Pressable>
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
    gap: Sizes.marginSmall,
  },
  inputField: {
    width: "100%",
    borderWidth: 0.5,
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
  errorText: {
    color: Colors.light.error,
    marginTop: Sizes.marginSmall,
  },
});
