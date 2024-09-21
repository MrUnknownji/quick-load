import Sizes from "@/constants/Sizes";
import { VehicleTypeProps } from "@/types/types";
import { Dimensions } from "react-native";
import { User } from "@/types/User";
import { Order } from "@/types/Order";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Dummy Users
export const USERS: User[] = [
  {
    id: "user1",
    email: "customer@example.com",
    name: "John Doe",
    username: "johndoe",
    type: "customer",
    language: "en",
    isPremium: false,
    gender: "male",
    countryCode: "+91",
    phone: "9876543210",
    timezone: 5.5,
    birthDate: "1990-01-01",
    panCard: "ABCDE1234F",
    aadharCard: "1234 5678 9012",
    city: "Mumbai",
    address: "123 Main St, Mumbai",
    isActivated: true,
    isVerified: true,
    deviceId: "device123",
    platform: "ios",
    deletedAt: null,
  },
  {
    id: "user2",
    email: "merchant@example.com",
    name: "Jane Smith",
    username: "janesmith",
    type: "merchant",
    language: "en",
    isPremium: true,
    gender: "female",
    countryCode: "+91",
    phone: "9876543211",
    timezone: 5.5,
    birthDate: "1985-05-15",
    panCard: "FGHIJ5678K",
    aadharCard: "2345 6789 0123",
    city: "Delhi",
    address: "456 Business Ave, Delhi",
    isActivated: true,
    isVerified: true,
    deviceId: "device456",
    platform: "android",
    deletedAt: null,
  },
  {
    id: "user3",
    email: "driver@example.com",
    name: "Mike Johnson",
    username: "mikejohnson",
    type: "driver",
    language: "en",
    isPremium: false,
    gender: "male",
    countryCode: "+91",
    phone: "9876543212",
    timezone: 5.5,
    birthDate: "1988-09-20",
    panCard: "LMNOP9012Q",
    aadharCard: "3456 7890 1234",
    city: "Bangalore",
    address: "789 Driver Lane, Bangalore",
    isActivated: true,
    isVerified: true,
    deviceId: "device789",
    platform: "android",
    deletedAt: null,
  },
  {
    id: "user4",
    email: "admin@example.com",
    name: "Admin User",
    username: "adminuser",
    type: "admin",
    language: "en",
    isPremium: true,
    gender: "other",
    countryCode: "+91",
    phone: "9876543213",
    timezone: 5.5,
    birthDate: "1980-12-31",
    panCard: "RSTUV3456W",
    aadharCard: "4567 8901 2345",
    city: "Chennai",
    address: "101 Admin Building, Chennai",
    isActivated: true,
    isVerified: true,
    deviceId: "device101",
    platform: "web",
    deletedAt: null,
  },
];

// Dummy Orders
export const ORDERS: Order[] = [
  // Customer Orders
  {
    id: "order1",
    userId: "user1",
    productName: "Bricks",
    quantity: 1000,
    price: 5000,
    status: "pending",
    createdAt: "2023-06-01",
  },
  {
    id: "order2",
    userId: "user1",
    productName: "Grit",
    quantity: 500,
    price: 2500,
    status: "pending",
    createdAt: "2023-06-05",
  },
  {
    id: "order3",
    userId: "user1",
    productName: "Cement",
    quantity: 100,
    price: 6000,
    status: "delivered",
    createdAt: "2023-05-15",
  },
  {
    id: "order4",
    userId: "user1",
    productName: "Sand",
    quantity: 200,
    price: 3000,
    status: "delivered",
    createdAt: "2023-05-20",
  },

  // Merchant Orders
  {
    id: "order5",
    userId: "user2",
    productName: "Steel",
    quantity: 50,
    price: 25000,
    status: "pending",
    createdAt: "2023-06-10",
  },
  {
    id: "order6",
    userId: "user2",
    productName: "Tiles",
    quantity: 1000,
    price: 10000,
    status: "pending",
    createdAt: "2023-06-12",
  },
  {
    id: "order7",
    userId: "user2",
    productName: "Paint",
    quantity: 100,
    price: 15000,
    status: "delivered",
    createdAt: "2023-05-25",
  },
  {
    id: "order8",
    userId: "user2",
    productName: "Wood",
    quantity: 200,
    price: 20000,
    status: "delivered",
    createdAt: "2023-05-30",
  },

  // Driver Orders
  {
    id: "order9",
    userId: "user3",
    productName: "Bricks",
    quantity: 2000,
    price: 10000,
    status: "pending",
    createdAt: "2023-06-15",
  },
  {
    id: "order10",
    userId: "user3",
    productName: "Cement",
    quantity: 150,
    price: 9000,
    status: "pending",
    createdAt: "2023-06-18",
  },
  {
    id: "order11",
    userId: "user3",
    productName: "Sand",
    quantity: 300,
    price: 4500,
    status: "delivered",
    createdAt: "2023-06-01",
  },
  {
    id: "order12",
    userId: "user3",
    productName: "Grit",
    quantity: 400,
    price: 2000,
    status: "delivered",
    createdAt: "2023-06-05",
  },

  // Admin Orders
  {
    id: "order13",
    userId: "user4",
    productName: "Steel",
    quantity: 100,
    price: 50000,
    status: "pending",
    createdAt: "2023-06-20",
  },
  {
    id: "order14",
    userId: "user4",
    productName: "Tiles",
    quantity: 2000,
    price: 20000,
    status: "pending",
    createdAt: "2023-06-22",
  },
  {
    id: "order15",
    userId: "user4",
    productName: "Paint",
    quantity: 200,
    price: 30000,
    status: "delivered",
    createdAt: "2023-06-10",
  },
  {
    id: "order16",
    userId: "user4",
    productName: "Wood",
    quantity: 300,
    price: 30000,
    status: "delivered",
    createdAt: "2023-06-12",
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
  "Cheapest price",
  "Secure delivery",
];

const VEHICLES_LIST: VehicleTypeProps[] = [
  {
    id: "vehicle234",
    phone: "+91 9876543210",
    vehicleType: "Truck",
    vehicleNumber: "RJ 12 K 0005",
    vehicleCapacity: "20-25tn",
    brand: "Tata",
    model: "X",
    year: 2020,
    image: "https://placehold.co/200x200?text=Truck",
    drivingLicense: undefined,
    vehicleRC: undefined,
    panCardFile: undefined,
    aadhaarCardFile: undefined,
  },
  {
    id: "vehicle78923",
    phone: "+91 9876543210",
    vehicleType: "Dumper",
    vehicleNumber: "PB 32 E 2002",
    vehicleCapacity: "20-25tn",
    brand: "Mahindra",
    model: "X",
    year: 2018,
    image: "https://placehold.co/200x200?text=Dumper",
    drivingLicense: undefined,
    vehicleRC: undefined,
    panCardFile: undefined,
    aadhaarCardFile: undefined,
  },
  {
    id: "vehicle378",
    phone: "+91 9876543210",
    vehicleType: "Trailer",
    vehicleNumber: "HR 58 M 1001",
    vehicleCapacity: "20-25tn",
    brand: "Mahindra",
    model: "X",
    year: 2023,
    image: "https://placehold.co/200x200?text=Trailer",
    drivingLicense: undefined,
    vehicleRC: undefined,
    panCardFile: undefined,
    aadhaarCardFile: undefined,
  },
];

export { CAROUSEL_IMAGES, FEATURES, VEHICLES_LIST };
