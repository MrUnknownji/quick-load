const tintColorLight = "#3C0B0B";
const tintColorDark = "#fff";

const primaryColor = "#3C0B0B"; // Primary color used across the app
const secondaryColor = "#C24E00"; // Secondary color for accents
const accentColor = "#FF6F00"; // Accent color for highlights

export const Colors = {
  light: {
    text: "#11181C", // Primary text color
    textSecondary: "#687076", // Secondary text color for less important info
    background: "#fff", // Background color
    backgroundSecondary: "#F3F4F6", // Secondary background color for cards, etc.
    cardBackground: "#EFF6FF", // Background color for cards
    tint: tintColorLight, // Tint color for selected items
    icon: "#687076", // Default icon color
    iconSelected: tintColorLight, // Color for selected icons
    tabIconDefault: "#687076", // Default color for unselected tab icons
    tabIconSelected: tintColorLight, // Color for selected tab icons
    primary: primaryColor, // Primary color for buttons, links, etc.
    secondary: secondaryColor, // Secondary color for other UI elements
    accent: accentColor, // Accent color for highlights
    border: "#E0E0E0", // Border color for cards, inputs, etc.
    shadow: "#00000029", // Shadow color for elevation effects
    warning: "#FFC107", // Warning color for alerts, etc.
    error: "#D32F2F", // Error color for errors and failures
    success: "#388E3C", // Success color for confirmations, etc.
  },
  dark: {
    text: "#ECEDEE", // Primary text color in dark mode
    textSecondary: "#9BA1A6", // Secondary text color in dark mode
    background: "#151718", // Background color in dark mode
    backgroundSecondary: "#1E1F20", // Secondary background in dark mode
    cardBackground: "#151718", // Background color for cards in dark mode
    tint: tintColorDark, // Tint color for selected items in dark mode
    icon: "#9BA1A6", // Default icon color in dark mode
    iconSelected: tintColorDark, // Color for selected icons in dark mode
    tabIconDefault: "#9BA1A6", // Default color for unselected tab icons in dark mode
    tabIconSelected: tintColorDark, // Color for selected tab icons in dark mode
    primary: primaryColor, // Primary color for dark mode
    secondary: secondaryColor, // Secondary color for dark mode
    accent: accentColor, // Accent color for dark mode
    border: "#3A3A3A", // Border color in dark mode
    shadow: "#00000050", // Shadow color in dark mode
    warning: "#FFC107", // Warning color in dark mode
    error: "#D32F2F", // Error color in dark mode
    success: "#388E3C", // Success color in dark mode
  },
};

export default Colors;
