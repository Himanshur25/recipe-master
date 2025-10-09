import React from "react";
import { useNavigate } from "react-router-dom";
import { ChefHat, Home, ArrowLeft } from "lucide-react";
import { Button } from "./components/common/button";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
              <ChefHat className="w-16 h-16 text-white" />
            </div>

            <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-300 rounded-full opacity-70 animate-ping"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-amber-400 rounded-full opacity-70 animate-pulse"></div>
          </div>
        </div>

        {/* 404 Text */}
        <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600 mb-4">
          404
        </h1>

        {/* Error Message */}
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Recipe Not Found!</h2>

        <p className="text-xl text-gray-600 mb-2">
          Oops! Looks like this recipe is missing from our kitchen.
        </p>

        <p className="text-lg text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved to another cookbook.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full sm:w-auto px-6 py-3 text-lg border-2 border-orange-500 text-orange-600 hover:bg-orange-50"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>

          <Button
            onClick={() => navigate("/recipe")}
            className="w-full sm:w-auto px-8 py-3 text-lg bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold shadow-lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Recipes
          </Button>
        </div>

        {/* Fun Message */}
        <div className="mt-12 text-gray-500 text-sm">
          <p>💡 Tip: Try searching for recipes in our main menu!</p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
