export interface Vehicle {
  _id?: string | null;
  vehicleId: string;
  userId: string;
  driverName: string;
  phoneNumber: string;
  vehicleNumber: string;
  vehicleType: string;
  drivingLicence: string;
  rc: string;
  panCard: string;
  aadharCard: string;
  vehicleImage?: string;
  isVerified?: boolean;
}

export interface NewVehicle {
  driverName: string;
  phoneNumber: string;
  vehicleNumber: string;
  vehicleType: string;
  drivingLicence: File;
  rc: File;
  panCard: File;
  aadharCard: File;
}

export interface UpdateVehicle {
  driverName?: string;
  phoneNumber?: string;
  vehicleNumber?: string;
  vehicleType?: string;
  drivingLicence?: File;
  rc?: File;
  panCard?: File;
  aadharCard?: File;
}

export interface VehicleType {
  id: number;
  type: string;
}

export interface ApiResponse<T> {
  resultMessage: {
    en: string;
    tr?: string;
    hi?: string;
  };
  resultCode: string;
  [key: string]: any;
}

export interface VehicleFormState {
  driverName?: string;
  phoneNumber?: string;
  vehicleNumber?: string;
  vehicleType?: string;
  drivingLicence?: string | { uri: string; mimeType?: string; name?: string };
  rc?: string | { uri: string; mimeType?: string; name?: string };
  panCard?: string | { uri: string; mimeType?: string; name?: string };
  aadharCard?: string | { uri: string; mimeType?: string; name?: string };
}
