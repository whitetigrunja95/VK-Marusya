import { Link } from "react-router-dom";
import "./GenreCard.css";

type GenreCardProps = {
  slug: string;
  title: string;
  image?: string;
};

export const GenreCard = ({ slug, title, image }: GenreCardProps) => {
  return (
    <Link className="genre-card" to={`/genres/${slug}`}>
      <div className="genre-card__image-wrapper">
        {image ? (
          <img className="genre-card__image" src={image} alt={title} />
        ) : (
          <div className="genre-card__placeholder">{title}</div>
        )}
      </div>

      <div className="genre-card__title">{title}</div>
    </Link>
  );
};