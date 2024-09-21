import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { router } from "expo-router";
import { t } from "i18next";

const USER_TYPE = "driver";

const FindRouteBottomSheet = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/find-route",
              params: { userType: USER_TYPE },
            })
          }
        >
          <Image
            style={styles.image}
            source={`https://placehold.co/200x200?text=${t(USER_TYPE)}`}
          />
        </TouchableOpacity>
        <Text style={styles.labelText}>
          {USER_TYPE === "driver" ? t("Find Load") : t("Find Transport")}
        </Text>
      </View>
    </View>
  );
};

export default FindRouteBottomSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 30,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginTop: 20,
    alignSelf: "center",
  },
  imageContainer: {
    marginTop: 10,
    gap: 10,
  },
  labelText: {
    fontSize: 20,
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
});
