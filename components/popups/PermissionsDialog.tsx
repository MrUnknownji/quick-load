import React, { useEffect, useState } from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  Linking,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import * as IntentLauncher from "expo-intent-launcher";
import { ThemedText } from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import Colors from "@/constants/Colors";
import Sizes from "@/constants/Sizes";
import { t } from "i18next";
import { responsive, vw, vh } from "@/utils/responsive";

interface PermissionsDialogProps {
  isVisible: boolean;
  onClose: () => void;
}

interface PermissionState {
  status: "granted" | "denied" | "undetermined";
  request: () => Promise<void>;
}

const PermissionsDialog: React.FC<PermissionsDialogProps> = ({
  isVisible,
  onClose,
}) => {
  const [animation] = useState(new Animated.Value(0));
  const [gpsPermission, setGpsPermission] = useState<PermissionState>({
    status: "undetermined",
    request: async () => {},
  });
  const [notificationPermission, setNotificationPermission] =
    useState<PermissionState>({
      status: "undetermined",
      request: async () => {},
    });

  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background",
  );
  const iconColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.dark.secondary },
    "primary",
  );
  const primaryColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.dark.secondary },
    "primary",
  );

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const checkPermissions = async () => {
      const locationStatus = await Location.getForegroundPermissionsAsync();
      setGpsPermission({
        status: locationStatus.status,
        request: async () => {
          const { status } = await Location.requestForegroundPermissionsAsync();
          setGpsPermission((prev) => ({ ...prev, status }));
          if (status === "denied") {
            openAppSettings();
          }
        },
      });

      const notificationStatus = await Notifications.getPermissionsAsync();
      setNotificationPermission({
        status: notificationStatus.status,
        request: async () => {
          const { status } = await Notifications.requestPermissionsAsync();
          setNotificationPermission((prev) => ({ ...prev, status }));
          if (status === "denied") {
            openAppSettings();
          }
        },
      });
    };

    checkPermissions();
  }, [isVisible, animation]);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  const openAppSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      IntentLauncher.startActivityAsync(
        IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
        { data: "package:" + "com.load.quickload" },
      );
    }
  };

  const handlePermissionRequest = async (
    permission: PermissionState,
    setPermission: React.Dispatch<React.SetStateAction<PermissionState>>,
  ) => {
    if (permission.status === "denied") {
      openAppSettings();
    } else {
      await permission.request();
      const newStatus = await (permission === gpsPermission
        ? Location.getForegroundPermissionsAsync()
        : Notifications.getPermissionsAsync());
      setPermission((prev) => ({ ...prev, status: newStatus.status }));
    }
  };

  const renderPermissionItem = (
    title: string,
    permission: PermissionState,
    setPermission: React.Dispatch<React.SetStateAction<PermissionState>>,
    icon: string,
  ) => (
    <TouchableOpacity
      style={[styles.permissionItem, { borderColor: primaryColor }]}
      onPress={() => handlePermissionRequest(permission, setPermission)}
    >
      <View style={styles.permissionContent}>
        <Ionicons name={icon as any} size={24} color={iconColor} />
        <ThemedText style={styles.permissionText}>{title}</ThemedText>
      </View>
      <View
        style={[
          styles.statusIcon,
          {
            backgroundColor:
              permission.status === "granted"
                ? Colors.light.success
                : primaryColor,
          },
        ]}
      >
        <Ionicons
          name={permission.status === "granted" ? "checkmark" : "close"}
          size={16}
          color={Colors.light.background}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="none"
      statusBarTranslucent
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <BlurView
          style={StyleSheet.absoluteFill}
          intensity={30}
          experimentalBlurMethod="dimezisBlurView"
        />
        <Animated.View
          style={[
            styles.dialog,
            { transform: [{ translateY }], backgroundColor },
          ]}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                <Ionicons name="shield-checkmark" size={24} color={iconColor} />
                <ThemedText style={styles.title}>{t("Permissions")}</ThemedText>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={20} color={iconColor} />
              </TouchableOpacity>
            </View>

            {renderPermissionItem(
              t("GPS"),
              gpsPermission,
              setGpsPermission,
              "location",
            )}
            {renderPermissionItem(
              t("Notifications"),
              notificationPermission,
              setNotificationPermission,
              "notifications",
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dialog: {
    borderRadius: responsive(Sizes.borderRadiusMedium),
    padding: vw(5),
    width: vw(80),
    maxWidth: vw(80),
    elevation: 10,
  },
  content: {
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: vh(2.5),
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  closeButton: {
    padding: vw(1),
  },
  title: {
    fontSize: responsive(18),
    fontWeight: "bold",
    marginLeft: vw(2.5),
  },
  permissionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: vw(4),
    borderRadius: responsive(Sizes.borderRadiusMedium),
    borderWidth: 1,
    marginBottom: vh(1.5),
    width: "100%",
  },
  permissionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  permissionText: {
    fontSize: responsive(16),
    marginLeft: vw(2.5),
  },
  statusIcon: {
    width: vw(6),
    height: vw(6),
    borderRadius: vw(3),
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PermissionsDialog;
