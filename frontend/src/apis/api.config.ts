import axios, { type AxiosInstance } from "axios";

type apiLinksType = Record<string, string>;

export const apiLinks: apiLinksType = {
  auth: import.meta.env.VITE_AUTH_BASE_URL,
  recipe: import.meta.env.VITE_RECIPE_BASE_URL,
};

export const axiosPrivate: AxiosInstance = axios.create();
