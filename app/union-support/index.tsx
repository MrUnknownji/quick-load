import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";
import Sizes from "@/constants/Sizes";
import IconButton from "@/components/button/IconButton";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const UnionSupport = () => {
  const [orderNumber, setOrderNumber] = React.useState("");
  const [issueDetails, setIssueDetails] = React.useState("");
  const [inputHeight, setInputHeight] = React.useState(Sizes.searchBarHeight);
  const [successMessage, setSuccessMessage] = React.useState(
    `Our customer care representative will contact you soon. Your order number is ${orderNumber}`
  );

  const handleInputChangeListener = (text: string) => {
    setOrderNumber(text);
    setSuccessMessage(
      `Our customer care representative will contact you soon. Your order number is ${text}`
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.unionHeader}>
        <IconButton
          iconName="chevron-back"
          size="medium"
          variant="transparent"
          style={{ position: "absolute", left: Sizes.marginHorizontal }}
          iconStyle={{ color: Colors.light.background }}
          onPress={() => router.back()}
        />
        <Text style={styles.unionHeadingText}>Union Support</Text>
      </View>
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <Text style={styles.inputText}>Enter the order number</Text>
        <TextInput
          placeholder="Order Number"
          style={styles.inputField}
          value={orderNumber}
          onChangeText={handleInputChangeListener}
        />
        <Text style={styles.inputText}>Enter the issue details</Text>
        <TextInput
          placeholder="Issue Details"
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
        <Text style={styles.sendButtonText}>Send</Text>
        <Ionicons name="send" size={Sizes.icon["small"]} color="white" />
      </Pressable>
    </View>
  );
};

export default UnionSupport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Sizes.StatusBarHeight,
    backgroundColor: Colors.light.primary,
  },
  unionHeader: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: Sizes.marginMedium,
    paddingVertical: Sizes.paddingSmall,
    paddingHorizontal: Sizes.paddingMedium,
  },
  unionHeadingText: {
    textAlign: "center",
    fontSize: Sizes.textMedium,
    fontWeight: "bold",
    color: Colors.light.background,
  },
  innerContainer: {
    marginTop: 100,
    padding: Sizes.paddingLarge,
    paddingTop: 50,
    backgroundColor: "white",
    borderTopLeftRadius: Sizes.borderRadiusLarge,
    borderTopRightRadius: Sizes.borderRadiusLarge,
    elevation: 3,
    alignItems: "center",
    gap: Sizes.marginSmall,
    minHeight: "100%",
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
