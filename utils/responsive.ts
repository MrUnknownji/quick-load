import { Dimensions, PixelRatio, Platform } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Base dimensions (you can adjust these based on your design)
const baseWidth = 375;
const baseHeight = 812;

// Calculate the scale factor based on screen width and pixel density
const scale = SCREEN_WIDTH / baseWidth;
const pixelDensity = PixelRatio.get();

export const responsive = (size: number) => {
  const scaleWidth = SCREEN_WIDTH / baseWidth;
  const scaleHeight = SCREEN_HEIGHT / baseHeight;
  const scaleRatio = Math.min(scaleWidth, scaleHeight);

  // Adjust the scale based on pixel density
  const adjustedScale = scaleRatio * (pixelDensity > 2 ? 0.8 : 1);

  const newSize = size * adjustedScale;

  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
};

// Minimum size to prevent components from becoming too small
const minSize = (size: number) => Math.max(size, 8);

export const vw = (percentage: number) =>
  minSize((SCREEN_WIDTH * percentage) / 100);
export const vh = (percentage: number) =>
  minSize((SCREEN_HEIGHT * percentage) / 100);

// New function for font scaling
export const scaledFontSize = (size: number) => {
  const scaleFactor = Math.min(
    SCREEN_WIDTH / baseWidth,
    SCREEN_HEIGHT / baseHeight,
  );
  return Math.round(size * scaleFactor);
};
