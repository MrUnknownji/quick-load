import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import Colors from "@/constants/Colors";
import Sizes from "@/constants/Sizes";
import { t } from "i18next";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface Notification {
  id: string;
  title: string;
  content: string;
  timestamp: string;
}

const dummyNotifications: Notification[] = [
  {
    id: "1",
    title: "New message",
    content: "You have a new message from John Doe.",
    timestamp: "2",
  },
  {
    id: "2",
    title: "Friend request",
    content: "Jane Smith sent you a friend request.",
    timestamp: "1",
  },
  {
    id: "3",
    title: "Event reminder",
    content: 'Your event "Team Meeting" starts in 30 minutes.',
    timestamp: "3",
  },
];

const NotificationItem = ({
  item,
  onPress,
}: {
  item: Notification;
  onPress: (notification: Notification) => void;
}) => {
  const backgroundColor = useThemeColor(
    { light: Colors.light.cardBackground, dark: Colors.dark.cardBackground },
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

  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      style={[styles.notificationItem, { backgroundColor }]}
    >
      <Ionicons
        name="notifications"
        size={24}
        color={iconColor}
        style={styles.notificationIcon}
      />
      <View style={styles.notificationContent}>
        <Text style={[styles.notificationTitle, { color: textColor }]}>
          {t(item.title)}
        </Text>
        <Text
          style={[styles.notificationText, { color: secondaryTextColor }]}
          numberOfLines={2}
        >
          {t(item.content)}
        </Text>
        <Text
          style={[styles.notificationTimestamp, { color: secondaryTextColor }]}
        >
          {item.timestamp} {t("minutes ago")}
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
  notification: Notification | null;
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
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent={true}
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
              size={24}
              color={textColor}
              style={styles.closeIcon}
              onPress={onClose}
            />
            <Text style={[styles.modalTitle, { color: textColor }]}>
              {t(notification?.title ?? "")}
            </Text>
            <Text style={[styles.modalContent, { color: textColor }]}>
              {t(notification?.content ?? "")}
            </Text>
            <Text
              style={[styles.modalTimestamp, { color: secondaryTextColor }]}
            >
              {notification?.timestamp} {t("minutes ago")}
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
    useState<Notification | null>(null);
  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background",
  );
  const iconColor = useThemeColor(
    { light: Colors.light.icon, dark: Colors.dark.icon },
    "icon",
  );
  const dropdownAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(dropdownAnim, {
      toValue: isDropdownVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isDropdownVisible]);

  const toggleDropdown = () => setIsDropdownVisible(!isDropdownVisible);
  const handleNotificationPress = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsDropdownVisible(false);
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
            size={Sizes.icon.medium}
            color={iconColor}
          />
          {dummyNotifications.length > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {dummyNotifications.length}
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
                        outputRange: [-20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <FlatList
                data={dummyNotifications}
                renderItem={({ item }) => (
                  <NotificationItem
                    item={item}
                    onPress={handleNotificationPress}
                  />
                )}
                keyExtractor={(item) => item.id}
              />
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
    padding: Sizes.paddingSmall,
    zIndex: 100,
  },
  notificationBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: Colors.light.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadgeText: {
    color: Colors.light.background,
    fontSize: Sizes.textSmall,
    fontWeight: "bold",
  },
  dropdownContainer: {
    position: "absolute",
    top: 50,
    right: 0,
    width: 300,
    maxHeight: 400,
    borderRadius: Sizes.borderRadiusLarge,
    overflow: "hidden",
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
  },
  notificationItem: {
    flexDirection: "row",
    padding: Sizes.paddingMedium,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: Sizes.textNormal,
    fontWeight: "bold",
  },
  notificationText: {
    fontSize: Sizes.textSmall,
  },
  notificationTimestamp: {
    fontSize: Sizes.textSmall,
    color: Colors.light.textSecondary,
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
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
    fontSize: Sizes.textLarge,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalContent: {
    fontSize: Sizes.textNormal,
    textAlign: "center",
    marginBottom: 10,
  },
  modalTimestamp: {
    fontSize: Sizes.textSmall,
  },
  closeIcon: {
    position: "absolute",
    top: 15,
    right: 15,
  },
  overlay: {},
});

export default Notifications;
