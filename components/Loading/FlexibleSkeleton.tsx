import React from "react";
import { View, StyleSheet, Animated, ViewStyle } from "react-native";

interface FlexibleSkeletonProps {
  width: number | string;
  height: number | string;
  borderRadius?: number;
  style?: ViewStyle;
}

const FlexibleSkeleton: React.FC<FlexibleSkeletonProps> = ({
  width,
  height,
  borderRadius = 4,
  style,
}) => {
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

  const animatedStyle = {
    opacity: opacityValue,
  };

  return (
    <Animated.View
      style={
        [
          styles.skeleton,
          {
            width: width as ViewStyle["width"],
            height: height as ViewStyle["height"],
            borderRadius,
          },
          style,
          animatedStyle,
        ] as Animated.AnimatedProps<ViewStyle>
      }
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#E0E0E0",
  },
});

export default FlexibleSkeleton;
