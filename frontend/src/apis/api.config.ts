import axios, { type AxiosInstance } from "axios";

type apiLinksType = Record<string, string>;

export const apiLinks: apiLinksType = {
  baseUrl: import.meta.env.VITE_BASE_URL,
  recipe: import.meta.env.VITE_RECIPE_URL,
};

export const axiosPrivate: AxiosInstance = axios.create();
