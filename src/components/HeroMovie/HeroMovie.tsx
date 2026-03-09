import heartIcon from "../../assets/icons/heart.svg";
import refreshIcon from "../../assets/icons/refresh.svg";
import "./HeroMovie.css";

export const HeroMovie = () => {
  return (
    <section className="hero-movie">
      <div className="hero-movie__content">
        <div className="hero-movie__info">
          <div className="hero-movie__meta">
            <span className="hero-movie__rating">7.8</span>
            <span className="hero-movie__meta-text">1979</span>
            <span className="hero-movie__meta-text">детектив</span>
            <span className="hero-movie__meta-text">1 ч 7 мин</span>
          </div>

          <h1 className="hero-movie__title">
            Шерлок Холмс и доктор
            <br />
            Ватсон: Знакомство
          </h1>

          <p className="hero-movie__description">
            Увлекательные приключения самого известного сыщика всех времён
          </p>

          <div className="hero-movie__actions">
            <button className="hero-movie__button hero-movie__button--primary" type="button">
              Трейлер
            </button>

            <button className="hero-movie__button hero-movie__button--secondary" type="button">
              О фильме
            </button>

            <button className="hero-movie__icon-button" type="button" aria-label="Добавить в избранное">
              <img src={heartIcon} alt="" />
            </button>

            <button className="hero-movie__icon-button" type="button" aria-label="Показать другой фильм">
              <img src={refreshIcon} alt="" />
            </button>
          </div>
        </div>

        <div className="hero-movie__poster">
          <img
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80"
            alt="Шерлок Холмс и доктор Ватсон: Знакомство"
          />
        </div>
      </div>
    </section>
  );
};