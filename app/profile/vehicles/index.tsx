import React, { useState } from "react";
import { StyleSheet, TouchableNativeFeedback, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Image } from "expo-image";
import Colors from "@/constants/Colors";
import Sizes from "@/constants/Sizes";
import IconButton from "@/components/button/IconButton";
import { router } from "expo-router";
import { t } from "i18next";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import { Vehicle } from "@/types/Vehicle";
import { useDeleteVehicle, useFetchVehicles } from "@/hooks/useFetchVehicle";
import Alert from "@/components/popups/Alert";

const VehicleItem = ({
  vehicle,
  onDelete,
  onLongPress,
}: {
  vehicle: Vehicle;
  onDelete: () => void;
  onLongPress: () => void;
}) => {
  const listItemBackgroundColor = useThemeColor(
    {
      light: Colors.light.backgroundSecondary,
      dark: Colors.dark.backgroundSecondary,
    },
    "background",
  );
  return (
    <View
      style={{
        borderRadius: Sizes.borderRadiusMedium,
        marginHorizontal: Sizes.marginSmall,
        overflow: "hidden",
        elevation: 3,
      }}
    >
      <TouchableNativeFeedback
        onPress={() =>
          router.push({
            pathname: "/profile/vehicles/add-vehicles",
            params: { vehicleId: vehicle.vehicleId, isEdit: "true" },
          })
        }
        onLongPress={onLongPress}
        delayLongPress={500}
      >
        <View
          style={[
            styles.listItem,
            { backgroundColor: listItemBackgroundColor },
          ]}
        >
          <Image
            source={{ uri: vehicle.vehicleImage }}
            style={styles.listItemImage}
          />
          <View style={styles.listItemDetails}>
            <ThemedText style={styles.listItemType}>
              {t(vehicle.vehicleType)}
            </ThemedText>
            <ThemedText style={styles.listItemNumber}>
              {vehicle.vehicleNumber}
            </ThemedText>
            <ThemedText style={styles.listItemBrand}>
              {vehicle.driverName}
            </ThemedText>
          </View>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

const Vehicles = () => {
  const { vehicles, loading, error, fetchVehicles } = useFetchVehicles();
  const {
    deleteVehicle,
    loading: deleteLoading,
    error: deleteError,
  } = useDeleteVehicle();

  const [alertVisible, setAlertVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const handleDeleteVehicle = async (vehicleId: string) => {
    try {
      await deleteVehicle(vehicleId);
      fetchVehicles();
      setAlertVisible(false);
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  const handleLongPress = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setAlertVisible(true);
  };

  const renderContent = () => {
    if (loading) {
      return <ThemedText>Loading...</ThemedText>;
    }

    if (error) {
      return <ThemedText>Error: {error}</ThemedText>;
    }

    return (
      <FlatList
        data={vehicles}
        renderItem={({ item }) => (
          <VehicleItem
            vehicle={item}
            onDelete={() => handleDeleteVehicle(item.vehicleId)}
            onLongPress={() => handleLongPress(item)}
          />
        )}
        keyExtractor={(item) => item.vehicleId}
        contentContainerStyle={styles.listContainer}
      />
    );
  };

  return (
    <View style={styles.container}>
      {renderContent()}
      <IconButton
        iconName="add"
        size="medium"
        variant="primary"
        style={styles.addButton}
        onPress={() => router.push("/profile/vehicles/add-vehicles")}
      />
      <Alert
        message={`Are you sure you want to delete ${selectedVehicle?.vehicleNumber}?`}
        type="warning"
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        onConfirm={() => {
          if (selectedVehicle) {
            handleDeleteVehicle(selectedVehicle.vehicleId);
          }
        }}
      />
    </View>
  );
};

export default Vehicles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    gap: Sizes.paddingMedium,
    paddingVertical: Sizes.paddingVertical,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Sizes.paddingSmall,
    paddingHorizontal: Sizes.paddingMedium,
    borderRadius: Sizes.borderRadiusMedium,
  },
  listItemImage: {
    width: 85,
    height: 85,
    borderRadius: Sizes.borderRadiusFull,
  },
  listItemDetails: {
    flex: 1,
    marginLeft: Sizes.paddingMedium,
  },
  listItemType: {
    fontSize: Sizes.textMedium,
    fontWeight: "bold",
  },
  listItemNumber: {
    fontSize: Sizes.textMedium,
  },
  listItemBrand: {
    fontSize: Sizes.textNormal,
    color: Colors.light.textSecondary,
  },
  addButton: {
    position: "absolute",
    right: Sizes.marginHorizontal,
    bottom: Sizes.marginMedium,
  },
});
