import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

interface Category {
  name: string;
  url: string;
}

interface ListItemProps {
  productId: string;
  heading: string;
  productDescription: string;
  price?: number;
  location?: string;
  imageUrl: string;
  rating?: number;
  mesurementType?:
    | "Qui."
    | "Piece"
    | "Packet"
    | "क्विंटल"
    | "टुकड़ा"
    | "पैकेट"
    | string;
  onPress?: () => void;
  buttonTitle?: string;
}

type IconTypeProp =
  | keyof typeof Ionicons.glyphMap
  | keyof typeof MaterialIcons.glyphMap
  | keyof typeof FontAwesome.glyphMap
  | keyof typeof MaterialCommunityIcons.glyphMap;

type IoniconsIconProps = keyof typeof Ionicons.glyphMap;

export { Category, ListItemProps, IconTypeProp, IoniconsIconProps };
