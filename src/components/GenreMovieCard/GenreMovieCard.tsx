import { Link } from "react-router-dom";
import type { Movie } from "../../types/movie";
import "./GenreMovieCard.css";

type GenreMovieCardProps = {
  movie: Movie;
};

export const GenreMovieCard = ({ movie }: GenreMovieCardProps) => {
  return (
    <Link className="genre-movie-card" to={`/movie/${movie.id}`}>
      {movie.posterUrl ? (
        <img
          className="genre-movie-card__image"
          src={movie.posterUrl}
          alt={movie.title}
        />
      ) : (
        <div className="genre-movie-card__placeholder">{movie.title}</div>
      )}
    </Link>
  );
};