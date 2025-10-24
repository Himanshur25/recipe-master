import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import type { ErrorResponse } from "../types/response";
import type { AxiosError } from "axios";
import { createRecipe, getRecipe } from "../apis/recipe";
import type { IRecipeResponse } from "../types/recipe";

export function useGetRecipes() {
  return useInfiniteQuery<IRecipeResponse, AxiosError<ErrorResponse>>({
    queryKey: ["recipes"],
    initialPageParam: 1,

    queryFn: async ({ pageParam = 1 }) => {
      return await getRecipe(pageParam as number);
    },

    getNextPageParam: (lastPage) => {
      const { page, limit, total } = lastPage;
      const totalPages = Math.ceil(total / limit);
      return page < totalPages ? page + 1 : undefined;
    },

    refetchOnWindowFocus: false,
  });
}

export function useCreateRecipe() {
  return useMutation<IRecipeResponse, AxiosError<ErrorResponse>, FormData>({
    mutationFn: async (payload: FormData) => await createRecipe(payload),
  });
}
