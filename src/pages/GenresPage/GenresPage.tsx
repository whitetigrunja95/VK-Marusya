import { useEffect, useState } from "react";
import { getGenres } from "../../api/moviesApi";
import { GenreCard } from "../../components/GenreCard/GenreCard";
import { MainLayout } from "../../layouts/MainLayout";
import type { Genre } from "../../types/genre";
import { genreImages, getGenreTitle } from "../../utils/genreData";
import "./GenresPage.css";

export const GenresPage = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        setHasError(false);
        setIsLoading(true);

        await getGenres();

        const orderedGenres = [
          "drama",
          "comedy",
          "detective",
          "family",
          "history",
          "thriller",
          "fantasy",
          "adventure",
        ];

        const preparedGenres = orderedGenres.map((genre) => ({
          slug: genre,
          title: getGenreTitle(genre),
          image: genreImages[genre],
        }));

        setGenres(preparedGenres);
      } catch (error) {
        console.error("Не удалось загрузить жанры:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    void loadGenres();
  }, []);

  return (
    <MainLayout>
      <section className="genres-page">
        <h1 className="genres-page__title">Жанры фильмов</h1>

        {isLoading && (
          <p className="genres-page__message">Загрузка жанров...</p>
        )}

        {hasError && (
          <p className="genres-page__message">
            Не удалось загрузить список жанров.
          </p>
        )}

        {!isLoading && !hasError && (
          <div className="genres-page__grid">
            {genres.map((genre) => (
              <GenreCard
                key={genre.slug}
                slug={genre.slug}
                title={genre.title}
                image={genre.image}
              />
            ))}
          </div>
        )}
      </section>
    </MainLayout>
  );
};