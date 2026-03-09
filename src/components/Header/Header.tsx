import { Link, NavLink } from "react-router-dom";
import "./Header.css";

export const Header = () => {
  return (
    <header className="header">
      <div className="header__container">
        <Link className="header__logo" to="/">
          <span className="header__logo-dot" />
          <span className="header__logo-text">маруся</span>
        </Link>

        <nav className="header__nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "header__link header__link--active" : "header__link"
            }
          >
            Главная
          </NavLink>

          <NavLink
            to="/genres"
            className={({ isActive }) =>
              isActive ? "header__link header__link--active" : "header__link"
            }
          >
            Жанры
          </NavLink>
        </nav>

        <div className="header__actions">
          <button className="header__search" type="button" aria-label="Поиск">
            <span className="header__search-icon">⌕</span>
            <span className="header__search-text">Поиск</span>
          </button>

          <button className="header__login" type="button">
            Войти
          </button>
        </div>
      </div>
    </header>
  );
};