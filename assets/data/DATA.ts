import Sizes from "@/constants/Sizes";
import { Category, ListItemProps } from "@/constants/types/types";
import { Dimensions } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const CATEGORIES: Category[] = [
  { name: "Bricks", url: "https://placehold.co/200x200?text=Bricks" },
  { name: "Bajri", url: "https://placehold.co/200x200?text=Bajri" },
  { name: "Grit", url: "https://placehold.co/200x200?text=Grit" },
  { name: "Cement", url: "https://placehold.co/200x200?text=Cement" },
  { name: "Sand", url: "https://placehold.co/200x200?text=Sand" },
];

const BRICKS_ITEMS: ListItemProps[] = [
  {
    productId: "product_bricks_243",
    heading: "1 Number",
    productDescription:
      "1 Number bricks are of high quality and are used for making bricks, walls, and other building materials. They are also used in the construction of the roof of a house. The bricks are made of clay and are available in different sizes.",
    price: 5,
    location: "Suratgarh, India",
    imageUrl: `https://placehold.co/${
      screenWidth - Sizes.marginHorizontal * 2
    }x${200}?text=1+Number`,
    rating: 4.8,
  },
  {
    productId: "product_bricks_633",
    heading: "2 Numbers",
    productDescription:
      "2 Numbers bricks are of high quality and are used for making bricks, walls, and other building materials. They are also used in the construction of the roof of a house. The bricks are made of clay and are available in different sizes.",
    price: 10,
    location: "Indore, India",
    imageUrl: `https://placehold.co/${
      screenWidth - Sizes.marginHorizontal * 2
    }x${200}?text=2+Number`,
    rating: 3.2,
  },
  {
    productId: "product_bricks_256",
    heading: "3 Numbers",
    productDescription:
      "3 Numbers bricks are of high quality and are used for making bricks, walls, and other building materials. They are also used in the construction of the roof of a house. The bricks are made of clay and are available in different sizes.",
    price: 15,
    location: "Gujarat, India",
    imageUrl: `https://placehold.co/${
      screenWidth - Sizes.marginHorizontal * 2
    }x${200}?text=3+Number`,
    rating: 4.4,
  },
];

const BAJRI_ITEMS: ListItemProps[] = [
  {
    productId: "product_bajri_725",
    heading: "20mm",
    productDescription:
      "20mm Bajri is a type of bajri that is used in construction and architecture. It is a popular material for making furniture, flooring, and other building materials. It is also used in the construction of the roof of a house. ",
    price: 20,
    location: "Jaipur, India",
    imageUrl: `https://placehold.co/${
      screenWidth - Sizes.marginHorizontal * 2
    }x${200}?text=20mm+Bajri`,
    rating: 4.5,
  },
  {
    productId: "product_bajri_752",
    heading: "10mm",
    productDescription:
      "10mm Bajri is a type of bajri that is used in construction and architecture. It is a popular material for making furniture, flooring, and other building materials. It is also used in the construction of the roof of a house. ",
    price: 40,
    location: "Jodhpur, India",
    imageUrl: `https://placehold.co/${
      screenWidth - Sizes.marginHorizontal * 2
    }x${200}?text=10mm+Bajri`,
    rating: 4.8,
  },
];

const GRIT_ITEMS: ListItemProps[] = [
  {
    productId: "product_grit_263",
    heading: "10mm",
    productDescription:
      "10mm Grit is a type of grit that is used in construction and architecture. It is a popular material for making furniture, flooring, and other building materials. It is also used in the construction of the roof of a house. ",
    price: 50,
    location: "Surat, India",
    imageUrl: `https://placehold.co/${
      screenWidth - Sizes.marginHorizontal * 2
    }x${200}?text=10mm+Grit`,
    rating: 4.3,
  },
  {
    productId: "product_grit_564",
    heading: "20mm",
    productDescription:
      "20mm Grit is a type of grit that is used in construction and architecture. It is a popular material for making furniture, flooring, and other building materials. It is also used in the construction of the roof of a house. ",
    price: 60,
    location: "Indore, India",
    imageUrl: `https://placehold.co/${
      screenWidth - Sizes.marginHorizontal * 2
    }x${200}?text=20mm+Grit`,
    rating: 4.1,
  },
  {
    productId: "product_grit_874",
    heading: "30mm",
    productDescription:
      "30mm Grit is a type of grit that is used in construction and architecture. It is a popular material for making furniture, flooring, and other building materials. It is also used in the construction of the roof of a house. ",
    price: 70,
    location: "Gujarat, India",
    imageUrl: `https://placehold.co/${
      screenWidth - Sizes.marginHorizontal * 2
    }x${200}?text=30mm+Grit`,
    rating: 4.2,
  },
  {
    productId: "product_grit_784",
    heading: "40mm",
    productDescription:
      "40mm Grit is a type of grit that is used in construction and architecture. It is a popular material for making furniture, flooring, and other building materials. It is also used in the construction of the roof of a house. ",
    price: 80,
    location: "Surat, India",
    imageUrl: `https://placehold.co/${
      screenWidth - Sizes.marginHorizontal * 2
    }x${200}?text=40mm+Grit`,
    rating: 4.3,
  },
  {
    productId: "product_grit_874",
    heading: "50mm",
    productDescription:
      "50mm Grit is a type of grit that is used in construction and architecture. It is a popular material for making furniture, flooring, and other building materials. It is also used in the construction of the roof of a house. ",
    price: 90,
    location: "Indore, India",
    imageUrl: `https://placehold.co/${
      screenWidth - Sizes.marginHorizontal * 2
    }x${200}?text=50mm+Grit`,
    rating: 4.1,
  },
];

