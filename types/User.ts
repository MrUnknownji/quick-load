export interface User {
  _id?: string | null;
  id?: string;
  email: string;
  firstName: string;
  lastName?: string;
  username: string;
  type: "merchant-driver" | "admin" | "driver" | "merchant" | "customer";
  language: string;
  isPremium: boolean;
  gender: "male" | "female" | "other";
  countryCode: string;
  phone: string;
  timezone: number;
  birthDate: string;
  panCard: string;
  aadharCard: string;
  city: string;
  address: string;
  isActivated: boolean;
  isVerified: boolean;
  deviceId: string;
  platform: "android" | "ios";
  deletedAt: string | null;
  productOwnerId?: string | null;
  location?: string | null;
}

export interface UserEdit {
  name?: string;
  username?: string;
  language?: string;
  gender?: "male" | "female" | "other";
  birthDate?: string;
  image?: File;
}
