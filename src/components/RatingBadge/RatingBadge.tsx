import "./RatingBadge.css";

type RatingBadgeProps = {
  rating?: number | null;
  className?: string;
};

const getRatingModifier = (rating?: number | null) => {
  if (typeof rating !== "number") {
    return "gray";
  }

  if (rating >= 8) {
    return "yellow";
  }

  if (rating >= 7) {
    return "green";
  }

  if (rating >= 5) {
    return "gray";
  }

  return "red";
};

export const RatingBadge = ({ rating, className = "" }: RatingBadgeProps) => {
  const modifier = getRatingModifier(rating);
  const value = typeof rating === "number" ? rating.toFixed(1) : "—";

  return (
    <span className={`rating-badge rating-badge--${modifier} ${className}`.trim()}>
      <span className="rating-badge__star">★</span>
      <span className="rating-badge__value">{value}</span>
    </span>
  );
};