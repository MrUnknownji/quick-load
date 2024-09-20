import { Dimensions, StyleSheet, Text, View, ScrollView } from "react-native";
import React from "react";
import { Image } from "expo-image";
import Sizes from "@/constants/Sizes";

const { width: screnWidth } = Dimensions.get("window");

const TrackOrder = () => {
  return (
    <View style={styles.container}>
      <View style={styles.cardView}>
        <Text style={styles.cardText}>Track your route</Text>
        <Image
          source={require("@/assets/images/mobile-location.png")}
          style={styles.cardImage}
        />
      </View>
      <View style={{ height: Sizes.carouselHeight }}>
        <ScrollView horizontal style={styles.vehicleContainer}>
          {["Trailer", "Dumper", "Container"].map((item, index) => (
            <View key={index} style={styles.vehicleItem}>
              <Image
                source={`https://placehold.co/200x200?text=${item}`}
                style={styles.vehicleImage}
              />
              <Text style={styles.labelText}>{item}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default TrackOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: Sizes.marginHorizontal,
    alignItems: "center",
    justifyContent: "center",
  },
  cardView: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Sizes.borderRadiusLarge,
    padding: Sizes.paddingMedium,
    backgroundColor: "white",
    elevation: 3,
  },
  cardText: {
    fontSize: Sizes.textLarge,
    fontWeight: "bold",
  },
  cardImage: {
    width: screnWidth - Sizes.marginHorizontal * 2 - Sizes.paddingMedium * 2,
    height: 200,
  },
  vehicleContainer: {},
  vehicleItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: Sizes.marginSmall,
    marginHorizontal: Sizes.marginSmall,
  },
  vehicleImage: {
    width: 90,
    height: 90,
    borderRadius: Sizes.borderRadiusFull,
  },
  labelText: {
    fontSize: Sizes.textMedium,
    fontWeight: "bold",
  },
});
