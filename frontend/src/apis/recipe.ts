import type { IRecipeResponse } from "../types/recipe";
import { apiLinks, axiosPrivate } from "./api.config";

export const getRecipe = async (): Promise<IRecipeResponse> => {
  const accessToken = localStorage.getItem("token");
  const response = await axiosPrivate.get(`${apiLinks.baseUrl}/recipes`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

export const createRecipe = async (payload: FormData) => {
  const accessToken = localStorage.getItem("token");
  const response = await axiosPrivate.post(`${apiLinks.baseUrl}/recipes`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};
