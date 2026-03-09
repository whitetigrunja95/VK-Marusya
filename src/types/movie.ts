export type Movie = {
  id: number;
  title: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  releaseYear: number;
  genres: string[];
  runtime: number;
  rating: number;
  trailerUrl: string;
};