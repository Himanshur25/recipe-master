import { useMutation, useQuery } from "@tanstack/react-query";
import type { ErrorResponse } from "../types/response";
import type { AxiosError } from "axios";
import { createRecipe, getRecipe } from "../apis/recipe";
import type { IRecipeResponse } from "../types/recipe";

export function useGetRecipes() {
  return useQuery<IRecipeResponse, AxiosError<ErrorResponse>>({
    queryKey: ["getRecipe"],
    queryFn: async () => await getRecipe(),
  });
}

export function useCreateRecipe() {
  return useMutation<IRecipeResponse, AxiosError<ErrorResponse>, FormData>({
    mutationFn: async (payload: FormData) => await createRecipe(payload),
  });
}
