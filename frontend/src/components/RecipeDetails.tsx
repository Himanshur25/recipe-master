import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ChefHat, ThumbsUp, ThumbsDown, MessageSquare, Trash2 } from "lucide-react";
import { Button } from "./common/button";
import { Card, CardContent, CardHeader, CardTitle } from "./common/card";
import { useGetRecipeById, useSubmitRecipeReaction } from "../queryHooks/recipe.query";
import { Loader } from "./common/spinner";
import { useQueryClient } from "@tanstack/react-query";

const RecipeDetailPage: React.FC = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: recipe, isLoading, isError, error } = useGetRecipeById(Number(recipeId));

  const { mutateAsync: mutateSubmitRecipeReaction, isPending: isLoadingRecipeReaction } =
    useSubmitRecipeReaction();

  const handleReaction = (reaction: "like" | "dislike") => {
    if (!recipe) return;

    mutateSubmitRecipeReaction(
      { recipeId: recipe.recipe_id, reaction },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["recipeById", Number(recipeId)] });
        },
      }
    );
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <Loader />
          <p className="text-gray-600">Loading recipe details...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (isError || !recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Recipe</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              {error?.message || "Failed to load recipe details. Please try again."}
            </p>
            <Button
              onClick={() => navigate("/recipe")}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
            >
              Back to Recipes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate("/recipe")}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Recipes</span>
            </button>

            <div className="flex items-center space-x-3">
              <Button
                disabled
                variant="outline"
                className="border-red-500 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {/* {false ? <Loader /> : <Trash2 className="w-4 h-4 mr-2" />} */}
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Image Section */}
        <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl mb-8">
          <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center space-x-3 mb-3">
              <span
                className={`px-4 py-1 rounded-full text-sm font-semibold ${
                  recipe.category === "veg" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                }`}
              >
                {recipe.category}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">{recipe.title}</h1>
            {recipe.instruction && <p className="text-white/90 text-lg">{recipe.instruction}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-8">
            {/* Ingredients Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <ChefHat className="w-6 h-6 mr-2 text-orange-600" />
                  Ingredients
                </CardTitle>
              </CardHeader>
              <CardContent>{recipe.ingredient}</CardContent>
            </Card>

            {/* Instructions Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Instructions</CardTitle>
              </CardHeader>
              <CardContent>{recipe.instruction}</CardContent>
            </Card>
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Reactions Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Reaction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => handleReaction("like")}
                  disabled={isLoadingRecipeReaction}
                  className={`w-full justify-start cursor-pointer ${
                    recipe.reaction === "like"
                      ? "bg-green-50 border-2 border-green-500 text-green-700"
                      : "bg-gray-50"
                  }`}
                  variant="outline"
                >
                  {isLoadingRecipeReaction ? (
                    <Loader />
                  ) : (
                    <ThumbsUp
                      className={`w-5 h-5 mr-2 ${recipe.reaction === "like" ? "fill-current" : ""}`}
                    />
                  )}
                  Like this recipe
                </Button>

                <Button
                  onClick={() => handleReaction("dislike")}
                  disabled={isLoadingRecipeReaction}
                  className={`w-full justify-start cursor-pointer ${
                    recipe.reaction === "dislike"
                      ? "bg-red-50 border-2 border-red-500 text-red-700"
                      : "bg-gray-50"
                  }`}
                  variant="outline"
                >
                  {isLoadingRecipeReaction ? (
                    <Loader />
                  ) : (
                    <ThumbsDown
                      className={`w-5 h-5 mr-2 ${
                        recipe.reaction === "dislike" ? "fill-current" : ""
                      }`}
                    />
                  )}
                  Not for me
                </Button>

                <Button variant="outline" className="w-full justify-start bg-gray-50" disabled>
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Add Comment
                </Button>
              </CardContent>
            </Card>

            {/* Additional Info Card */}
            <Card className="bg-gradient-to-br from-orange-50 to-amber-50">
              <CardHeader>
                <CardTitle className="text-lg">Recipe Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-semibold text-gray-800 capitalize">{recipe.category}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Recipe ID:</span>
                  <span className="font-semibold text-gray-800">#{recipe.recipe_id}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
