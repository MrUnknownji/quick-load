import {
  addLocation,
  fetchLocation,
  getCitiesByState,
  updateLocation,
} from "../api/locationApi";
import {
  Location,
  LocationUpdate,
  ApiResponse,
  CitiesResponse,
} from "../types/Location";

export const createNewLocation = async (
  locationData: Location,
): Promise<ApiResponse<string>> => {
  return await addLocation(locationData);
};

export const getLocation = async (
  userId: string,
): Promise<ApiResponse<Location>> => {
  return await fetchLocation(userId);
};

export const updateUserLocation = async (
  userId: string,
  locationUpdate: LocationUpdate,
): Promise<ApiResponse<Location>> => {
  return await updateLocation(userId, locationUpdate);
};

export const getStateCities = async (
  state: string,
): Promise<CitiesResponse> => {
  return await getCitiesByState(state);
};
