export interface Route {
  from: string;
  to: string;
  vehicle?: string;
  selfVehicleId?: string;
}

export interface Driver {
  userId: {
    name: string;
    email: string;
  };
  from: string;
  to: string;
  selfVehicle: string;
}

export interface Merchant {
  userId: {
    name: string;
    email: string;
  };
  from: string;
  to: string;
  vehicle: string;
}

export interface ApiResponse<T> {
  resultMessage: {
    en: string;
    tr: string;
  };
  resultCode: string;
  data: T;
}
