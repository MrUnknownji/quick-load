import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Dimensions,
  StatusBar,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import { Tabs, router } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import FindRouteBottomSheet from "./bottom-sheet";
import usePathChangeListener from "@/hooks/usePathChangeListener";
import Colors from "@/constants/Colors";
import Sizes from "@/constants/Sizes";
import { t } from "i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { responsive, vw, vh } from "@/utils/responsive";
import { useUser } from "@/hooks/useUser";

const SCREEN_HEIGHT = vh(100);
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + (StatusBar.currentHeight ?? 0);
const MIN_TRANSLATE_Y = responsive(Sizes.tabBarHeight);

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

interface TabBarIconProps {
  name: IconName;
  label: string;
  color: string;
  focused: boolean;
}

function TabBarIcon({ name, label, color, focused }: TabBarIconProps) {
  const iconName = focused ? name : (`${name}-outline` as IconName);
  return (
    <View style={styles.iconContainer}>
      <AnimatedTabBarIcon name={iconName} color={color} focused={focused} />
      <AnimatedTabBarLabel label={label} color={color} focused={focused} />
    </View>
  );
}

interface CustomTabBarButtonProps {
  children: React.ReactNode;
  onPress: () => void;
}

function CustomTabBarButton({ children, onPress }: CustomTabBarButtonProps) {
  return (
    <Pressable style={styles.customButton} onPress={onPress}>
      <View style={styles.customButtonInner}>{children}</View>
    </Pressable>
  );
}

interface RotatingIconProps {
  focused: boolean;
}

