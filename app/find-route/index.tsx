import React from "react";
import { View, Text, TextInput, StyleSheet, Image } from "react-native";
import Button from "@/components/button/Button";
import Sizes from "@/constants/Sizes";
import Colors from "@/constants/Colors";
import SelectList from "@/components/input-fields/SelectList";
import IconButton from "@/components/button/IconButton";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { t } from "i18next";

const RouteFinder = () => {
  const { userType } = useLocalSearchParams<{ userType: string }>();
  return (
    <View style={styles.container}>
      <IconButton
        iconName="chevron-back"
        size="small"
        variant="primary"
        style={{
          position: "absolute",
          left: Sizes.marginHorizontal,
          top: Sizes.StatusBarHeight ?? 0 + 10,
          borderRadius: Sizes.borderRadiusFull,
        }}
        onPress={() => router.back()}
      />
      <Image source={require("@/assets/images/icon.png")} style={styles.logo} />
      <Text style={styles.title}>
        {t("Hey")}{" "}
        {t(
          userType
            .at(0)
            ?.toUpperCase()
            .concat(t(userType.slice(1))) ?? ""
        )}
      </Text>
      <Text style={styles.subtitle}>{t("Submit your route request")}</Text>

      <Text style={styles.sectionTitle}>{t("Find Route")}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder={t("Starting point")}
          style={styles.input}
          placeholderTextColor={Colors.light.textSecondary}
        />
        <Ionicons
          name="search"
          size={24}
          color={Colors.light.textSecondary}
          style={styles.searchIcon}
        />
      </View>

      <Text style={styles.toText}>{t("to")}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder={t("Ending point")}
          style={styles.input}
          placeholderTextColor={Colors.light.textSecondary}
        />
        <Ionicons
          name="search"
          size={24}
          color={Colors.light.textSecondary}
          style={styles.searchIcon}
        />
      </View>

      <SelectList
        options={[t("Truck"), t("Dumper"), t("Trailer"), t("Container")]}
        label={t("Vehicle Type")}
        iconName="truck"
        iconType="MaterialCommunityIcons"
        disabled={false}
        containerStyle={{ paddingHorizontal: 0 }}
        placeholder={t("Select a vehicle type")}
      />

      <Button
        title={t("Send")}
        variant="primary"
        size="medium"
        style={{ width: "100%" }}
        textStyle={{ fontSize: Sizes.textMedium }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Sizes.paddingMedium,
    backgroundColor: Colors.light.background,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: Sizes.marginMedium,
  },
  title: {
    fontSize: Sizes.textExtraLarge,
    fontWeight: "bold",
    color: Colors.light.primary,
    textAlign: "center",
  },
  subtitle: {
    fontSize: Sizes.textMedium,
    color: Colors.light.textSecondary,
    marginBottom: Sizes.marginMedium,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: Sizes.textLarge,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: Sizes.marginSmall,
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderColor: Colors.light.border,
    borderWidth: 1,
    borderRadius: Sizes.borderRadius,
    marginBottom: Sizes.marginSmall,
  },
  input: {
    flex: 1,
    height: Sizes.buttonHeight,
    paddingHorizontal: Sizes.paddingHorizontal,
  },
  searchIcon: {
    padding: Sizes.paddingSmall,
  },
  toText: {
    fontSize: Sizes.textNormal,
    color: Colors.light.text,
    marginBottom: Sizes.marginSmall,
    textAlign: "center",
  },
});

export default RouteFinder;
