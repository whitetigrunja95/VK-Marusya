import { MovieCard } from "../MovieCard/MovieCard";
import "./TopMovies.css";

const topMovies = [
  {
    id: 1,
    title: "Шерлок Холмс и доктор Ватсон",
    posterUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 2,
    title: "Фильм 2",
    posterUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 3,
    title: "Фильм 3",
    posterUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 4,
    title: "Фильм 4",
    posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 5,
    title: "Фильм 5",
    posterUrl: "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 6,
    title: "Фильм 6",
    posterUrl: "https://images.unsplash.com/photo-1505685296765-3a2736de412f?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 7,
    title: "Фильм 7",
    posterUrl: "https://images.unsplash.com/photo-1518932945647-7a1c969f8be2?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 8,
    title: "Фильм 8",
    posterUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 9,
    title: "Фильм 9",
    posterUrl: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 10,
    title: "Фильм 10",
    posterUrl: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=700&q=80",
  },
];

export const TopMovies = () => {
  return (
    <section className="top-movies">
      <h2 className="top-movies__title">Топ 10 фильмов</h2>

      <div className="top-movies__grid">
        {topMovies.map((movie, index) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            posterUrl={movie.posterUrl}
            rank={index + 1}
          />
        ))}
      </div>
    </section>
  );
};