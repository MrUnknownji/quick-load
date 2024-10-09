import * as Location from "expo-location";
import * as Notifications from "expo-notifications";

export const getLocationPermission = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.log("Permission to access location was denied");
    return false;
  }
  return true;
};

export const getNotificationPermission = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    console.log("Permission to send notifications was denied");
    return false;
  }
  return true;
};

export const getCurrentLocation = async () => {
  let location = await Location.getCurrentPositionAsync({});
  return location;
};
