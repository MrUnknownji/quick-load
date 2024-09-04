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
  mesurementType?: "qui" | "piece" | "packet";
  onPress?: () => void;
}

export { Category, ListItemProps };
