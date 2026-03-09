import "./HeroMovie.css";

export const HeroMovie = () => {
  return (
    <section className="hero">
      <div className="hero__content">

        <div className="hero__info">

          <span className="hero__rating">7.8</span>

          <h1 className="hero__title">
            Шерлок Холмс и доктор Ватсон: Знакомство
          </h1>

          <p className="hero__description">
            Увлекательная экранизация самого известного сыщика всех времён
          </p>

          <div className="hero__actions">

            <button className="hero__button hero__button--primary">
              Трейлер
            </button>

            <button className="hero__button hero__button--secondary">
              В избранное
            </button>

          </div>

        </div>

        <div className="hero__poster">
          <img
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba"
            alt="movie"
          />
        </div>

      </div>
    </section>
  );
};