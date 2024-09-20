export interface RouteData {
  userType: string;
  from: string;
  to: string;
  vehicle: string;
  selfVehicleId?: string;
}

export interface UserInfo {
  name: string;
  email: string;
}

export interface Driver {
  userId: UserInfo;
  from: string;
  to: string;
  selfVehicle: string;
}

export interface Merchant {
  userId: UserInfo;
  from: string;
  to: string;
  vehicle: string;
}
