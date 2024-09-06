import { StyleSheet, Text, TouchableNativeFeedback, View } from "react-native";
import React from "react";
import { FlatList } from "react-native-gesture-handler";
import { Image } from "expo-image";
import Colors from "@/constants/Colors";
import Sizes from "@/constants/Sizes";
import IconButton from "@/components/button/IconButton";
import { VehicleTypeProps } from "@/constants/types/types";
import { VEHICLES_LIST } from "@/assets/data/DATA";
import { router } from "expo-router";
import { t } from "i18next";

// const renderVehicleItem = (vehicle: VehicleTypeProps) => {
//   return (
//     <View
//       style={{
//         borderRadius: Sizes.borderRadiusMedium,
//         marginHorizontal: Sizes.marginSmall,
//         overflow: "hidden",
//         elevation: 3,
//       }}
//     >
//       <TouchableNativeFeedback
//         onPress={() =>
//           router.push({
//             pathname: "/profile/vehicles/add-vehicles",
//             params: { vehicleId: vehicle.id },
//           })
//         }
//       >
//         <View style={styles.listItem}>
//           <Image source={vehicle.image} style={styles.listItemImage} />
//           <View style={styles.listItemDetails}>
//             <Text style={styles.listItemType}>{t(vehicle.vehicleType)}</Text>
//             <Text style={styles.listItemNumber}>{vehicle.vehicleNumber}</Text>

//             <Text style={styles.listItemBrand}>{vehicle.brand}</Text>
//           </View>
//         </View>
//       </TouchableNativeFeedback>
//     </View>
//   );
// };

const renderVehicleItem = (vehicle: VehicleTypeProps) => {
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
            params: { vehicleId: vehicle.id, isEdit: "true" },
          })
        }
      >
        <View style={styles.listItem}>
          <Image source={vehicle.image} style={styles.listItemImage} />
          <View style={styles.listItemDetails}>
            <Text style={styles.listItemType}>{t(vehicle.vehicleType)}</Text>
            <Text style={styles.listItemNumber}>{vehicle.vehicleNumber}</Text>
            <Text style={styles.listItemBrand}>{vehicle.brand}</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

const Vehicles = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={VEHICLES_LIST}
        renderItem={({ item }) => renderVehicleItem(item)}
        keyExtractor={(item, index) =>
          `${item.id.toString()}-${index.toString()}`
        }
        contentContainerStyle={styles.listContainer}
      />
      <IconButton
        iconName="add"
        size="medium"
        variant="primary"
        style={{
          position: "absolute",
          right: Sizes.marginHorizontal,
          bottom: Sizes.marginMedium,
        }}
        onPress={() => router.push("/profile/vehicles/add-vehicles")}
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
    backgroundColor: Colors.light.cardBackground,
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
});
