import React, { useState } from "react";

import {
  ChefHat,
  Search,
  Plus,
  ThumbsUp,
  ThumbsDown,
  Clock,
  LogOut,
  User,
  Heart,
  MessageSquare,
} from "lucide-react";
import { Button } from "./common/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./common/card";
import { Input } from "./common/input";
import { useNavigate } from "react-router-dom";

interface Recipe {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  servings: number;
  likes: number;
  dislikes: number;
  isLiked: boolean;
  isDisliked: boolean;
}

const RecipeHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: 1,
      title: "Classic Margherita Pizza",
      description: "A timeless Italian classic with fresh mozzarella, basil, and tomatoes",
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop",
      category: "Italian",
      ingredients: [
        "Pizza dough",
        "Fresh mozzarella cheese",
        "San Marzano tomatoes",
        "Fresh basil leaves",
        "Extra virgin olive oil",
        "Salt and pepper",
      ],
      instructions: [
        "Preheat oven to 475°F (245°C)",
        "Roll out pizza dough on a floured surface",
        "Spread tomato sauce evenly on dough",
        "Add mozzarella cheese and basil",
        "Drizzle with olive oil",
        "Bake for 12-15 minutes until golden",
      ],
      prepTime: "30 mins",
      servings: 4,
      likes: 234,
      dislikes: 12,
      isLiked: false,
      isDisliked: false,
    },
    {
      id: 2,
      title: "Chicken Tikka Masala",
      description: "Creamy and flavorful Indian curry with tender chicken pieces",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop",
      category: "Indian",
      ingredients: [
        "Chicken breast",
        "Yogurt",
        "Tikka masala spice mix",
        "Heavy cream",
        "Tomato puree",
        "Onions and garlic",
        "Ginger",
      ],
      instructions: [
        "Marinate chicken in yogurt and spices for 2 hours",
        "Grill or bake chicken until cooked",
        "Sauté onions, garlic, and ginger",
        "Add tomato puree and spices",
        "Add cream and cooked chicken",
        "Simmer for 15 minutes",
      ],
      prepTime: "45 mins",
      servings: 6,
      likes: 189,
      dislikes: 8,
      isLiked: false,
      isDisliked: false,
    },
    {
      id: 3,
      title: "Caesar Salad",
      description: "Crisp romaine lettuce with creamy Caesar dressing and croutons",
      image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop",
      category: "Salad",
      ingredients: [
        "Romaine lettuce",
        "Parmesan cheese",
        "Caesar dressing",
        "Croutons",
        "Lemon juice",
        "Black pepper",
      ],
      instructions: [
        "Wash and chop romaine lettuce",
        "Make Caesar dressing with mayo, garlic, and anchovies",
        "Toss lettuce with dressing",
        "Add croutons and parmesan",
        "Garnish with lemon and pepper",
      ],
      prepTime: "15 mins",
      servings: 2,
      likes: 156,
      dislikes: 5,
      isLiked: false,
      isDisliked: false,
    },
    {
      id: 4,
      title: "Chocolate Lava Cake",
      description: "Decadent molten chocolate dessert with a gooey center",
      image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&h=600&fit=crop",
      category: "Dessert",
      ingredients: ["Dark chocolate", "Butter", "Eggs", "Sugar", "Flour", "Vanilla extract"],
      instructions: [
        "Melt chocolate and butter together",
        "Whisk eggs and sugar until fluffy",
        "Combine chocolate mixture with eggs",
        "Fold in flour gently",
        "Pour into greased ramekins",
        "Bake at 425°F for 12-14 minutes",
      ],
      prepTime: "25 mins",
      servings: 4,
      likes: 312,
      dislikes: 3,
      isLiked: false,
      isDisliked: false,
    },
  ]);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [expandedRecipe, setExpandedRecipe] = useState<number | null>(null);

  const handleLike = (recipeId: number) => {
    setRecipes(
      recipes.map((recipe) => {
        if (recipe.id === recipeId) {
          if (recipe.isLiked) {
            return { ...recipe, likes: recipe.likes - 1, isLiked: false };
          } else {
            return {
              ...recipe,
              likes: recipe.likes + 1,
              dislikes: recipe.isDisliked ? recipe.dislikes - 1 : recipe.dislikes,
              isLiked: true,
              isDisliked: false,
            };
          }
        }
        return recipe;
      })
    );
  };

  const handleDislike = (recipeId: number) => {
    setRecipes(
      recipes.map((recipe) => {
        if (recipe.id === recipeId) {
          if (recipe.isDisliked) {
            return { ...recipe, dislikes: recipe.dislikes - 1, isDisliked: false };
          } else {
            return {
              ...recipe,
              dislikes: recipe.dislikes + 1,
              likes: recipe.isLiked ? recipe.likes - 1 : recipe.likes,
              isDisliked: true,
              isLiked: false,
            };
          }
        }
        return recipe;
      })
    );
  };

  const toggleRecipeDetails = (recipeId: number) => {
    setExpandedRecipe(expandedRecipe === recipeId ? null : recipeId);
  };

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">Recipe Master</span>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search recipes or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>

            {/* Right Menu */}
            <div className="flex items-center space-x-4">
              <Button className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Recipe
              </Button>

              {/* User Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                    <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2">
                      <Heart className="w-4 h-4" />
                      <span>Favorites</span>
                    </button>

                    <hr className="my-2" />
                    <button
                      onClick={() => {
                        localStorage.clear();
                        navigate("/login");
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-y-2 text-red-600 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-20 lg:py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Discover Delicious Recipes</h1>
          <p className="text-gray-600">
            Explore our collection of {recipes.length} amazing recipes
          </p>
        </div>

        {/* Recipe Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecipes.map((recipe) => (
            <Card
              key={recipe.id}
              className="overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              {/* Recipe Image */}
              <div className="relative h-48 overflow-hidden flex-shrink-0">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-orange-600">
                    {recipe.category}
                  </span>
                </div>
              </div>

              <CardHeader className="flex-shrink-0">
                <CardTitle className="text-xl">{recipe.title}</CardTitle>
                <CardDescription>{recipe.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Recipe Info */}
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{recipe.prepTime}</span>
                </div>

                {/* Expandable Details */}
                {expandedRecipe === recipe.id && (
                  <div className="space-y-3 pt-3 border-t">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Ingredients:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {recipe.ingredients.map((ingredient, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-orange-500 mr-2">•</span>
                            {ingredient}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Instructions:</h4>
                      <ol className="text-sm text-gray-600 space-y-1">
                        {recipe.instructions.map((instruction, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-orange-500 mr-2 font-semibold">{idx + 1}.</span>
                            {instruction}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex flex-col space-y-3 mt-auto">
                {/* View Details Button */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => toggleRecipeDetails(recipe.id)}
                >
                  {expandedRecipe === recipe.id ? "Hide Details" : "View Details"}
                </Button>

                {/* Like/Dislike Buttons */}
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(recipe.id)}
                      className={recipe.isLiked ? "text-green-600" : ""}
                    >
                      <ThumbsUp
                        className={`w-4 h-4 mr-1 ${recipe.isLiked ? "fill-current" : ""}`}
                      />
                      {recipe.likes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDislike(recipe.id)}
                      className={recipe.isDisliked ? "text-red-600" : ""}
                    >
                      <ThumbsDown
                        className={`w-4 h-4 mr-1 ${recipe.isDisliked ? "fill-current" : ""}`}
                      />
                      {recipe.dislikes}
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
        </div>

        {/* No Results */}
        {filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No recipes found. Try a different search!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeHomePage;
