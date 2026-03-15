import { useEffect, useMemo, useState } from "react";
import refreshIcon from "../../assets/icons/refresh.svg";
import { getRandomMovie } from "../../api/moviesApi";
import { getProfile } from "../../api/authApi";
import type { Movie } from "../../types/movie";
import { TrailerModal } from "../TrailerModal/TrailerModal";
import { RatingBadge } from "../RatingBadge/RatingBadge";
import { HeartIcon } from "../icons/HeartIcon";
import { AuthModal } from "../AuthModal/AuthModal";
import "./HeroMovie.css";

type HeroMovieProps = {
  movie?: Movie;
  showRefreshButton?: boolean;
  showAboutButton?: boolean;
};

type CurrentUser = {
  email: string;
  firstName: string;
  lastName: string;
};

const FAVORITES_STORAGE_KEY = "marusya_favorites";

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

const getStoredFavorites = (): Movie[] => {
  const rawFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);

  if (!rawFavorites) {
    return [];
  }

  try {
    return JSON.parse(rawFavorites) as Movie[];
  } catch (error) {
    console.error("Не удалось прочитать избранные фильмы:", error);
    return [];
  }
};

const mapProfileToCurrentUser = (profile: {
  email: string;
  name: string;
  surname: string;
}) => {
  return {
    email: profile.email,
    firstName: profile.name,
    lastName: profile.surname,
  };
};

export const HeroMovie = ({
  movie: movieFromProps,
  showRefreshButton = true,
  showAboutButton = true,
}: HeroMovieProps) => {
  const [randomMovie, setRandomMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(!movieFromProps);
  const [hasError, setHasError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [, setCurrentUser] = useState<CurrentUser | null>(null);

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
    const loadProfile = async () => {
      try {
        const profile = await getProfile();

        if (!profile) {
          setCurrentUser(null);
          return;
        }

        setCurrentUser(mapProfileToCurrentUser(profile));
      } catch (error) {
        console.error("Не удалось получить профиль пользователя:", error);
        setCurrentUser(null);
      }
    };

    void loadProfile();
  }, []);

  useEffect(() => {
    if (movieFromProps) {
      setIsLoading(false);
      setHasError(false);
      return;
    }

    void loadRandomMovie();
  }, [movieFromProps]);

  useEffect(() => {
    if (!movie) {
      setIsFavorite(false);
      return;
    }

    const favorites = getStoredFavorites();
    const isMovieInFavorites = favorites.some(
      (favoriteMovie) => favoriteMovie.id === movie.id
    );

    setIsFavorite(isMovieInFavorites);
  }, [movie]);

  const handleToggleFavorite = async () => {
    if (!movie) {
      return;
    }

    try {
      const profile = await getProfile();

      if (!profile) {
        setCurrentUser(null);
        setIsAuthModalOpen(true);
        return;
      }

      setCurrentUser(mapProfileToCurrentUser(profile));

      const favorites = getStoredFavorites();
      const isMovieInFavorites = favorites.some(
        (favoriteMovie) => favoriteMovie.id === movie.id
      );

      if (isMovieInFavorites) {
        const updatedFavorites = favorites.filter(
          (favoriteMovie) => favoriteMovie.id !== movie.id
        );

        localStorage.setItem(
          FAVORITES_STORAGE_KEY,
          JSON.stringify(updatedFavorites)
        );
        setIsFavorite(false);
        return;
      }

      const updatedFavorites = [...favorites, movie];

      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updatedFavorites));
      setIsFavorite(true);
    } catch (error) {
      console.error("Не удалось проверить сессию пользователя:", error);
      setCurrentUser(null);
      setIsAuthModalOpen(true);
    }
  };

  const handleLoginSuccess = async () => {
    try {
      const profile = await getProfile();

      if (!profile) {
        setCurrentUser(null);
        return;
      }

      setCurrentUser(mapProfileToCurrentUser(profile));

      if (!movie) {
        return;
      }

      const favorites = getStoredFavorites();
      const isMovieInFavorites = favorites.some(
        (favoriteMovie) => favoriteMovie.id === movie.id
      );

      if (!isMovieInFavorites) {
        const updatedFavorites = [...favorites, movie];
        localStorage.setItem(
          FAVORITES_STORAGE_KEY,
          JSON.stringify(updatedFavorites)
        );
        setIsFavorite(true);
      }
    } catch (error) {
      console.error(
        "Не удалось обновить текущего пользователя после входа:",
        error
      );
      setCurrentUser(null);
    }
  };

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
      <>
        <section className="hero-movie">
          <div className="hero-movie__content">
            <div className="hero-movie__info">
              <p className="hero-movie__description">
                Не удалось загрузить фильм. Попробуй обновить страницу.
              </p>

              {!isExternalMovie && (
                <div
                  className={`hero-movie__actions${!showAboutButton && !showRefreshButton
                      ? " hero-movie__actions--movie-page"
                      : ""
                    }`}
                >
                  <button
                    className="hero-movie__button hero-movie__button--primary ui-button ui-button--primary"
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

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  const rating = movie.tmdbRating ?? movie.imdbRating ?? movie.rating;
  const description =
    movie.plot ?? movie.description ?? "Описание пока недоступно";
  const imageUrl = movie.backdropUrl ?? movie.posterUrl ?? "";

  return (
    <>
      <section className="hero-movie">
        <div className="hero-movie__content">
          <div className="hero-movie__info">
            <div className="hero-movie__meta">
              <RatingBadge rating={typeof rating === "number" ? rating : null} />

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

            <div
              className={`hero-movie__actions${!showAboutButton && !showRefreshButton
                  ? " hero-movie__actions--movie-page"
                  : ""
                }`}
            >
              {movie.trailerUrl && (
                <button
                  className="hero-movie__button hero-movie__button--primary ui-button ui-button--primary"
                  type="button"
                  onClick={() => setIsTrailerOpen(true)}
                >
                  Трейлер
                </button>
              )}

              {showAboutButton && (
                <a
                  className="hero-movie__button hero-movie__button--secondary hero-movie__link-button ui-button ui-button--secondary"
                  href="#about-movie"
                >
                  О фильме
                </a>
              )}

              <button
                className={`hero-movie__icon-button ui-icon-button${isFavorite ? " hero-movie__icon-button--active" : ""
                  }`}
                type="button"
                aria-label={
                  isFavorite ? "Удалить из избранного" : "Добавить в избранное"
                }
                onClick={handleToggleFavorite}
              >
                <HeartIcon
                  isFilled={isFavorite}
                  className="hero-movie__heart-icon"
                />
              </button>

              {showRefreshButton && !isExternalMovie && (
                <button
                  className="hero-movie__icon-button ui-icon-button"
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

      <TrailerModal
        isOpen={isTrailerOpen}
        trailerUrl={movie.trailerUrl}
        title={movie.title}
        onClose={() => setIsTrailerOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};