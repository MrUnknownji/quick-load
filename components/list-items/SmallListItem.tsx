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
}

const SmallListItem = ({
  iconName,
  onPress,
  title,
  description,
  style,
}: SmallListItemProps) => {
  return (
    <Pressable onPress={onPress} style={[styles.container, style]}>
      {iconName && (
        <IconButton
          iconName={iconName ?? "chevron-back"}
          size="small"
          variant="transparent"
          iconStyle={{ color: Colors.light.primary }}
        />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
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