function RotatingIcon({ focused }: RotatingIconProps) {
  const rotation = useSharedValue(0);
  useEffect(() => {
    rotation.value = withTiming(focused ? 1 : 0, {
      duration: Sizes.animationDurationShort,
    });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(rotation.value, [0, 1], [0, 45])}deg` },
    ],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons
        name="add-circle"
        color={Colors.light.backgroundSecondary}
        size={Sizes.icon.extraLarge}
      />
    </Animated.View>
  );
}

interface AnimatedTabBarIconProps {
  name: IconName;
  color: string;
  focused: boolean;
}

function AnimatedTabBarIcon({ name, color, focused }: AnimatedTabBarIconProps) {
  const animation = useSharedValue(0);
  useEffect(() => {
    animation.value = withSpring(focused ? 1 : 0, {
      duration: Sizes.animationDurationMedium,
    });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animation.value, [0, 1], [0.8, 1]),
    transform: [
      { scale: interpolate(animation.value, [0, 1], [0.9, 1]) },
      { translateY: interpolate(animation.value, [0, 1], [10, 0]) },
    ],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <MaterialCommunityIcons
        name={name}
        color={color}
        size={Sizes.icon.medium}
      />
    </Animated.View>
  );
}

interface AnimatedTabBarLabelProps {
  label: string;
  color: string;
  focused: boolean;
}

function AnimatedTabBarLabel({
  label,
  color,
  focused,
}: AnimatedTabBarLabelProps) {
  const animation = useSharedValue(0);
  useEffect(() => {
    animation.value = withTiming(focused ? 1 : 0, {
      duration: Sizes.animationDurationMedium,
    });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animation.value, [0, 1], [0.8, 1]),
    transform: [{ scale: interpolate(animation.value, [0, 1], [0, 1]) }],
  }));

  return (
    <Animated.Text
      style={[styles.label, { color }, animatedStyle]}
      numberOfLines={1}
      ellipsizeMode="tail"
    >
      {label}
    </Animated.Text>
  );
}

export default function TabLayout() {
  const [isBottomSheetActive, setIsBottomSheetActive] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const translateY = useSharedValue(MIN_TRANSLATE_Y);
  const context = useSharedValue({ y: MIN_TRANSLATE_Y });
  const { activePath, setActivePath } = usePathChangeListener();
  const { loading } = useLanguage();
  const { user } = useUser();

  const bottomSheetBackgroundColor = useThemeColor(
    {
      light: Colors.light.background,
      dark: Colors.dark.background,
    },
    "background",
  );

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (isBottomSheetActive) {
          closeBottomSheet();
          return true;
        }
        return false;
      },
    );
    return () => backHandler.remove();
  }, [isBottomSheetActive]);

  const scrollTo = useCallback((destination: number) => {
    "worklet";
    translateY.value = withTiming(destination);
  }, []);

  const closeBottomSheet = useCallback(() => {
    scrollTo(MIN_TRANSLATE_Y);
    setIsBottomSheetActive(false);
    setIsOverlayVisible(false);
  }, [scrollTo]);

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = Math.max(
        Math.min(event.translationY + context.value.y, MIN_TRANSLATE_Y),
        MAX_TRANSLATE_Y,
      );
    })
    .onEnd(() => {
      if (translateY.value > -SCREEN_HEIGHT / 1.5) {
        scrollTo(MIN_TRANSLATE_Y);
        runOnJS(setIsBottomSheetActive)(false);
        runOnJS(setIsOverlayVisible)(false);
      } else {
        scrollTo(MAX_TRANSLATE_Y);
      }
    });

  const rBottomSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleToggleBottomSheet = useCallback(() => {
    if (!user) return;

    if (user.type === "merchant-driver" || user.type === "admin") {
      if (!isBottomSheetActive) {
        setIsBottomSheetActive(true);
        setIsOverlayVisible(true);
        scrollTo(MAX_TRANSLATE_Y);
      } else {
        closeBottomSheet();
      }
    } else if (user.type === "merchant") {
      router.push({
        pathname: "/find-route",
        params: { userType: "merchant" },
      });
    } else if (user.type === "driver") {
      router.push({
        pathname: "/find-route",
        params: { userType: "driver" },
      });
    }
  }, [isBottomSheetActive, scrollTo, closeBottomSheet, user]);

  const preventTabPress = useCallback(
    (e: { preventDefault: () => void }, tabName: string) => {
      setActivePath(tabName);
      if (isBottomSheetActive) e.preventDefault();
    },
    [isBottomSheetActive, setActivePath],
  );

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: Colors.light.backgroundSecondary,
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarIcon: ({ color, focused }) =>
            route.name === "bottom-sheet" ? (
              <RotatingIcon focused={isBottomSheetActive} />
            ) : (
              <TabBarIcon
                name={getIconName(route.name)}
                color={color}
                focused={activePath.includes(route.name)}
                label={getLabelName(route.name)}
              />
            ),
          tabBarButton:
            route.name === "bottom-sheet"
              ? (props) => (
                  <CustomTabBarButton
                    {...props}
                    onPress={handleToggleBottomSheet}
                  />
                )
              : undefined,
        })}
      >
        <Tabs.Screen
          name="index"
          listeners={{ tabPress: (e) => preventTabPress(e, "index") }}
        />
        <Tabs.Screen
          name="track-order"
          listeners={{ tabPress: (e) => preventTabPress(e, "track-order") }}
        />
        <Tabs.Screen name="bottom-sheet" options={{ tabBarShowLabel: false }} />
        <Tabs.Screen
          name="contact-us"
          listeners={{ tabPress: (e) => preventTabPress(e, "contact-us") }}
        />
        <Tabs.Screen
          name="profile"
          listeners={{ tabPress: (e) => preventTabPress(e, "profile") }}
        />
      </Tabs>
      {(user?.type === "merchant-driver" || user?.type === "admin") && (
        <>
          {isOverlayVisible && <View style={styles.overlay} />}
          <GestureDetector gesture={gesture}>
            <Animated.View
              style={[
                styles.bottomSheetScreen,
                rBottomSheetStyle,
                { backgroundColor: bottomSheetBackgroundColor },
              ]}
            >
              <View style={styles.line} />
              <View style={styles.bottomSheetContent}>
                <FindRouteBottomSheet />
              </View>
            </Animated.View>
          </GestureDetector>
        </>
      )}
    </>
  );
}

function getIconName(routeName: string): IconName {
  const iconMap: Record<string, IconName> = {
    index: "home",
    "track-order": "truck",
    "contact-us": "phone",
    profile: "account",
  };
  return iconMap[routeName] || "help-circle";
}

function getLabelName(routeName: string): string {
  const labelMap: Record<string, string> = {
    index: "Home",
    "track-order": "Track Order",
    "contact-us": "Contact Us",
    profile: "Profile",
  };
  return t(labelMap[routeName] || "Other");
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    borderTopWidth: 0,
    backgroundColor: Colors.light.primary,
    borderTopLeftRadius: responsive(Sizes.borderRadiusMedium),
    borderTopRightRadius: responsive(Sizes.borderRadiusMedium),
    paddingVertical: responsive(Sizes.paddingSmall),
    paddingHorizontal: responsive(Sizes.paddingExtraSmall),
    height: responsive(Sizes.tabBarHeight),
    bottom: 0,
  },
  customButton: {
    top: responsive(-Sizes.customButtonOffset),
    justifyContent: "center",
    alignItems: "center",
  },
  customButtonInner: {
    width: responsive(Sizes.customButtonSize),
    height: responsive(Sizes.customButtonSize),
    borderRadius: responsive(Sizes.customButtonSize / 2),
    backgroundColor: Colors.light.primary,
  },
  iconContainer: {
    alignItems: "center",
  },
  label: {
    fontSize: responsive(Sizes.textSmall),
    maxWidth: responsive(Sizes.tabLabelMaxWidth),
    textAlign: "center",
  },
  bottomSheetScreen: {
    height: SCREEN_HEIGHT,
    width: "100%",
    position: "absolute",
    top: SCREEN_HEIGHT,
    borderTopLeftRadius: responsive(Sizes.borderRadiusMedium),
    borderTopRightRadius: responsive(Sizes.borderRadiusMedium),
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: responsive(-2),
    },
    shadowOpacity: 0.25,
    shadowRadius: responsive(3.84),
    zIndex: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },
  bottomSheetContent: {
    flex: 1,
    padding: responsive(Sizes.paddingMedium),
  },
  line: {
    width: responsive(Sizes.bottomSheetLineWidth),
    height: responsive(Sizes.bottomSheetLineHeight),
    backgroundColor: Colors.light.primary,
    alignSelf: "center",
    marginVertical: responsive(Sizes.marginVertical),
    borderRadius: responsive(Sizes.bottomSheetLineHeight / 2),
  },
});
