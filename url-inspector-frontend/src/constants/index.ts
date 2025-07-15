import { API_URL, AUTH_ENDPOINTS, URL_ENDPOINTS } from "./endpoints";

export type {
  AuthEndpoints,
  UrlEndpoints,
} from "./endpoints";

export const API = {
  baseUrl: API_URL,
  auth: AUTH_ENDPOINTS,
  url: URL_ENDPOINTS,
} as const;