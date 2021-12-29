import { api } from '.';
import { CreateDigestRequest, DigestResponse } from './dtos';

export const create = (payload: CreateDigestRequest) => {
  return api.request.post<DigestResponse>('/digests', payload);
};
