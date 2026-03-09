import { useEffect, useState } from "react";
import heartIcon from "../../assets/icons/heart.svg";
import refreshIcon from "../../assets/icons/refresh.svg";
import { getRandomMovie } from "../../api/moviesApi";
import type { Movie } from "../../types/movie";
import "./HeroMovie.css";

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

export const HeroMovie = () => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadRandomMovie = async () => {
    try {
      setHasError(false);
      setIsLoading(true);

      const randomMovie = await getRandomMovie();
      console.log("randomMovie", randomMovie);
      setMovie(randomMovie);
    } catch (error) {
      console.error("Не удалось загрузить случайный фильм:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadRandomMovie();
  }, []);

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

            <div className="hero-movie__actions">
              <button
                className="hero-movie__button hero-movie__button--primary"
                type="button"
                onClick={loadRandomMovie}
              >
                Попробовать снова
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const rating =
    movie.tmdbRating ??
    movie.imdbRating ??
    movie.rating;

  const description =
    movie.plot ??
    movie.description ??
    "Описание пока недоступно";

  const imageUrl =
    movie.backdropUrl ??
    movie.posterUrl ??
    "";

  return (
    <section className="hero-movie">
      <div className="hero-movie__content">
        <div className="hero-movie__info">
          <div className="hero-movie__meta">
            <span className="hero-movie__rating">
              {typeof rating === "number" ? rating.toFixed(1) : "—"}
            </span>

            <span className="hero-movie__meta-text">
              {movie.releaseYear ?? "—"}
            </span>

            <span className="hero-movie__meta-text">
              {movie.genres?.[0] ?? "жанр неизвестен"}
            </span>

            <span className="hero-movie__meta-text">
              {formatRuntime(movie.runtime)}
            </span>
          </div>

          <h1 className="hero-movie__title">{movie.title}</h1>

          <p className="hero-movie__description">{description}</p>

          <div className="hero-movie__actions">
            <button
              className="hero-movie__button hero-movie__button--primary"
              type="button"
            >
              Трейлер
            </button>

            <button
              className="hero-movie__button hero-movie__button--secondary"
              type="button"
            >
              О фильме
            </button>

            <button
              className="hero-movie__icon-button"
              type="button"
              aria-label="Добавить в избранное"
            >
              <img src={heartIcon} alt="" />
            </button>

            <button
              className="hero-movie__icon-button"
              type="button"
              aria-label="Показать другой фильм"
              onClick={loadRandomMovie}
            >
              <img src={refreshIcon} alt="" />
            </button>
          </div>
        </div>

        <div className="hero-movie__poster">
          {imageUrl ? <img src={imageUrl} alt={movie.title} /> : null}
        </div>
      </div>
    </section>
  );
};