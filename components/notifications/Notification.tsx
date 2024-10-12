import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import Colors from "@/constants/Colors";
import Sizes from "@/constants/Sizes";
import { t } from "i18next";
import { responsive, vw, vh } from "@/utils/responsive";
import {
  useFetchNotifications,
  useUpdateNotification,
} from "@/hooks/useNotification";
import { Notification as NotificationType } from "@/types/Notification";
import { ScrollView } from "react-native-gesture-handler";

const NotificationItem = ({
  item,
  onPress,
}: {
  item: NotificationType;
  onPress: (notification: NotificationType) => void;
}) => {
  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "cardBackground",
  );
  const textColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );
  const secondaryTextColor = useThemeColor(
    { light: Colors.light.textSecondary, dark: Colors.dark.textSecondary },
    "textSecondary",
  );
  const iconColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.dark.secondary },
    "primary",
  );

  const unreadStyle = item.isRead
    ? {}
    : {
        backgroundColor: useThemeColor(
          {
            light: Colors.light.cardBackground,
            dark: Colors.dark.cardBackground,
          },
          "cardBackground",
        ),
        borderLeftWidth: 4,
        borderLeftColor: iconColor,
      };

  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      style={[styles.notificationItem, { backgroundColor }, unreadStyle]}
    >
      <Ionicons
        name="notifications"
        size={responsive(24)}
        color={iconColor}
        style={styles.notificationIcon}
      />
      <View style={styles.notificationContent}>
        <Text style={[styles.notificationTitle, { color: textColor }]}>
          {t(item.type)}
        </Text>
        <Text
          style={[styles.notificationText, { color: secondaryTextColor }]}
          numberOfLines={2}
        >
          {t(item.message)}
        </Text>
        <Text
          style={[styles.notificationTimestamp, { color: secondaryTextColor }]}
        >
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const NotificationDialog = ({
  notification,
  visible,
  onClose,
}: {
  notification: NotificationType | null;
  visible: boolean;
  onClose: () => void;
}) => {
  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background",
  );
  const textColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );
  const secondaryTextColor = useThemeColor(
    { light: Colors.light.textSecondary, dark: Colors.dark.textSecondary },
    "textSecondary",
  );
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: visible ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.centeredView}>
          <Animated.View
            style={[
              styles.modalView,
              { backgroundColor, transform: [{ scale: scaleAnim }] },
            ]}
          >
            <Ionicons
              name="close"
              size={responsive(24)}
              color={textColor}
              style={styles.closeIcon}
              onPress={onClose}
            />
            <Text style={[styles.modalTitle, { color: textColor }]}>
              {t(notification?.type ?? "")}
            </Text>
            <Text style={[styles.modalContent, { color: textColor }]}>
              {t(notification?.message ?? "")}
            </Text>
            <Text
              style={[styles.modalTimestamp, { color: secondaryTextColor }]}
            >
              {notification
                ? new Date(notification.createdAt).toLocaleString()
                : ""}
            </Text>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const Notifications = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationType | null>(null);
  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background",
  );
  const iconColor = useThemeColor(
    { light: Colors.light.icon, dark: Colors.dark.icon },
    "icon",
  );
  const dropdownAnim = useRef(new Animated.Value(0)).current;

  const { notifications, loading, error, refetch } = useFetchNotifications();
  const { updateNotification } = useUpdateNotification();

  useEffect(() => {
    Animated.timing(dropdownAnim, {
      toValue: isDropdownVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isDropdownVisible]);

  const toggleDropdown = () => setIsDropdownVisible(!isDropdownVisible);

  const handleNotificationPress = async (notification: NotificationType) => {
    setSelectedNotification(notification);
    setIsDropdownVisible(false);

    if (!notification.isRead) {
      try {
        await updateNotification(notification._id, { isRead: true });
        refetch();
      } catch (error) {
        console.error("Error updating notification:", error);
      }
    }
  };

  return (
    <>
      {isDropdownVisible && (
        <TouchableWithoutFeedback onPress={() => setIsDropdownVisible(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}
      <View style={styles.container}>
        <TouchableOpacity
          onPress={toggleDropdown}
          style={styles.notificationIcon}
        >
          <Ionicons
            name="notifications"
            size={responsive(Sizes.icon.medium)}
            color={iconColor}
          />
          {notifications.length > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {
                  notifications.filter((notification) => !notification.isRead)
                    .length
                }
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {isDropdownVisible && (
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.dropdownContainer,
                {
                  backgroundColor,
                  opacity: dropdownAnim,
                  transform: [
                    {
                      translateY: dropdownAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [vh(-2.5), 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              {loading ? (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <Text>Loading...</Text>
                </View>
              ) : error ? (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <Text>Error: {error}</Text>
                </View>
              ) : (
                <ScrollView>
                  {notifications.map((item) => (
                    <NotificationItem
                      key={item._id}
                      item={item}
                      onPress={handleNotificationPress}
                    />
                  ))}
                </ScrollView>
              )}
            </Animated.View>
          </TouchableWithoutFeedback>
        )}

        <NotificationDialog
          notification={selectedNotification}
          visible={!!selectedNotification}
          onClose={() => setSelectedNotification(null)}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  notificationIcon: {
    position: "relative",
    padding: vw(2),
    zIndex: 100,
  },
  notificationBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: Colors.light.error,
    borderRadius: vw(2.5),
    width: vw(5),
    height: vw(5),
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadgeText: {
    color: Colors.light.background,
    fontSize: responsive(Sizes.textSmall),
    fontWeight: "bold",
  },
  dropdownContainer: {
    position: "absolute",
    top: vh(6),
    right: 0,
    width: vw(80),
    maxWidth: vw(80),
    maxHeight: vh(50),
    minHeight: vh(10),
    borderRadius: responsive(Sizes.borderRadiusLarge),
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
    zIndex: 100,
    overflow: "hidden",
  },
  notificationItem: {
    flexDirection: "row",
    padding: vw(4),
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: responsive(Sizes.textNormal),
    fontWeight: "bold",
  },
  notificationText: {
    fontSize: responsive(Sizes.textSmall),
  },
  notificationTimestamp: {
    fontSize: responsive(Sizes.textSmall),
    color: Colors.light.textSecondary,
  },
  modalView: {
    margin: vw(5),
    borderRadius: vw(5),
    padding: vw(8),
    alignItems: "center",
    elevation: 5,
    zIndex: 1001,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    height: "100%",
  },
  modalTitle: {
    fontSize: responsive(Sizes.textLarge),
    fontWeight: "bold",
    marginBottom: vh(2),
  },
  modalContent: {
    fontSize: responsive(Sizes.textNormal),
    textAlign: "center",
    marginBottom: vh(1.5),
  },
  modalTimestamp: {
    fontSize: responsive(Sizes.textSmall),
  },
  closeIcon: {
    position: "absolute",
    top: vh(2),
    right: vw(4),
  },
  overlay: {
    position: "absolute",
    width: 0,
    height: 0,
  },
  dropdownListContainer: {
    maxHeight: vh(50),
  },
});

export default Notifications;
