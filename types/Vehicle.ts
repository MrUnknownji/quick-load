export interface Vehicle {
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
  drivingLicence?: string | File;
  rc?: string | File;
  panCard?: string | File;
  aadharCard?: string | File;
}
