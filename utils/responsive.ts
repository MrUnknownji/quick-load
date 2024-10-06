import { Dimensions, PixelRatio, Platform } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Base dimensions
const baseWidth = 375;
const baseHeight = 812;

// Calculate the scale factor based on screen width and pixel density
const scale = SCREEN_WIDTH / baseWidth;
const pixelDensity = PixelRatio.get();

export const responsive = (size: number) => {
  const newSize = size * scale;

  // Adjust for high DPI devices
  const adjustedSize = pixelDensity > 2 ? newSize * 0.8 : newSize;

  return Math.round(PixelRatio.roundToNearestPixel(adjustedSize));
};

// Minimum size to prevent components from becoming too small
const minSize = (size: number) => Math.max(size, 8);

export const vw = (percentage: number) =>
  minSize((SCREEN_WIDTH * percentage) / 100);
export const vh = (percentage: number) =>
  minSize((SCREEN_HEIGHT * percentage) / 100);

// function for font scaling
export const scaledFontSize = (size: number) => {
  const scaleFactor = Math.min(scale, SCREEN_HEIGHT / baseHeight);
  const scaledSize = size * scaleFactor;

  // Adjust for high DPI devices
  const adjustedSize = pixelDensity > 2 ? scaledSize * 0.9 : scaledSize;

  return Math.round(adjustedSize);
};

// responsive padding and margins
export const responsiveSpacing = (size: number) => {
  const scaleFactor = Math.min(scale, SCREEN_HEIGHT / baseHeight);
  return Math.round(size * scaleFactor);
};
