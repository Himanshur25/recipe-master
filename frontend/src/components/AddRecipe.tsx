import { useQueryClient } from "@tanstack/react-query";
import { Save, Upload, X } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateRecipe } from "../queryHooks/recipe.query";
import type { Recipe } from "../types/recipe";
import { Button } from "./common/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./common/card";
import { Input } from "./common/input";
import { Label } from "./common/label";
import Navbar from "./Navbar";

const AddRecipePage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<Recipe>>({
    title: "",
    category: "veg",
    ingredient: "",
    instruction: "",
  });

  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const categories = ["Veg", "Non-Veg"];
  const { mutateAsync: mutateCreateRecipe, isPending } = useCreateRecipe();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setImageFile(file);

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append("title", formData.title!);
    data.append("category", formData.category!);
    data.append("ingredient", formData.ingredient!);
    data.append("instruction", formData.instruction!);
    if (imageFile) data.append("image", imageFile); // send actual file

    await mutateCreateRecipe(data, {
      onSuccess: () => {
        navigate("/recipe");
        queryClient.invalidateQueries({ queryKey: ["getRecipe"] });
      },
      onError: () => {
        alert("Failed to create recipe. Please try again.");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Navbar isSearchable={false} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Create Your Recipe</CardTitle>
            <CardDescription>Share your culinary masterpiece with the community</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="title">Recipe Title *</Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="e.g. Margherita Pizza"
                value={formData.title}
                onChange={handleInputChange}
              />

              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full h-10 px-3 border border-gray-300 rounded-md"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Image Upload */}
              <Label htmlFor="image">Recipe Image</Label>
              <div className="relative w-[60%] h-64  rounded-xl overflow-hidden shadow-lg">
                {!imagePreview ? (
                  <label
                    htmlFor="image"
                    className="flex flex-col items-center justify-center w-full h-full bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="w-12 h-12 text-orange-400 mb-2" />
                    <p className="text-gray-500 font-medium">Drag & drop or click to upload</p>
                    <p className="text-sm text-gray-400">PNG, JPG, GIF (max 5MB)</p>
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </label>
                ) : (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <button
                        onClick={removeImage}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>

              {imageFile && (
                <div className="mt-2 text-sm text-gray-600 flex justify-between items-center">
                  <span className="truncate">{imageFile.name}</span>
                  <span>{(imageFile.size / 1024).toFixed(2)} KB</span>
                </div>
              )}

              <Label htmlFor="ingredient">Ingredients *</Label>
              <Input
                id="ingredient"
                name="ingredient"
                type="text"
                placeholder="Add an ingredient..."
                value={formData.ingredient}
                onChange={handleInputChange}
              />

              <Label htmlFor="instruction">Instructions *</Label>
              <textarea
                id="instruction"
                name="instruction"
                placeholder="Add an instruction step..."
                value={formData.instruction}
                onChange={handleInputChange}
                className="w-full min-h-20 px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Submit */}
            <div className="pt-6 border-t flex gap-4">
              <Button onClick={() => navigate("/recipe")} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  !formData.title ||
                  !formData.category ||
                  !formData.instruction ||
                  !formData.category ||
                  isPending
                }
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold"
              >
                <Save className="w-4 h-4 mr-2" />
                {isPending ? "Loading" : "Save Recipe"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddRecipePage;
