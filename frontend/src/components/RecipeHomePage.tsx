import React from "react";

import { ThumbsUp, ThumbsDown, MessageSquare, Trash2 } from "lucide-react";
import { Button } from "./common/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./common/card";
import {
  useGetRecipes,
  useSubmitRecipeReaction,
  useDeleteRecipe,
} from "../queryHooks/recipe.query";
import Navbar from "./Navbar";
import InfiniteScroll from "./hooks/InfiniteScroll";
import { Loader } from "./common/spinner";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const RecipeHomePage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data, isFetching, hasNextPage, isFetchingNextPage, isRefetching, fetchNextPage } =
    useGetRecipes();

  const recipes = data?.pages.flatMap((page) => page.recipes) ?? [];

  const { mutateAsync: mutateSubmitRecipeReaction, isPending: isLoadingRecipeReaction } =
    useSubmitRecipeReaction();

  const { mutateAsync: mutateDeleteRecipe, isPending: isDeletingRecipe } = useDeleteRecipe();

  const handleReaction = (recipeId: number, reaction: "like" | "dislike") => {
    mutateSubmitRecipeReaction(
      { recipeId, reaction },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["recipes"] });
        },
      }
    );
  };

  const handleDeleteRecipe = (recipeId: number, recipeTitle: string) => {
    // Confirmation dialog
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${recipeTitle}"? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    mutateDeleteRecipe(recipeId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["recipes"] });
      },
      onError: (error) => {
        console.error("Error deleting recipe:", error);
        alert("Failed to delete recipe. Please try again.");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-20 lg:py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Discover Delicious Recipes</h1>
          <p className="text-gray-600">Explore our collection of amazing recipes</p>
        </div>

        {/* Recipe Cards Grid */}
        {isFetching && !isRefetching && !isFetchingNextPage ? (
          <div className="flex h-[70vh] items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <InfiniteScroll
              fetchNextPage={() => {
                void fetchNextPage();
              }}
              hasNextPage={!!hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
            >
              {recipes.map((recipe) => (
                <Card
                  key={recipe.recipe_id}
                  className="overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
                >
                  {/* Recipe Image */}
                  <div className="relative h-48 overflow-hidden flex-shrink-0">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-2">
                      <span
                        className={`bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-semibold ${recipe.category === "veg" ? "text-green-500" : "text-red-500"}`}
                      >
                        {recipe.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      {/* Delete Button - Top Left */}
                      <button
                        onClick={() => handleDeleteRecipe(recipe.recipe_id, recipe.title)}
                        disabled={isDeletingRecipe}
                        className="bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        title="Delete recipe"
                      >
                        {isDeletingRecipe ? <Loader /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <CardHeader className="flex-shrink-0">
                    <CardTitle className="text-xl">{recipe.title}</CardTitle>
                    <CardDescription>{recipe.ingredient}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">{/* Expandable Details */}</CardContent>

                  <CardFooter className="flex flex-col space-y-3 mt-auto">
                    {/* View Details Button */}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate(`/recipe/${recipe.recipe_id}`)}
                    >
                      View Details
                    </Button>

                    {/* Like/Dislike Buttons */}
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReaction(recipe.recipe_id, "like")}
                        >
                          {isLoadingRecipeReaction ? (
                            <Loader />
                          ) : (
                            <ThumbsUp
                              className={`w-4 h-4 mr-1  ${recipe.reaction === "like" ? "fill-current text-green-600" : "cursor-pointer"} `}
                            />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReaction(recipe.recipe_id, "dislike")}
                        >
                          {isLoadingRecipeReaction ? (
                            <Loader />
                          ) : (
                            <ThumbsDown
                              className={`w-4 h-4 mr-1 ${recipe.reaction === "dislike" ? "fill-current text-red-600" : "cursor-pointer"} `}
                            />
                          )}
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Comment
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </InfiniteScroll>
          </div>
        )}

        {isFetchingNextPage ? <Loader /> : null}

        {/* No Results */}
        {recipes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No recipes found. Try a different search!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeHomePage;
