import { apiClient } from "./apiClient";
import type { Movie } from "../types/movie";

export const getRandomMovie = async (): Promise<Movie> => {
  const response = await apiClient.get("/movie/random");

  return response.data;
};

export const getTopMovies = async (): Promise<Movie[]> => {
  const response = await apiClient.get("/movie/top");

  return response.data;
};

export const getGenres = async (): Promise<string[]> => {
  const response = await apiClient.get("/movie/genres");

  return response.data;
};