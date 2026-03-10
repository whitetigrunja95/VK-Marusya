import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/icons/logo.svg";
import { AuthModal } from "../AuthModal/AuthModal";
import "./Header.css";

const CURRENT_USER_STORAGE_KEY = "marusya_current_user";

type CurrentUser = {
  email: string;
  firstName: string;
  lastName: string;
};

export const Header = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const rawCurrentUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);

    if (!rawCurrentUser) {
      return;
    }

    try {
      const parsedUser = JSON.parse(rawCurrentUser) as CurrentUser;
      setCurrentUser(parsedUser);
    } catch (error) {
      console.error(
        "Не удалось прочитать текущего пользователя из localStorage:",
        error
      );
    }
  }, []);

  const handleLoginSuccess = (userName: string) => {
    const rawCurrentUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);

    if (!rawCurrentUser) {
      setCurrentUser({
        email: "",
        firstName: userName,
        lastName: "",
      });
      return;
    }

    try {
      const parsedUser = JSON.parse(rawCurrentUser) as CurrentUser;
      setCurrentUser(parsedUser);
    } catch (error) {
      console.error(
        "Не удалось обновить текущего пользователя после входа:",
        error
      );
      setCurrentUser({
        email: "",
        firstName: userName,
        lastName: "",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    setCurrentUser(null);
  };

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

            {!currentUser ? (
              <button
                className="header__login"
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
              >
                Войти
              </button>
            ) : (
              <div className="header__user">
                <span className="header__user-name">{currentUser.firstName}</span>

                <button
                  className="header__logout"
                  type="button"
                  onClick={handleLogout}
                >
                  Выйти
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};