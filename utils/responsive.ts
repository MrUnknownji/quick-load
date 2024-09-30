import { Dimensions, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Base dimensions (you can adjust these based on your design)
const baseWidth = 375;
const baseHeight = 812;

const widthRatio = SCREEN_WIDTH / baseWidth;
const heightRatio = SCREEN_HEIGHT / baseHeight;

export const responsive = (
  size: number,
  based: "width" | "height" = "width",
) => {
  const ratio = based === "width" ? widthRatio : heightRatio;
  const newSize = size * ratio;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export const vw = (percentage: number) => (SCREEN_WIDTH * percentage) / 100;
export const vh = (percentage: number) => (SCREEN_HEIGHT * percentage) / 100;
