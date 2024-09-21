import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { ViewStyle } from "react-native";

interface ListItemProps {
  productId?: string;
  heading: string;
  productDescription?: string;
  price?: string;
  location?: string;
  imageUrl: string;
  rating?: number;
  measurementType?:
    | "Qui."
    | "Piece"
    | "Packet"
    | "क्विंटल"
    | "टुकड़ा"
    | "पैकेट"
    | string;
  onPress?: () => void;
  buttonTitle?: string;
  style?: ViewStyle | ViewStyle[];
}

type CustomFile = {
  uri: string;
  name: string;
  size?: number;
  type: string;
};

interface VehicleTypeProps {
  id: string;
  vehicleType: string;
  vehicleNumber: string;
  vehicleCapacity: string;
  brand?: string;
  model?: string;
  year?: number;
  image: string;
  phone: string;
  drivingLicense: CustomFile | undefined;
  vehicleRC: CustomFile | undefined;
  panCardFile: CustomFile | undefined;
  aadhaarCardFile: CustomFile | undefined;
}

type IconTypeProp =
  | keyof typeof Ionicons.glyphMap
  | keyof typeof MaterialIcons.glyphMap
  | keyof typeof FontAwesome.glyphMap
  | keyof typeof MaterialCommunityIcons.glyphMap;

type IoniconsIconProps = keyof typeof Ionicons.glyphMap;

export {
  ListItemProps,
  IconTypeProp,
  IoniconsIconProps,
  VehicleTypeProps,
  CustomFile,
};
