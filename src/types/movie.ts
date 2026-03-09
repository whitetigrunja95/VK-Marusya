export type Movie = {
  id: number;
  title: string;
  description?: string;
  plot?: string;
  posterUrl?: string;
  backdropUrl?: string;
  releaseYear?: number;
  genres?: string[];
  runtime?: number;
  rating?: number;
  tmdbRating?: number;
  imdbRating?: number;
  trailerUrl?: string;
};