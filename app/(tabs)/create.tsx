import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Image } from "expo-image";

const Create = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={() => console.log("Drivers")}>
          <Image
            style={styles.image}
            source="https://placehold.co/200x200?text=Driver"
          />
        </TouchableOpacity>
        <Text style={styles.labelText}>Find Load(For Driver)</Text>
      </View>
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={() => console.log("Customers")}>
          <Image
            style={styles.image}
            source="https://placehold.co/200x200?text=Customer"
          />
        </TouchableOpacity>
        <Text style={styles.labelText}>Find Transport(For Customers)</Text>
      </View>
    </View>
  );
};

export default Create;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
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
