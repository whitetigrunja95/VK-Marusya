import { useEffect, useMemo, useState } from "react";
import heartIcon from "../../assets/icons/heart.svg";
import refreshIcon from "../../assets/icons/refresh.svg";
import { getRandomMovie } from "../../api/moviesApi";
import type { Movie } from "../../types/movie";
import "./HeroMovie.css";

type HeroMovieProps = {
  movie?: Movie;
  showRefreshButton?: boolean;
  showAboutButton?: boolean;
};

const formatRuntime = (minutes?: number) => {
  if (!minutes) {
    return "—";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} мин`;
  }

  return `${hours} ч ${remainingMinutes} мин`;
};

export const HeroMovie = ({
  movie: movieFromProps,
  showRefreshButton = true,
  showAboutButton = true,
}: HeroMovieProps) => {
  const [randomMovie, setRandomMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(!movieFromProps);
  const [hasError, setHasError] = useState(false);

  const isExternalMovie = Boolean(movieFromProps);

  const movie = useMemo(() => {
    return movieFromProps ?? randomMovie;
  }, [movieFromProps, randomMovie]);

  const loadRandomMovie = async () => {
    if (isExternalMovie) {
      return;
    }

    try {
      setHasError(false);
      setIsLoading(true);

      const nextMovie = await getRandomMovie();
      setRandomMovie(nextMovie);
    } catch (error) {
      console.error("Не удалось загрузить случайный фильм:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (movieFromProps) {
      setIsLoading(false);
      setHasError(false);
      return;
    }

    void loadRandomMovie();
  }, [movieFromProps]);

  if (isLoading) {
    return (
      <section className="hero-movie">
        <div className="hero-movie__content">
          <div className="hero-movie__info">
            <p className="hero-movie__description">Загрузка фильма...</p>
          </div>
        </div>
      </section>
    );
  }

  if (hasError || !movie) {
    return (
      <section className="hero-movie">
        <div className="hero-movie__content">
          <div className="hero-movie__info">
            <p className="hero-movie__description">
              Не удалось загрузить фильм. Попробуй обновить страницу.
            </p>

            {!isExternalMovie && (
              <div className="hero-movie__actions">
                <button
                  className="hero-movie__button hero-movie__button--primary"
                  type="button"
                  onClick={loadRandomMovie}
                >
                  Попробовать снова
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  const rating = movie.tmdbRating ?? movie.imdbRating ?? movie.rating;
  const description = movie.plot ?? movie.description ?? "Описание пока недоступно";
  const imageUrl = movie.backdropUrl ?? movie.posterUrl ?? "";

  return (
    <section className="hero-movie">
      <div className="hero-movie__content">
        <div className="hero-movie__info">
          <div className="hero-movie__meta">
            <span className="hero-movie__rating">
              ★ {typeof rating === "number" ? rating.toFixed(1) : "—"}
            </span>

            <span className="hero-movie__meta-text">
              {movie.releaseYear ?? "—"}
            </span>

            <span className="hero-movie__meta-text">
              {movie.genres?.[0] ?? "Жанр неизвестен"}
            </span>

            <span className="hero-movie__meta-text">
              {formatRuntime(movie.runtime)}
            </span>
          </div>

          <h1 className="hero-movie__title">{movie.title}</h1>

          <p className="hero-movie__description">{description}</p>

          <div className="hero-movie__actions">
            {movie.trailerUrl && (
              <a
                className="hero-movie__button hero-movie__button--primary hero-movie__link-button"
                href={movie.trailerUrl}
                target="_blank"
                rel="noreferrer"
              >
                Трейлер
              </a>
            )}

            {showAboutButton && (
              <a
                className="hero-movie__button hero-movie__button--secondary hero-movie__link-button"
                href="#about-movie"
              >
                О фильме
              </a>
            )}

            <button
              className="hero-movie__icon-button"
              type="button"
              aria-label="Добавить в избранное"
            >
              <img src={heartIcon} alt="" />
            </button>

            {showRefreshButton && !isExternalMovie && (
              <button
                className="hero-movie__icon-button"
                type="button"
                aria-label="Показать другой фильм"
                onClick={loadRandomMovie}
              >
                <img src={refreshIcon} alt="" />
              </button>
            )}
          </div>
        </div>

        <div className="hero-movie__poster">
          {imageUrl ? <img src={imageUrl} alt={movie.title} /> : null}
        </div>
      </div>
    </section>
  );
};