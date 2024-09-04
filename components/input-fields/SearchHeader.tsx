import React from "react";
import { Platform, StatusBar, StyleSheet, TextInput, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import Colors from "@/constants/Colors";
import Sizes from "@/constants/Sizes";
import IconButton from "../button/IconButton";

const SearchHeader = ({
  isPaddingNeeded = true,
}: {
  isPaddingNeeded?: boolean;
}) => {
  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background"
  );
  const searchBackgroundColor = useThemeColor(
    {
      light: Colors.light.backgroundSecondary,
      dark: Colors.dark.backgroundSecondary,
    },
    "backgroundSecondary"
  );
  const borderColor = useThemeColor(
    { light: Colors.light.border, dark: Colors.dark.border },
    "border"
  );
  const textColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text"
  );
  const iconColor = useThemeColor(
    { light: Colors.light.icon, dark: Colors.dark.icon },
    "icon"
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor },
        isPaddingNeeded && {
          paddingTop:
            Platform.OS === "android"
              ? (StatusBar.currentHeight ?? 0) + Sizes.paddingSmall
              : Sizes.paddingSmall,
        },
      ]}
    >
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: searchBackgroundColor,
            borderColor,
          },
        ]}
      >
        <IconButton
          iconName="search"
          iconLibrary="FontAwesome"
          iconStyle={{ color: iconColor }}
          size="small"
          style={[styles.searchIcon]}
          variant="transparent"
        />
        <TextInput
          placeholder="Search"
          placeholderTextColor={iconColor}
          style={[styles.searchInput, { color: textColor }]}
        />
        <IconButton
          iconName="microphone"
          iconLibrary="FontAwesome"
          iconStyle={{ color: iconColor }}
          size="small"
          style={[styles.microphoneIcon]}
          variant="transparent"
        />
      </View>
      <IconButton
        iconName="notifications"
        iconLibrary="MaterialIcons"
        iconStyle={{ color: Colors.light.background }}
        size="medium"
        style={[styles.notificationIconContainer]}
        variant="primary"
      />
    </View>
  );
};

export default SearchHeader;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Sizes.paddingHorizontal,
    paddingBottom: Sizes.paddingMedium,
    flexDirection: "row",
    gap: Sizes.marginMedium,
    elevation: 1,
  },
  searchContainer: {
    borderRadius: Sizes.borderRadiusFull,
    paddingHorizontal: Sizes.paddingExtraSmall,
    paddingVertical: Sizes.paddingSmall / 2,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: Sizes.textMedium,
  },
  notificationIconContainer: {
    padding: Sizes.paddingSmall,
    borderRadius: Sizes.borderRadiusFull,
  },
  searchIcon: {
    padding: Sizes.paddingSmall,
  },
  microphoneIcon: {
    padding: Sizes.paddingSmall,
  },
});
