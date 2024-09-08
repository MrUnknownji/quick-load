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
import { Tabs } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as NavigationBar from "expo-navigation-bar";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  withSpring,
  runOnJS,
  Extrapolation,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { EventArg } from "@react-navigation/native";
import Create from "./create";
import usePathChangeListener from "@/hooks/usePathChangeListener";
import Colors from "@/constants/Colors";
import Sizes from "@/constants/Sizes";
import { t } from "i18next";
import { useLanguage } from "../Context/LanguageContext";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + (StatusBar.currentHeight ?? 0);
const MIN_TRANSLATE_Y = Sizes.tabBarHeight;

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

function CustomTabBarButton({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.customButton} onPress={onPress}>
      <View style={styles.customButtonInner}>{children}</View>
    </Pressable>
  );
}

function RotatingIcon({ focused }: { focused: boolean }) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withTiming(focused ? 1 : 0, {
      duration: Sizes.animationDurationShort,
    });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(rotation.value, [0, 1], [0, 45]);
    return { transform: [{ rotate: `${rotate}deg` }] };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons
        name="add-circle"
        color={Colors.light.backgroundSecondary}
        size={Sizes.icon["extraLarge"]}
      />
    </Animated.View>
  );
}

function AnimatedTabBarIcon({
  name,
  label,
  color,
  focused,
}: {
  name: IconName;
  label: string;
  color: string;
  focused: boolean;
}) {
  const animation = useSharedValue(0);

  useEffect(() => {
    animation.value = withSpring(focused ? 1 : 0, {
      duration: Sizes.animationDurationMedium,
    });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animation.value, [0, 1], [0.8, 1]);
    const scale = interpolate(animation.value, [0, 1], [0.9, 1]);
    const translateY = interpolate(animation.value, [0, 1], [10, 0]);
    return { opacity, transform: [{ scale }, { translateY }] };
  });

  return (
    <View style={styles.iconContainer}>
      <Animated.View style={animatedStyle}>
        <MaterialCommunityIcons
          name={focused ? name : (`${name}-outline` as IconName)}
          color={color}
          size={Sizes.icon["medium"]}
        />
      </Animated.View>
      <AnimatedTabBarLabel label={label} color={color} focused={focused} />
    </View>
  );
}