const CEMENT_ITEMS: ListItemProps[] = [
  {
    productId: "product_cement_232",
    heading: "UltraTech",
    productDescription:
      "UltraTech Cement is a type of cement that is used in construction and architecture. It is a popular material for making furniture, flooring, and other building materials. It is also used in the construction of the roof of a house. ",
    price: 380,
    location: "Jaipur, India",
    imageUrl: `https://placehold.co/${
      screenWidth - Sizes.marginHorizontal * 2
    }x${200}?text=UltraTech+Cement`,
    rating: 4.3,
  },
  {
    productId: "product_cement_653",
    heading: "Bangar",
    productDescription:
      "Bangar Cement is a type of cement that is used in construction and architecture. It is a popular material for making furniture, flooring, and other building materials. It is also used in the construction of the roof of a house. ",
    price: 480,
    location: "Surat, India",
    imageUrl: `https://placehold.co/${
      screenWidth - Sizes.marginHorizontal * 2
    }x${200}?text=Bangar+Cement`,
    rating: 4.6,
  },
  {
    productId: "product_cement_562",
    heading: "Bangar",
    productDescription:
      "Bangar Cement is a type of cement that is used in construction and architecture. It is a popular material for making furniture, flooring, and other building materials. It is also used in the construction of the roof of a house. ",
    price: 345,
    location: "Indore, India",
    imageUrl: `https://placehold.co/${
      screenWidth - Sizes.marginHorizontal * 2
    }x${200}?text=Bangar+Cement`,
    rating: 4.2,
  },
  {
    productId: "product_cement_886",
    heading: "Bangar",
    productDescription:
      "Bangar Cement is a type of cement that is used in construction and architecture. It is a popular material for making furniture, flooring, and other building materials. It is also used in the construction of the roof of a house. ",
    price: 550,
    location: "Gujarat, India",
    imageUrl: `https://placehold.co/${
      screenWidth - Sizes.marginHorizontal * 2
    }x${200}?text=Bangar+Cement`,
    rating: 5.0,
  },
];

const SAND_ITEMS: ListItemProps[] = [
  {
    productId: "product_sand_254",
    heading: "2mm",
    productDescription:
      "2mm Sand is a type of sand that is used in construction and architecture. It is a popular material for making furniture, flooring, and other building materials. It is also used in the construction of the roof of a house. ",
    price: 50,
    location: "Surat, India",
    imageUrl: `https://placehold.co/${
      screenWidth - Sizes.marginHorizontal * 2
    }x${200}?text=10mm+Sand`,
    rating: 4.3,
  },
  {
    productId: "product_sand_763",
    heading: "1mm",
    productDescription:
      "1mm Sand is a type of sand that is used in construction and architecture. It is a popular material for making furniture, flooring, and other building materials. It is also used in the construction of the roof of a house. ",
    price: 50,
    location: "Indore, India",
    imageUrl: `https://placehold.co/${
      screenWidth - Sizes.marginHorizontal * 2
    }x${200}?text=20mm+Sand`,
    rating: 4.1,
  },
  {
    productId: "product_sand_896",
    heading: "3mm",
    productDescription:
      "3mm Sand is a type of sand that is used in construction and architecture. It is a popular material for making furniture, flooring, and other building materials. It is also used in the construction of the roof of a house. ",
    price: 50,
    location: "Gujarat, India",
    imageUrl: `https://placehold.co/${
      screenWidth - Sizes.marginHorizontal * 2
    }x${200}?text=30mm+Sand`,
    rating: 4.2,
  },
  {
    productId: "product_sand_134",
    heading: "4mm",
    productDescription:
      "4mm Sand is a type of sand that is used in construction and architecture. It is a popular material for making furniture, flooring, and other building materials. It is also used in the construction of the roof of a house. ",
    price: 50,
    location: "Surat, India",
    imageUrl: `https://placehold.co/${
      screenWidth - Sizes.marginHorizontal * 2
    }x${200}?text=40mm+Sand`,
    rating: 4.3,
  },
  {
    productId: "product_sand_889",
    heading: "5mm",
    productDescription:
      "5mm Sand is a type of sand that is used in construction and architecture. It is a popular material for making furniture, flooring, and other building materials. It is also used in the construction of the roof of a house. ",
    price: 50,
    location: "Indore, India",
    imageUrl: `https://placehold.co/${
      screenWidth - Sizes.marginHorizontal * 2
    }x${200}?text=50mm+Sand`,
    rating: 4.1,
  },
];

const CAROUSEL_IMAGES = [
  {
    uri: `https://placehold.co/${
      screenWidth - Sizes.marginHorizontal * 2
    }x${200}?text=Hero+Image+1`,
  },
  {
    uri: `https://placehold.co/${
      screenWidth - Sizes.marginHorizontal * 2
    }x${200}?text=Hero+Image+2`,
  },
  {
    uri: `https://placehold.co/${
      screenWidth - Sizes.marginHorizontal * 2
    }x${200}?text=Hero+Image+3`,
  },
  {
    uri: `https://placehold.co/${
      screenWidth - Sizes.marginHorizontal * 2
    }x${200}?text=Hero+Image+4`,
  },
];

const FEATURES: string[] = [
  "100% quality and pure guarantee",
  "Quantity guarantee",
  "Cheepest price",
  "Secure delivery",
];

export {
  CATEGORIES,
  BRICKS_ITEMS,
  BAJRI_ITEMS,
  GRIT_ITEMS,
  CEMENT_ITEMS,
  SAND_ITEMS,
  CAROUSEL_IMAGES,
  FEATURES,
};
