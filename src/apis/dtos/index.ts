import { TrackSourceProvider } from '../../types';

export interface PageRequest {
  page?: number;
  size?: number;
}

export interface PageResponse<T> {
  data: T[];
  total: number;
  size: number;
  page: number;
}

export interface CreateDigestRequest {
  title: string;
  description?: string;
  from: Date;
  to: Date;
}

export interface DigestResponse {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrackResponse {
  id: string;
  sourceProvider: TrackSourceProvider;
  sourceUrl: string;
  position: number;
  title: string;
  body?: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface DigestTrackResponse extends TrackResponse {
  digestId: string;
}

export interface CurrentTrack {
  id: string;
  startedAt: string;
  duration: number;
}

export interface RadioResponse {
  id: string;
  roomName: string;
  title: string;
  description?: string;
  currentTrack?: CurrentTrack;
  createdAt: string;
  updatedAt: string;
}

export interface RadioTrackResponse extends TrackResponse {
  radioId: string;
}
