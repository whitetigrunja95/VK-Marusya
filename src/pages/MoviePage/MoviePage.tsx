import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieById } from "../../api/moviesApi";
import { HeroMovie } from "../../components/HeroMovie/HeroMovie";
import { MainLayout } from "../../layouts/MainLayout";
import type { Movie } from "../../types/movie";
import "./MoviePage.css";

export const MoviePage = () => {
  const { id } = useParams<{ id: string }>();

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

        const movieFromApi = await getMovieById(id);
        setMovie(movieFromApi);
      } catch (error) {
        console.error("Не удалось загрузить фильм:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    void loadMovie();
  }, [id]);

  const hasAboutInfo = Boolean(
    movie?.language ||
      movie?.budget ||
      movie?.revenue ||
      movie?.director ||
      (movie?.actors && movie.actors.length > 0)
  );

  return (
    <MainLayout>
      <section className="movie-page">
        {isLoading && (
          <p className="movie-page__message">Загрузка фильма...</p>
        )}

        {hasError && (
          <p className="movie-page__message">Не удалось загрузить фильм.</p>
        )}

        {!isLoading && !hasError && movie && (
          <>
            <HeroMovie
              movie={movie}
              showRefreshButton={false}
              showAboutButton={false}
            />

            {hasAboutInfo && (
              <section className="movie-about" id="about-movie">
                <h2 className="movie-about__title">О фильме</h2>

                <div className="movie-about__list">
                  {movie.language && (
                    <div className="movie-about__row">
                      <span className="movie-about__label">Язык оригинала</span>
                      <span className="movie-about__dots" />
                      <span className="movie-about__value">{movie.language}</span>
                    </div>
                  )}

                  {movie.budget && (
                    <div className="movie-about__row">
                      <span className="movie-about__label">Бюджет</span>
                      <span className="movie-about__dots" />
                      <span className="movie-about__value">{movie.budget}</span>
                    </div>
                  )}

                  {movie.revenue && (
                    <div className="movie-about__row">
                      <span className="movie-about__label">Выручка</span>
                      <span className="movie-about__dots" />
                      <span className="movie-about__value">{movie.revenue}</span>
                    </div>
                  )}

                  {movie.director && (
                    <div className="movie-about__row">
                      <span className="movie-about__label">Режиссёр</span>
                      <span className="movie-about__dots" />
                      <span className="movie-about__value">{movie.director}</span>
                    </div>
                  )}

                  {movie.actors && movie.actors.length > 0 && (
                    <div className="movie-about__row movie-about__row--top">
                      <span className="movie-about__label">Актёры</span>
                      <span className="movie-about__dots" />
                      <span className="movie-about__value">
                        {movie.actors.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </section>
            )}
          </>
        )}
      </section>
    </MainLayout>
  );
};