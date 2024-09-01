import { Category } from "@/constants/types/types";

const CATEGORIES: Category[] = [
  { name: "Bricks", url: "https://placehold.co/200x200?text=Bricks" },
  { name: "Bajri", url: "https://placehold.co/200x200?text=Bajri" },
  { name: "Grit", url: "https://placehold.co/200x200?text=Grit" },
  { name: "Cement", url: "https://placehold.co/200x200?text=Cement" },
  { name: "Sand", url: "https://placehold.co/200x200?text=Sand" },
];

const BRICK_ITEMS = [
  { heading: "1 Number", price: 5, location: "Suratgarh, India", rating: 4.8 },
  { heading: "2 Numbers", price: 10, location: "Indore, India", rating: 3.2 },
  { heading: "3 Numbers", price: 15, location: "Gujarat, India", rating: 4.4 },
];

const BAJRI_ITEMS = [
  { heading: "Bajri", price: 40, location: "Jaipur, India", rating: 4.8 },
  { heading: "Bajri", price: 40, location: "Jaipur, India", rating: 4.8 },
];

const GRIT_ITEMS = [
  { heading: "10mm", price: 50, location: "Surat, India", rating: 4.3 },
  { heading: "20mm", price: 50, location: "Indore, India", rating: 4.1 },
  { heading: "30mm", price: 50, location: "Gujarat, India", rating: 4.2 },
  { heading: "40mm", price: 50, location: "Surat, India", rating: 4.3 },
  { heading: "50mm", price: 50, location: "Indore, India", rating: 4.1 },
];

const CEMENT_ITEMS = [
  { heading: "UltraTech", price: 380, location: "Jaipur, India", rating: 4.3 },
  { heading: "Bangar", price: 480, location: "Surat, India", rating: 4.6 },
  { heading: "Bangar", price: 480, location: "Indore, India", rating: 4.6 },
  { heading: "Bangar", price: 480, location: "Gujarat, India", rating: 4.6 },
];

const SAND_ITEMS = [
  { heading: "10mm", price: 50, location: "Surat, India", rating: 4.3 },
  { heading: "20mm", price: 50, location: "Indore, India", rating: 4.1 },
  { heading: "30mm", price: 50, location: "Gujarat, India", rating: 4.2 },
  { heading: "40mm", price: 50, location: "Surat, India", rating: 4.3 },
  { heading: "50mm", price: 50, location: "Indore, India", rating: 4.1 },
];

export {
  CATEGORIES,
  BRICK_ITEMS,
  BAJRI_ITEMS,
  GRIT_ITEMS,
  CEMENT_ITEMS,
  SAND_ITEMS,
};
