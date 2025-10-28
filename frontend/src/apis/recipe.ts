import type { IRecipeReactionPayload, IRecipeResponse, Recipe } from "../types/recipe";
import { apiLinks, axiosPrivate } from "./api.config";

export const getRecipe = async (page: number = 1): Promise<IRecipeResponse> => {
  const accessToken = localStorage.getItem("token");
  const response = await axiosPrivate.get(`${apiLinks.baseUrl}/recipes`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: { page },
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

export const createReactionOnRecipe = async (payload: IRecipeReactionPayload) => {
  const accessToken = localStorage.getItem("token");
  const response = await axiosPrivate.patch(
    `${apiLinks.baseUrl}/recipes/${payload.recipeId}/reactions`,
    { reaction: payload.reaction },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};
export const getRecipeById = async (recipeId: number): Promise<Recipe> => {
  const accessToken = localStorage.getItem("token");
  const response = await axiosPrivate.get(`${apiLinks.baseUrl}/recipes/${recipeId}`, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.recipe;
};
