import React, { useEffect, useRef } from "react";
import { View, Image, Animated, Easing, Dimensions } from "react-native";
import { Asset } from "expo-asset";

const { width, height } = Dimensions.get("window");

const CustomSplashScreen = ({ onFinish }: any) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const fadeOutAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Asset.loadAsync(require("@/assets/images/splash.png")).then(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1.2,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(fadeOutAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => {
            onFinish();
          });
        }, 1000);
      });
    });
  }, []);

  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOutAnim,
      }}
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        }}
      >
        <Image
          source={require("@/assets/images/splash.png")}
          style={{
            width: width * 0.4,
            height: width * 0.4,
          }}
          resizeMode="contain"
        />
      </Animated.View>
    </Animated.View>
  );
};

export default CustomSplashScreen;
