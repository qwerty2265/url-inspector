import { API } from "../../constants";
import type { ApiResponse, ApiResult } from "../types/common";

export const urlApi = {
  async getAllUrls(): Promise<ApiResult<ApiResponse>> {
    const response = await fetch(API.url.GET_ALL, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
    });

    const data = await response.json();

    return { response, data };
  },

  async analyzeUrl(url: string): Promise<ApiResult<ApiResponse>>  {
    const payload = JSON.stringify({
      url: url.replace(/\s/g, ""),
    });

    const response = await fetch(API.url.ANALYZE, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: payload
    });

    const data = await response.json();
    return { response, data };
  },

  async stopAnalysis(id: number): Promise<ApiResult<ApiResponse>> {
    const response = await fetch(API.url.STOP_ANALYSIS(id), {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
    });
    const data = await response.json();
    return { response, data };
  },

  async resumeAnalysis(id: number): Promise<ApiResult<ApiResponse>> {
    const response = await fetch(API.url.RESUME_ANALYSIS(id), {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
    });
    const data = await response.json();
    return { response, data };
  },

  async deleteUrl(id: number): Promise<ApiResult<ApiResponse>> {
    const response = await fetch(API.url.DELETE_URL(id), {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
    });
    const data = await response.json();
    return { response, data };
  }
}