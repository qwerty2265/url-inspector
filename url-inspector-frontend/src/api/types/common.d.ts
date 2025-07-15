export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface ApiResult<T extends ApiResponse> {
  response: Response;
  data: T;
} 