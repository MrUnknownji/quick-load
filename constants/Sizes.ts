import { Platform, StatusBar } from "react-native";

const Sizes = {
  // Margins
  marginHorizontal: 16,
  marginVertical: 16,
  marginExtraSmall: 4,
  marginSmall: 8,
  marginMedium: 12,
  marginLarge: 24,

  // Paddings
  paddingHorizontal: 16,
  paddingVertical: 16,
  paddingExtraSmall: 4,
  paddingSmall: 8,
  paddingMedium: 12,
  paddingLarge: 24,
  paddingExtraLarge: 32,

  // Radius
  borderRadius: 10,
  borderRadiusSmall: 5,
  borderRadiusMedium: 15,
  borderRadiusLarge: 25,
  borderRadiusFull: 50,

  // Adding as an object to be used in IconButton
  icon: {
    extraSmall: 16,
    small: 24,
    medium: 32,
    large: 48,
    extraLarge: 64,
  },

  // Text Sizes
  textSmall: 12,
  textNormal: 14,
  textMedium: 16,
  textLarge: 20,
  textExtraLarge: 24,

  // Card Sizes
  cardHeight: 150,
  cardWidth: "100%",
  cardPadding: 16,
  cardMarginBottom: 16,
  cardImageHeight: 120,

  // Button Sizes
  buttonHeight: 48,
  buttonPadding: 16,
  buttonBorderRadius: 8,

  // Miscellaneous Sizes
  headerHeight: 56,
  footerHeight: 56,
  tabBarHeight: 56,
  avatarSize: 40,
  badgeSize: 20,

  // Specific Component Sizes
  searchBarHeight: 48,
  tabIconSize: 24,
  carouselHeight: 200,

  // Animations
  animationDurationShort: 100,
  animationDurationMedium: 200,
  animationDurationLong: 300,

  // Custom Button
  customButtonSize: 70,
  customButtonOffset: 30,
  tabLabelMaxWidth: 60,
  bottomSheetLineWidth: 75,
  bottomSheetLineHeight: 4,

  // StatusBar
  StatusBarHeight: Platform.OS === "android" ? StatusBar.currentHeight : 0,
};

export default Sizes;
