import { api } from '.';
import { RadioResponse, RadioTrackResponse } from './dtos';

export const get = (roomName: string) => {
  return api.request.get<RadioResponse>(`/radios/${roomName}`);
};

export const getTracks = (roomName: string) => {
  return api.request.get<RadioTrackResponse[]>(`/radios/${roomName}/tracks`);
};
