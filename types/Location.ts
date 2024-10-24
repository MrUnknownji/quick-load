export interface Location {
  userId: string;
  latitude: number;
  longitude: number;
  formattedAddress?: string;
}

export interface LocationUpdate {
  latitude: number;
  longitude: number;
}

export interface ApiResponse<T> {
  resultMessage: {
    en: string;
    tr: string;
  };
  resultCode: string;
  data: T;
}

export interface CitiesResponse {
  resultMessage: {
    en: string;
    hi: string;
  };
  resultCode: string;
  cities: string[];
}
