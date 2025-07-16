import type { ApiResponse } from "../types/common";

export interface Url {
  id: number;
  url: string;
  status: string;
  page_title?: string;
  html_version?: string;
  h1_count: number;
  h2_count: number;
  h3_count: number;
  h4_count: number;
  h5_count: number;
  h6_count: number;
  internal_links_count: number;
  external_links_count: number;
  broken_links_count: number;
  broken_links_list?: Array<{ url: string; status: string }>;
}

export interface GetOrdersResponse extends ApiResponse {
  data: Url[]
}
