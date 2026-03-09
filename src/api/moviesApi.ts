import { apiClient } from "./apiClient";
import type { Movie } from "../types/movie";

export const getRandomMovie = async (): Promise<Movie> => {
  const response = await apiClient.get("/movie/random");
  return response.data;
};

export const getTopMovies = async (): Promise<Movie[]> => {
  const response = await apiClient.get("/movie/top10");
  return response.data;
};

export const getGenres = async (): Promise<string[]> => {
  const response = await apiClient.get("/movie/genres");
  return response.data;
};

export const getMovieById = async (id: string): Promise<Movie> => {
  const response = await apiClient.get(`/movie/${id}`);
  return response.data;
};

export const getMoviesByGenre = async (genre: string): Promise<Movie[]> => {
  const response = await apiClient.get(`/movie?genre=${genre}`);
  return response.data;
};