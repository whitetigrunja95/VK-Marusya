import { Link } from "react-router-dom";
import "./MovieCard.css";

type MovieCardProps = {
  id: number;
  title: string;
  posterUrl: string;
  rank?: number;
};

export const MovieCard = ({ id, title, posterUrl, rank }: MovieCardProps) => {
  return (
    <Link className="movie-card" to={`/movie/${id}`}>
      {typeof rank === "number" && <span className="movie-card__rank">{rank}</span>}

      <div className="movie-card__poster">
        <img src={posterUrl} alt={title} />
      </div>
    </Link>
  );
};