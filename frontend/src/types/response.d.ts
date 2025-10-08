export interface ErrorResponse {
  statusCode: number;
  message: string;
  errorField: string | null | undefined;
  messages: string[];
  timestamp: string;
  path: string;
}
export interface SuccessResponse {
  statusCode: number;
  message: string;
  data?: any;
}
