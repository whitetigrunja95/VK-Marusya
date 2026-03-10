import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMoviesByGenre } from "../../api/moviesApi";
import { GenreMovieCard } from "../../components/GenreMovieCard/GenreMovieCard";
import { MainLayout } from "../../layouts/MainLayout";
import type { Movie } from "../../types/movie";
import { getGenreTitle } from "../../utils/genreData";
import "./GenreMoviesPage.css";

const MOVIES_PER_PAGE = 10;

const genreApiMap: Record<string, string> = {
  drama: "drama",
  comedy: "comedy",
  detective: "crime",
  family: "family",
  history: "history",
  thriller: "thriller",
  fantasy: "fantasy",
  adventure: "adventure",
};

export const GenreMoviesPage = () => {
  const { genre } = useParams<{ genre: string }>();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [visibleCount, setVisibleCount] = useState(MOVIES_PER_PAGE);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadMovies = async () => {
      if (!genre) {
        setHasError(true);
        setIsLoading(false);
        return;
      }

      try {
        setHasError(false);
        setIsLoading(true);

        const apiGenre = genreApiMap[genre] ?? genre;
        const moviesFromApi = await getMoviesByGenre(apiGenre);

        setMovies(moviesFromApi);
        setVisibleCount(MOVIES_PER_PAGE);
      } catch (error) {
        console.error("Не удалось загрузить фильмы жанра:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    void loadMovies();
  }, [genre]);

  const visibleMovies = movies.slice(0, visibleCount);
  const canShowMore = visibleCount < movies.length;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + MOVIES_PER_PAGE);
  };

  return (
    <MainLayout>
      <section className="genre-movies-page">
        <div className="genre-movies-page__header">
          <Link
            className="genre-movies-page__back"
            to="/genres"
            aria-label="Назад к жанрам"
          >
            ←
          </Link>

          <h1 className="genre-movies-page__title">
            {genre ? getGenreTitle(genre) : "Жанр"}
          </h1>
        </div>

        {isLoading && (
          <p className="genre-movies-page__message">Загрузка фильмов...</p>
        )}

        {hasError && (
          <p className="genre-movies-page__message">
            Не удалось загрузить фильмы этого жанра.
          </p>
        )}

        {!isLoading && !hasError && visibleMovies.length > 0 && (
          <>
            <div className="genre-movies-page__grid">
              {visibleMovies.map((movie) => (
                <GenreMovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {canShowMore && (
              <button
                className="genre-movies-page__more"
                type="button"
                onClick={handleShowMore}
              >
                Показать ещё
              </button>
            )}
          </>
        )}

        {!isLoading && !hasError && visibleMovies.length === 0 && (
          <p className="genre-movies-page__message">
            В этом жанре пока нет фильмов.
          </p>
        )}
      </section>
    </MainLayout>
  );
};