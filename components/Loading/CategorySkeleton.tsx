import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import Sizes from "@/constants/Sizes";

const CategorySkeleton: React.FC = () => {
  const opacityValue = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [opacityValue]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle, { opacity: opacityValue }]} />
      <Animated.View style={[styles.label, { opacity: opacityValue }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginHorizontal: Sizes.marginSmall,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: Sizes.borderRadiusFull,
    backgroundColor: "#E0E0E0",
  },
  label: {
    width: 50,
    height: 10,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
    marginTop: 8,
  },
});

export default CategorySkeleton;