function AnimatedTabBarLabel({
  label,
  color,
  focused,
}: {
  label: string;
  color: string;
  focused: boolean;
}) {
  const animation = useSharedValue(0);

  useEffect(() => {
    animation.value = withTiming(focused ? 1 : 0, {
      duration: Sizes.animationDurationMedium,
    });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animation.value, [0, 1], [0.8, 1]);
    const scale = interpolate(animation.value, [0, 1], [0, 1]);
    return { opacity, transform: [{ scale }] };
  });

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
  const [isCreateActive, setIsCreateActive] = useState(false);
  const translateY = useSharedValue(MIN_TRANSLATE_Y);
  const context = useSharedValue({ y: MIN_TRANSLATE_Y });
  const { activePath, setActivePath } = usePathChangeListener();
  const { loading } = useLanguage();

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(Colors.light.primary);
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (isCreateActive) {
          closeBottomSheet();
          return true;
        }
        return false;
      }
    );
    return () => backHandler.remove();
  }, [isCreateActive]);

  const scrollTo = (destination: number) => {
    "worklet";
    translateY.value = withTiming(destination);
  };

  const closeBottomSheet = useCallback(() => {
    scrollTo(MIN_TRANSLATE_Y);
    setIsCreateActive(false);
  }, []);

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = Math.max(
        Math.min(event.translationY + context.value.y, MIN_TRANSLATE_Y),
        MAX_TRANSLATE_Y
      );
    })
    .onEnd(() => {
      if (translateY.value > -SCREEN_HEIGHT / 1.5) {
        scrollTo(MIN_TRANSLATE_Y);
        runOnJS(setIsCreateActive)(false);
      } else {
        scrollTo(MAX_TRANSLATE_Y);
      }
    });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translateY.value,
      [MAX_TRANSLATE_Y + Sizes.borderRadiusSmall, MAX_TRANSLATE_Y],
      [Sizes.borderRadiusMedium, Sizes.borderRadiusSmall],
      Extrapolation.CLAMP
    );
    return { borderRadius, transform: [{ translateY: translateY.value }] };
  });

  const handleCreatePress = () => {
    if (!isCreateActive) {
      setIsCreateActive(true);
      scrollTo(MAX_TRANSLATE_Y);
    } else {
      closeBottomSheet();
    }
  };

  function preventTabPress(
    e: EventArg<"tabPress", true, undefined> & { target?: string },
    tabName: string
  ) {
    setActivePath(tabName);
    if (isCreateActive) e.preventDefault();
  }

  if (loading)
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );

  return (
    <>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: Colors.light.backgroundSecondary,
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarIcon: ({ color, focused }) =>
            route.name === "create" ? (
              <RotatingIcon focused={isCreateActive} />
            ) : (
              <AnimatedTabBarIcon
                name={getIconName(route.name)}
                color={color}
                focused={activePath.includes(route.name)}
                label={getLabelName(route.name)}
              />
            ),
          tabBarButton:
            route.name === "create"
              ? (props) => (
                  <CustomTabBarButton {...props} onPress={handleCreatePress} />
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
        <Tabs.Screen name="create" options={{ tabBarShowLabel: false }} />
        <Tabs.Screen
          name="contact-us"
          listeners={{ tabPress: (e) => preventTabPress(e, "contact-us") }}
        />
        <Tabs.Screen
          name="profile"
          listeners={{ tabPress: (e) => preventTabPress(e, "profile") }}
        />
      </Tabs>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.createScreen, rBottomSheetStyle]}>
          <View style={styles.line} />
          <View style={styles.createContent}>
            <Create />
          </View>
        </Animated.View>
      </GestureDetector>
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    backgroundColor: Colors.light.primary,
    borderTopLeftRadius: Sizes.borderRadiusMedium,
    borderTopRightRadius: Sizes.borderRadiusMedium,
    paddingVertical: Sizes.paddingSmall,
    paddingHorizontal: Sizes.paddingExtraSmall,
    height: Sizes.tabBarHeight,
  },
  customButton: {
    top: -Sizes.customButtonOffset,
    justifyContent: "center",
    alignItems: "center",
  },
  customButtonInner: {
    width: Sizes.customButtonSize,
    height: Sizes.customButtonSize,
    borderRadius: Sizes.customButtonSize / 2,
    backgroundColor: Colors.light.primary,
  },
  iconContainer: {
    alignItems: "center",
  },
  label: {
    fontSize: Sizes.textSmall,
    maxWidth: Sizes.tabLabelMaxWidth,
    textAlign: "center",
  },
  createScreen: {
    height: SCREEN_HEIGHT,
    width: "100%",
    backgroundColor: Colors.light.primary,
    position: "absolute",
    top: SCREEN_HEIGHT,
    borderTopLeftRadius: Sizes.borderRadiusMedium,
    borderTopRightRadius: Sizes.borderRadiusMedium,
  },
  createContent: {
    flex: 1,
    padding: Sizes.paddingMedium,
  },
  line: {
    width: Sizes.bottomSheetLineWidth,
    height: Sizes.bottomSheetLineHeight,
    backgroundColor: Colors.light.backgroundSecondary,
    alignSelf: "center",
    marginVertical: Sizes.marginVertical,
    borderRadius: Sizes.bottomSheetLineHeight / 2,
  },
});

function getIconName(routeName: string): IconName {
  switch (routeName) {
    case "index":
      return "home";
    case "track-order":
      return "truck";
    case "contact-us":
      return "phone";
    case "profile":
      return "account";
    default:
      return "help-circle";
  }
}

function getLabelName(routeName: string): string {
  switch (routeName) {
    case "index":
      return t("Home");
    case "track-order":
      return t("Track Order");
    case "contact-us":
      return t("Contact Us");
    case "profile":
      return t("Profile");
    default:
      return t("Other");
  }
}
