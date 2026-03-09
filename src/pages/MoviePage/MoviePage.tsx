import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import heartIcon from "../../assets/icons/heart.svg";
import { getMovieById } from "../../api/moviesApi";
import { MainLayout } from "../../layouts/MainLayout";
import type { Movie } from "../../types/movie";
import "./MoviePage.css";

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

const formatMoney = (value?: string | number) => {
  if (!value) {
    return "—";
  }

  if (typeof value === "string") {
    return value;
  }

  return `$${value.toLocaleString()}`;
};

export const MoviePage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadMovie = async () => {
      if (!id) {
        setHasError(true);
        setIsLoading(false);
        return;
      }

      try {
        setHasError(false);
        setIsLoading(true);

        const movieData = await getMovieById(id);
        console.log("movieById", movieData);
        setMovie(movieData);
      } catch (error) {
        console.error("Не удалось загрузить страницу фильма:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    void loadMovie();
  }, [id]);

  if (isLoading) {
    return (
      <MainLayout>
        <section className="movie-page">
          <p className="movie-page__message">Загрузка фильма...</p>
        </section>
      </MainLayout>
    );
  }

  if (hasError || !movie) {
    return (
      <MainLayout>
        <section className="movie-page">
          <p className="movie-page__message">
            Не удалось загрузить информацию о фильме.
          </p>
        </section>
      </MainLayout>
    );
  }

  const rating =
    movie.tmdbRating ??
    movie.imdbRating ??
    movie.rating;

  const description =
    movie.plot ??
    movie.description ??
    "Описание пока недоступно.";

  const imageUrl =
    movie.backdropUrl ??
    movie.posterUrl ??
    "";

  return (
    <MainLayout>
      <section className="movie-page">
        <div className="movie-page__hero">
          <div className="movie-page__info">
            <div className="movie-page__meta">
              <span className="movie-page__rating">
                {typeof rating === "number" ? rating.toFixed(1) : "—"}
              </span>

              <span className="movie-page__meta-text">
                {movie.releaseYear ?? "—"}
              </span>

              <span className="movie-page__meta-text">
                {movie.genres?.join(", ") || "жанр неизвестен"}
              </span>

              <span className="movie-page__meta-text">
                {formatRuntime(movie.runtime)}
              </span>
            </div>

            <h1 className="movie-page__title">{movie.title}</h1>

            <p className="movie-page__description">{description}</p>

            <div className="movie-page__actions">
              <button className="movie-page__button movie-page__button--primary" type="button">
                Трейлер
              </button>

              <button className="movie-page__icon-button" type="button" aria-label="Добавить в избранное">
                <img src={heartIcon} alt="" />
              </button>
            </div>
          </div>

          <div className="movie-page__poster">
            {imageUrl ? <img src={imageUrl} alt={movie.title} /> : null}
          </div>
        </div>

        <div className="movie-page__details">
          <h2 className="movie-page__subtitle">О фильме</h2>

          <div className="movie-page__rows">
            <div className="movie-page__row">
              <span className="movie-page__label">Язык оригинала</span>
              <span className="movie-page__value">{movie.language ?? "—"}</span>
            </div>

            <div className="movie-page__row">
              <span className="movie-page__label">Бюджет</span>
              <span className="movie-page__value">{formatMoney(movie.budget)}</span>
            </div>

            <div className="movie-page__row">
              <span className="movie-page__label">Выручка</span>
              <span className="movie-page__value">{formatMoney(movie.revenue)}</span>
            </div>

            <div className="movie-page__row">
              <span className="movie-page__label">Режиссёр</span>
              <span className="movie-page__value">{movie.director ?? "—"}</span>
            </div>

            <div className="movie-page__row">
              <span className="movie-page__label">Актёры</span>
              <span className="movie-page__value">
                {movie.actors?.length ? movie.actors.join(", ") : "—"}
              </span>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};