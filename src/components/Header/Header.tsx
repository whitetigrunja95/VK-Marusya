import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/icons/logo.svg";
import { searchMovies } from "../../api/moviesApi";
import type { Movie } from "../../types/movie";
import { AuthModal } from "../AuthModal/AuthModal";
import "./Header.css";

const CURRENT_USER_STORAGE_KEY = "marusya_current_user";

type CurrentUser = {
  email: string;
  firstName: string;
  lastName: string;
};

const formatRuntime = (minutes?: number) => {
  if (!minutes) {
    return "—";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} мин`;
  }

  return `${hours} ч ${remainingMinutes} мин`;
};

export const Header = () => {
  const navigate = useNavigate();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

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

  useEffect(() => {
    const trimmedValue = searchValue.trim();

    if (!trimmedValue) {
      setSearchResults([]);
      setIsSearchOpen(false);
      setIsSearchLoading(false);
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      try {
        setIsSearchLoading(true);

        const movies = await searchMovies(trimmedValue);
        setSearchResults(movies.slice(0, 5));
        setIsSearchOpen(true);
      } catch (error) {
        console.error("Не удалось выполнить поиск фильмов:", error);
        setSearchResults([]);
        setIsSearchOpen(false);
      } finally {
        setIsSearchLoading(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchValue]);

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

  const handleClearSearch = () => {
    setSearchValue("");
    setSearchResults([]);
    setIsSearchOpen(false);
  };

  const handleMovieClick = (movieId: number) => {
    setSearchValue("");
    setSearchResults([]);
    setIsSearchOpen(false);
    navigate(`/movie/${movieId}`);
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
            <div className="header__search-wrapper">
              <div className="header__search">
                <span className="header__search-icon">⌕</span>

                <input
                  className="header__search-input"
                  type="text"
                  placeholder="Поиск"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                />

                {searchValue && (
                  <button
                    className="header__search-clear"
                    type="button"
                    aria-label="Очистить поиск"
                    onClick={handleClearSearch}
                  >
                    ×
                  </button>
                )}
              </div>

              {isSearchOpen && (
                <div className="header__search-dropdown">
                  {isSearchLoading ? (
                    <p className="header__search-message">Поиск...</p>
                  ) : searchResults.length > 0 ? (
                    <div className="header__search-list">
                      {searchResults.map((movie) => {
                        const rating =
                          movie.tmdbRating ?? movie.imdbRating ?? movie.rating;

                        return (
                          <button
                            className="header__search-item"
                            key={movie.id}
                            type="button"
                            onClick={() => handleMovieClick(movie.id)}
                          >
                            <div className="header__search-poster">
                              {movie.posterUrl ? (
                                <img src={movie.posterUrl} alt={movie.title} />
                              ) : null}
                            </div>

                            <div className="header__search-info">
                              <div className="header__search-meta">
                                <span className="header__search-rating">
                                  ★ {typeof rating === "number" ? rating.toFixed(1) : "—"}
                                </span>

                                <span className="header__search-meta-text">
                                  {movie.releaseYear ?? "—"}
                                </span>

                                <span className="header__search-meta-text">
                                  {movie.genres?.[0] ?? "жанр"}
                                </span>

                                <span className="header__search-meta-text">
                                  {formatRuntime(movie.runtime)}
                                </span>
                              </div>

                              <span className="header__search-title">
                                {movie.title}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="header__search-message">Ничего не найдено</p>
                  )}
                </div>
              )}
            </div>

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
                <Link className="header__user-name" to="/account">
                  {currentUser.firstName}
                </Link>

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