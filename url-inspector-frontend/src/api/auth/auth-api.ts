import { API } from "../../constants";
import type { ApiResponse, ApiResult } from "../types/common";

export const authApi = {
  async login(email: string, password: string): Promise<ApiResult<ApiResponse>> {
    const payload = JSON.stringify({
      email: email.replace(/\s/g, ""),
      password: password.replace(/\s/g, "")
    }); 

    const response = await fetch(API.auth.LOGIN, {
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

  async register(name: string, surname: string, email: string, password: string): Promise<ApiResult<ApiResponse>>  {
    const payload = JSON.stringify({
      name: name.replace(/\s/g, ""),
      surname: surname.replace(/\s/g, ""),
      email: email.replace(/\s/g, ""),
      password: password.replace(/\s/g, "")
    });

    const response = await fetch(API.auth.REGISTER, {
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

  async logout(): Promise<ApiResult<ApiResponse>> {
    const response = await fetch(API.auth.LOGOUT, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    return { response, data };
  },

  async checkAuth(): Promise<ApiResult<ApiResponse>> {
    const response = await fetch(API.auth.CHECK_AUTH, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    return { response, data };
  }
}