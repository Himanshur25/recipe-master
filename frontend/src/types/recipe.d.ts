export interface IRecipeResponse {
  recipes: Recipe[];
  page: number;
  limit: number;
  total: number;
}

export interface Recipe {
  recipe_id: number;
  title: string;
  instruction: string;
  ingredient: string;
  image: string;
  category: "veg" | "non-veg";
  reaction: "like" | "dislike" | null;
}
export interface IRecipeReactionPayload {
  recipeId: number;
  reaction: "like" | "dislike";
}
