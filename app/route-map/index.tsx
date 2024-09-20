import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import Button from "@/components/button/Button";
import Sizes from "@/constants/Sizes";
import { t } from "i18next";
import { Linking } from "react-native";
import IconButton from "@/components/button/IconButton";

const RouteMap = () => {
  const { start, end } = useLocalSearchParams<{ start: string; end: string }>();
  const [userLocation, setUserLocation] =
    useState<Location.LocationObject | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
    })();
  }, []);

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      start
    )}&destination=${encodeURIComponent(end)}&travelmode=driving`;
    Linking.openURL(url);
  };

  if (!userLocation) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <IconButton
        iconName="chevron-back"
        size="small"
        variant="primary"
        style={styles.backButton}
        onPress={() => router.back()}
      />
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: userLocation.coords.latitude,
            longitude: userLocation.coords.longitude,
          }}
          title={t("Your Location")}
        />
      </MapView>
      <View style={styles.buttonContainer}>
        <Button
          title={t("Open in Google Maps")}
          variant="primary"
          size="medium"
          onPress={openGoogleMaps}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: Sizes.marginLarge,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  button: {
    width: "90%",
  },
  backButton: {
    position: "absolute",
    left: Sizes.marginHorizontal,
    top: Sizes.StatusBarHeight ?? 0 + 10,
    borderRadius: Sizes.borderRadiusFull,
    zIndex: 1,
  },
});

export default RouteMap;
