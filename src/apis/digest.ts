import { api } from '.';
import {
  CreateDigestRequest,
  DigestResponse,
  DigestTrackResponse,
  PageRequest,
  PageResponse,
} from './dtos';

export const create = (params: CreateDigestRequest) => {
  return api.request.post<DigestResponse>('/digests', params);
};

export const get = (id: string) => {
  return api.request.get<DigestResponse>(`/digests/${id}`);
};

export const getMany = (params: PageRequest) => {
  return api.request.get<PageResponse<DigestResponse>>('/digests', {
    params: params,
  });
};

export const getTracks = (id: string) => {
  return api.request.get<DigestTrackResponse[]>(`/digests/${id}/tracks`);
};
