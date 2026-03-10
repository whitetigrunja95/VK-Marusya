import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTopMovies } from "../../api/moviesApi";
import type { Movie } from "../../types/movie";
import "./TopMovies.css";

export const TopMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadTopMovies = async () => {
    try {
      setHasError(false);
      setIsLoading(true);

      const topMovies = await getTopMovies();
      setMovies(topMovies.slice(0, 10));
    } catch (error) {
      console.error("Не удалось загрузить топ фильмов:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadTopMovies();
  }, []);

  if (isLoading) {
    return (
      <section className="top-movies">
        <h2 className="top-movies__title">Топ 10 фильмов</h2>
        <p className="top-movies__message">Загрузка фильмов...</p>
      </section>
    );
  }

  if (hasError) {
    return (
      <section className="top-movies">
        <h2 className="top-movies__title">Топ 10 фильмов</h2>
        <p className="top-movies__message">Не удалось загрузить список фильмов.</p>
      </section>
    );
  }

  return (
    <section className="top-movies">
      <h2 className="top-movies__title">Топ 10 фильмов</h2>

      <div className="top-movies__grid">
        {movies.map((movie, index) => (
          <Link
            className="top-movies__card"
            key={movie.id}
            to={`/movie/${movie.id}`}
          >
            <div className="top-movies__poster-wrapper">
              <img
                className="top-movies__poster"
                src={movie.posterUrl}
                alt={movie.title}
              />
              <span className="top-movies__rank">{index + 1}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};