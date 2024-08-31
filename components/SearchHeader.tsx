import React from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableNativeFeedback,
  View,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";

const SearchHeader = ({
  isPaddingNeeded = true,
}: {
  isPaddingNeeded?: boolean;
}) => {
  const colors = useThemeColor({ light: "white", dark: "#3C0B0B" }, "text");
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors },
        isPaddingNeeded && {
          paddingTop:
            Platform.OS === "android"
              ? (StatusBar.currentHeight ?? 0) + 10
              : 10,
        },
      ]}
    >
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={24} style={styles.searchIcon} />
        <TextInput
          placeholder="Search"
          placeholderTextColor="gray"
          style={styles.searchInput}
        />
        <FontAwesome
          name="microphone"
          size={24}
          style={styles.microphoneIcon}
        />
      </View>
      <TouchableNativeFeedback onPress={() => console.log("Notification")}>
        <View style={styles.notificationIconContainer}>
          <MaterialIcons name="notifications" size={30} color="white" />
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

export default SearchHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "row",
    gap: 10,
    elevation: 1,
  },
  searchContainer: {
    borderRadius: 25,
    paddingHorizontal: 5,
    paddingVertical: 2.5,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    // elevation: 2,
    borderColor: "gray",
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: "black",
  },
  notificationIconContainer: {
    backgroundColor: "#3C0B0B",
    padding: 5,
    borderRadius: 20,
  },
  searchIcon: {
    color: "gray",
    padding: 5,
  },
  microphoneIcon: {
    color: "gray",
    padding: 5,
  },
});
