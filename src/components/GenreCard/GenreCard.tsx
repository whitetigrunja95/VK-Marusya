import { Link } from "react-router-dom";
import type { GenreImageSet } from "../../types/genre";
import "./GenreCard.css";

type GenreCardProps = {
  slug: string;
  title: string;
  image?: GenreImageSet;
};

export const GenreCard = ({ slug, title, image }: GenreCardProps) => {
  return (
    <Link className="genre-card" to={`/genres/${slug}`}>
      <div className="genre-card__image-wrapper">
        {image ? (
          <picture>
            <source
              media="(max-width: 768px)"
              srcSet={`${image.mobile} 1x, ${image.mobile2x} 2x`}
            />

            <img
              className="genre-card__image"
              src={image.desktop}
              srcSet={`${image.desktop} 1x, ${image.desktop2x} 2x`}
              alt={title}
            />
          </picture>
        ) : (
          <div className="genre-card__placeholder">{title}</div>
        )}
      </div>

      <div className="genre-card__title">{title}</div>
    </Link>
  );
};