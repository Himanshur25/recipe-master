import type { IUserPayload } from "../types/auth";
import { apiLinks, axiosPrivate } from "./api.config";

export const createNewUser = async (payload: IUserPayload) => {
  const response = await axiosPrivate.post(`${apiLinks.baseUrl}/auth/register`, payload);
  return response.data;
};

export const loginUser = async (payload: IUserPayload) => {
  const response = await axiosPrivate.post(`${apiLinks.baseUrl}/auth/login`, payload);
  return response.data;
};
