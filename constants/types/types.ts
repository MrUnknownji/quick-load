interface Category {
  name: string;
  url: string;
}

interface ListItemProps {
  heading?: string;
  price?: number;
  location?: string;
  rating?: number;
  mesurementType?: "qui" | "piece" | "packet";
}

export { Category, ListItemProps };
