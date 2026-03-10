import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/icons/logo.svg";
import { AuthModal } from "../AuthModal/AuthModal";
import "./Header.css";

export const Header = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <header className="header">
        <div className="header__container">
          <Link className="header__logo" to="/">
            <img className="header__logo-image" src={logo} alt="Маруся" />
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

            <button
              className="header__login"
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Войти
            </button>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};