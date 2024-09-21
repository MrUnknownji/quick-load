export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  type: string;
  language: string;
  isPremium: boolean;
  gender: string;
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
  platform: string;
  deletedAt: string | null;
}

export interface UserRegistration {
  email: string;
  password: string;
  name: string;
  language: string;
  platform: string;
  timezone: number;
  deviceId: string;
  phone: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserEdit {
  name?: string;
  username?: string;
  language?: string;
  gender?: string;
  birthDate?: string;
  image?: File;
}
