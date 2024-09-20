import { Pressable, StyleSheet, Text, View } from "react-native";
import IconButton from "../button/IconButton";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Sizes from "@/constants/Sizes";
import Colors from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "../ThemedText";

interface SmallListItemProps {
  title: string;
  iconName?:
    | keyof typeof Ionicons.glyphMap
    | keyof typeof MaterialIcons.glyphMap
    | keyof typeof FontAwesome.glyphMap
    | keyof typeof MaterialCommunityIcons.glyphMap;
  onPress?: () => void;
  description?: string;
  style?: any;
  iconType?:
    | "Ionicons"
    | "MaterialIcons"
    | "FontAwesome"
    | "MaterialCommunityIcons";
}

const SmallListItem = ({
  iconName,
  onPress,
  title,
  description,
  style,
  iconType,
}: SmallListItemProps) => {
  const iconColor = useThemeColor(
    { light: Colors.light.primary, dark: Colors.dark.secondary },
    "primary"
  );
  return (
    <Pressable onPress={onPress} style={[styles.container, style]}>
      {iconName && (
        <IconButton
          iconName={iconName ?? "chevron-back"}
          size="small"
          variant="transparent"
          iconStyle={{ color: iconColor }}
          iconLibrary={iconType ?? "Ionicons"}
        />
      )}
      <View style={styles.textContainer}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        {description && (
          <ThemedText style={styles.description}>{description}</ThemedText>
        )}
      </View>
    </Pressable>
  );
};

export default SmallListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Sizes.marginSmall,
    paddingVertical: Sizes.paddingSmall,
    paddingHorizontal: Sizes.paddingMedium,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.light.border,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: Sizes.textMedium,
    fontWeight: "bold",
  },
  description: {
    fontSize: Sizes.textSmall,
  },
});
