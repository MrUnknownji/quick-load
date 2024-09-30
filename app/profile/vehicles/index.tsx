import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  Platform,
} from "react-native";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { Image } from "expo-image";
import Colors from "@/constants/Colors";
import Sizes from "@/constants/Sizes";
import IconButton from "@/components/button/IconButton";
import { router } from "expo-router";
import { t } from "i18next";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import { Vehicle } from "@/types/Vehicle";
import {
  useDeleteVehicle,
  useFetchVehiclesByUserId,
} from "@/hooks/useFetchVehicle";
import Alert from "@/components/popups/Alert";
import { useUser } from "@/contexts/UserContext";
import FlexibleSkeleton from "@/components/Loading/FlexibleSkeleton";
import { Ionicons } from "@expo/vector-icons";
import EditDeleteDialog from "@/components/popups/EditDeleteDialog";
import { responsive, vw, vh } from "@/utils/responsive";

const VehicleItem: React.FC<{
  vehicle: Vehicle;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
}> = ({ vehicle, onEdit, onDelete }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const listItemBackgroundColor = useThemeColor(
    {
      light: Colors.light.backgroundSecondary,
      dark: Colors.dark.backgroundSecondary,
    },
    "background",
  );
  const textColor = useThemeColor(
    {
      light: Colors.light.text,
      dark: Colors.dark.text,
    },
    "text",
  );

  return (
    <View
      style={[styles.listItem, { backgroundColor: listItemBackgroundColor }]}
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
      <TouchableOpacity
        onPress={() => setMenuVisible(true)}
        style={styles.menuButton}
      >
        <Ionicons name="ellipsis-vertical" size={24} color={textColor} />
      </TouchableOpacity>
      <EditDeleteDialog
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onEdit={() => {
          setMenuVisible(false);
          onEdit(vehicle);
        }}
        onDelete={() => {
          setMenuVisible(false);
          onDelete(vehicle);
        }}
      />
    </View>
  );
};

const Vehicles: React.FC = () => {
  const { currentUser } = useUser();
  const { vehicles, loading, error, fetchVehicles } = useFetchVehiclesByUserId(
    currentUser?._id ?? "",
  );

  const {
    deleteVehicle,
    loading: deleteLoading,
    error: deleteError,
  } = useDeleteVehicle();

  const [alertVisible, setAlertVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const listItemBackgroundColor = useThemeColor(
    {
      light: Colors.light.backgroundSecondary,
      dark: Colors.dark.backgroundSecondary,
    },
    "background",
  );

  const handleEditVehicle = (vehicle: Vehicle) => {
    router.push({
      pathname: "/profile/vehicles/add-vehicles",
      params: { vehicleId: vehicle._id, isEdit: "true" },
    });
  };

  const handleDeleteVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setAlertVisible(true);
  };

  const confirmDeleteVehicle = async () => {
    if (selectedVehicle) {
      try {
        await deleteVehicle(selectedVehicle._id as string);
        fetchVehicles();
        setAlertVisible(false);
      } catch (error) {
        console.error("Error deleting vehicle:", error);
      }
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchVehicles();
    setRefreshing(false);
  }, [fetchVehicles]);

  const renderSkeletonItem = () => (
    <View
      style={[styles.listItem, { backgroundColor: listItemBackgroundColor }]}
    >
      <FlexibleSkeleton
        width={85}
        height={85}
        borderRadius={Sizes.borderRadiusFull}
      />
      <View style={styles.listItemDetails}>
        <FlexibleSkeleton width={100} height={20} style={{ marginBottom: 5 }} />
        <FlexibleSkeleton width={150} height={20} style={{ marginBottom: 5 }} />
        <FlexibleSkeleton width={120} height={20} />
      </View>
    </View>
  );

  const renderContent = () => {
    if (loading && !refreshing) {
      return (
        <ListContainer>
          <FlatList
            data={[1, 2, 3, 4, 5]}
            renderItem={renderSkeletonItem}
            keyExtractor={(item) => item.toString()}
            contentContainerStyle={styles.listContainer}
          />
        </ListContainer>
      );
    }

    if (error) {
      return <ThemedText>Error: {error}</ThemedText>;
    }

    if (vehicles.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <Ionicons
            name="car-outline"
            size={64}
            color={Colors.light.textSecondary}
          />
          <ThemedText style={styles.emptyStateText}>
            {t("You haven't added any vehicles yet")}
          </ThemedText>
          <ThemedText style={styles.emptyStateSubtext}>
            {t("Tap the + button to add your first vehicle")}
          </ThemedText>
        </View>
      );
    }

    return (
      <ListContainer>
        <FlatList
          data={vehicles}
          renderItem={({ item }) => (
            <VehicleItem
              vehicle={item}
              onEdit={handleEditVehicle}
              onDelete={handleDeleteVehicle}
            />
          )}
          keyExtractor={(item) => item.vehicleId}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </ListContainer>
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
        onPress={() =>
          router.push({
            pathname: "/profile/vehicles/add-vehicles",
            params: { isEdit: "false" },
          })
        }
      />
      <Alert
        message={`${t("Are you sure you want to delete")} ${selectedVehicle?.vehicleNumber}?`}
        type="warning"
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        onConfirm={confirmDeleteVehicle}
      />
    </View>
  );
};

const ListContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <View style={styles.listWrapper}>{children}</View>;

export default Vehicles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    gap: responsive(Sizes.paddingMedium),
    paddingVertical: responsive(Sizes.paddingVertical),
    overflow: "hidden",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: responsive(Sizes.paddingSmall),
    paddingHorizontal: responsive(Sizes.paddingMedium),
    borderRadius: responsive(Sizes.borderRadiusMedium),
    marginHorizontal: responsive(Sizes.marginSmall),
    marginBottom: responsive(Sizes.marginSmall),
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: responsive(2) },
    shadowOpacity: 0.1,
    shadowRadius: responsive(4),
  },
  listItemImage: {
    width: responsive(85),
    height: responsive(85),
    borderRadius: responsive(Sizes.borderRadiusFull),
  },
  listItemDetails: {
    flex: 1,
    marginLeft: responsive(Sizes.paddingMedium),
  },
  listItemType: {
    fontSize: responsive(Sizes.textMedium),
    fontWeight: "bold",
  },
  listItemNumber: {
    fontSize: responsive(Sizes.textMedium),
  },
  listItemBrand: {
    fontSize: responsive(Sizes.textNormal),
    color: Colors.light.textSecondary,
  },
  addButton: {
    position: "absolute",
    right: responsive(Sizes.marginHorizontal),
    bottom: responsive(Sizes.marginMedium),
  },
  menuButton: {
    padding: responsive(Sizes.paddingSmall),
  },
  listWrapper: {
    flex: 1,
    overflow: "hidden",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: responsive(Sizes.paddingLarge),
  },
  emptyStateText: {
    fontSize: responsive(Sizes.textLarge),
    fontWeight: "bold",
    textAlign: "center",
    marginTop: responsive(Sizes.marginMedium),
  },
  emptyStateSubtext: {
    fontSize: responsive(Sizes.textNormal),
    textAlign: "center",
    color: Colors.light.textSecondary,
    marginTop: responsive(Sizes.marginSmall),
  },
});
