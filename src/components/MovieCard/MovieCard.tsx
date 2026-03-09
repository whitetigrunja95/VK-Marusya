import { Link } from "react-router-dom";
import type { Movie } from "../../types/movie";
import "./MovieCard.css";

type MovieCardProps = {
  movie: Movie;
  rank?: number;
};

export const MovieCard = ({ movie, rank }: MovieCardProps) => {
  return (
    <Link className="movie-card" to={`/movie/${movie.id}`}>
      <div className="movie-card__poster-wrapper">
        {movie.posterUrl ? (
          <img
            className="movie-card__poster"
            src={movie.posterUrl}
            alt={movie.title}
          />
        ) : (
          <div className="movie-card__placeholder">Нет постера</div>
        )}

        {rank && <div className="movie-card__rank">{rank}</div>}
      </div>

      <div className="movie-card__content">
        <h2 className="movie-card__title">{movie.title}</h2>

        <p className="movie-card__meta">
          {movie.releaseYear ?? "Год неизвестен"}
        </p>
      </div>
    </Link>
  );
};