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
