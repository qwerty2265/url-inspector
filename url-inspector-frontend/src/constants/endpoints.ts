export const API_URL = import.meta.env.VITE_BASE_URL

export const AUTH_ENDPOINTS = {
  LOGIN: `${API_URL}/auth/login`,
  REGISTER: `${API_URL}/auth/register`,
  LOGOUT: `${API_URL}/auth/logout`,
  CHECK_AUTH: `${API_URL}/auth/check`,
} as const

export const URL_ENDPOINTS = {
  ANALYZE: `${API_URL}/url/analyze`,
  GET_ALL: `${API_URL}/url/all`,
  GET_URL: (id: number) => `${API_URL}/url/${id}`,
  STOP_ANALYSIS: (id: number) => `${API_URL}/url/stop/${id}`,
  RESUME_ANALYSIS: (id: number) => `${API_URL}/url/resume/${id}`,
  DELETE_URL: (id: number) => `${API_URL}/url/delete/${id}`,
} as const;

export type AuthEndpoints = typeof AUTH_ENDPOINTS;
export type UrlEndpoints = typeof URL_ENDPOINTS;
