import axios from "axios";
import FormData = require("form-data");
import * as dotenv from "dotenv";
dotenv.config();

const recipeData = [
  {
    recipe_id: 1,
    title: "Gatta Masala",
    instruction:
      "Boil gram flour and make dumplings. Fry them. Prepare a spiced yogurt gravy and add gattas. Simmer and serve with roti.",
    ingredient:
      "Gram flour, Turmeric, Red chili powder, Coriander powder, Garam masala, Yogurt, Oil, Cumin seeds, Onion, Tomatoes, Salt, Coriander leaves",
    image: "https://i.redd.it/em6j2js46js81.jpg",
    category: "veg",
  },
  {
    recipe_id: 2,
    title: "Paneer Butter Masala",
    instruction:
      "Fry paneer cubes. Prepare tomato-onion gravy with butter and cream. Add paneer and simmer for 10 minutes.",
    ingredient:
      "Paneer, Butter, Cream, Onion, Tomato, Ginger-garlic paste, Kasuri methi, Garam masala, Salt, Sugar",
    image:
      "https://tse3.mm.bing.net/th/id/OIP.Cubwl8pmN-IAlDjoZVO91gHaJQ?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "veg",
  },
  {
    recipe_id: 3,
    title: "Chicken Burger",
    instruction:
      "Grill chicken patty with spices. Toast buns. Assemble burger with lettuce, tomato, onion, and mayonnaise. Serve hot.",
    ingredient:
      "Chicken patty, Burger buns, Lettuce, Tomato, Onion, Mayonnaise, Cheese slice, Salt, Pepper, Oil",
    image:
      "https://th.bing.com/th/id/R.63698cc97cc5c4fe1d1ce5dddcaac706?rik=19xJWmE1imMFog&riu=http%3a%2f%2ftrentapizza.co.uk%2fwp-content%2fuploads%2f2016%2f07%2fBuffalo-Chicken-Burger.jpg&ehk=BVBG0sEaYZL43o1vFYn1wOIJeiw%2fnBXyQgEctHI3xU0%3d&risl=&pid=ImgRaw&r=0",
    category: "non-veg",
  },
  {
    recipe_id: 4,
    title: "Aloo Gobi",
    instruction:
      "Heat oil and add cumin seeds. Sauté onions, ginger, and garlic. Add potatoes and cauliflower with spices. Cook until tender.",
    ingredient:
      "Potatoes, Cauliflower, Onion, Tomato, Ginger, Garlic, Cumin seeds, Turmeric, Coriander powder, Chili powder, Salt, Coriander leaves",
    image:
      "https://tse1.mm.bing.net/th/id/OIP.yw1JgzPsFzyKUr18FZ2IqgHaFs?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "veg",
  },
  {
    recipe_id: 5,
    title: "Margherita Pizza",
    instruction:
      "Prepare pizza dough and spread tomato sauce. Add cheese and basil leaves. Bake in oven until crust is golden and cheese melts.",
    ingredient:
      "Pizza dough, Tomato sauce, Mozzarella cheese, Basil leaves, Olive oil, Salt, Oregano",
    image: "https://d2lswn7b0fl4u2.cloudfront.net/photos/pg-margherita-pizza-1611491820.jpg",
    category: "veg",
  },
  {
    recipe_id: 6,
    title: "Fish Curry",
    instruction:
      "Marinate fish with turmeric and salt. Sauté onions, garlic, and tomatoes. Add coconut milk and spices. Add fish and cook gently until done.",
    ingredient:
      "Fish fillets, Onion, Tomato, Garlic, Turmeric, Red chili powder, Coriander powder, Coconut milk, Oil, Salt, Coriander leaves",
    image: "https://vaya.in/recipes/wp-content/uploads/2018/04/Kerala-Fish-Curry.jpg",
    category: "non-veg",
  },
  {
    recipe_id: 7,
    title: "Veg Sandwich",
    instruction:
      "Toast bread slices. Layer with cucumber, tomato, lettuce, and cheese. Spread mayonnaise and serve chilled.",
    ingredient: "Bread slices, Cucumber, Tomato, Lettuce, Cheese, Mayonnaise, Salt, Pepper, Butter",
    image: "https://i.pinimg.com/originals/a5/f2/10/a5f21054fcc0f406d154a1d151fa1f04.jpg",
    category: "veg",
  },
  {
    recipe_id: 8,
    title: "Mutton Rogan Josh",
    instruction:
      "Sauté onions, ginger, and garlic. Add mutton pieces with yogurt and spices. Cook on low heat until tender. Garnish with coriander.",
    ingredient:
      "Mutton, Onion, Yogurt, Garlic, Ginger, Red chili powder, Turmeric, Garam masala, Oil, Salt, Coriander leaves",
    image: "https://www.awesomecuisine.com/wp-content/uploads/2018/05/Rogan-Josh.jpg",
    category: "non-veg",
  },
  {
    recipe_id: 9,
    title: "French Fries",
    instruction:
      "Cut potatoes into sticks. Soak in water. Deep fry until golden and crispy. Sprinkle salt and serve with ketchup.",
    ingredient: "Potatoes, Oil, Salt, Ketchup",
    image:
      "https://img.freepik.com/premium-photo/french-fries-hd-8k-wall-paper-stock-photographic-image_890746-85480.jpg",
    category: "veg",
  },
  {
    recipe_id: 10,
    title: "Egg Curry",
    instruction:
      "Boil eggs. Sauté onions, ginger, and garlic. Add tomatoes and spices to make gravy. Add boiled eggs and simmer for 5 minutes.",
    ingredient:
      "Eggs, Onion, Tomato, Ginger-garlic paste, Turmeric, Red chili powder, Coriander powder, Oil, Salt, Coriander leaves",
    image: "https://eatingisart.com/wp-content/uploads/2024/10/egg-curry-recipe-1729728079.jpg",
    category: "non-veg",
  },
];

const API_URL = "http://localhost:8080/api/recipes";

/**
 * Fetches an image from the specified URL and returns its data as a Buffer.
 *
 * @param url - The URL of the image to fetch.
 * @returns A promise that resolves to a Buffer containing the image data.
 * @throws If the HTTP request fails or the response cannot be converted to a Buffer.
 */
async function fetchImageBuffer(url: string): Promise<Buffer> {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(response.data, "binary");
}

async function seedRecipes() {
  for (const recipe of recipeData) {
    try {
      // Fetch image
      const imageBuffer = await fetchImageBuffer(recipe.image);

      // Generate filename from title
      const fileName = recipe.title.toLowerCase().replace(/\s+/g, "_") + ".png";

      // Prepare form data
      const form = new FormData();
      form.append("title", recipe.title);
      form.append("instruction", recipe.instruction);
      form.append("ingredient", recipe.ingredient);
      form.append("category", recipe.category);
      form.append("image", imageBuffer, {
        filename: fileName,
        contentType: "image/png",
      });

      await axios.post(API_URL, form, {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}` || "",
          ...form.getHeaders(), // important for multipart
        },
      });

      console.log(`Recipe "${recipe.title}" saved successfully.`);
    } catch (err: any) {
      console.error(`Error saving recipe "${recipe.title}":`, err.message);
    }
  }
}

// Run seeder
seedRecipes();
