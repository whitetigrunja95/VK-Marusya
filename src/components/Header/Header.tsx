import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/icons/logo.svg";
import { MenuIcon } from "../icons/MenuIcon";
import { SearchIcon } from "../icons/SearchIcon";
import { AccountIcon } from "../icons/AccountIcon";
import { searchMovies } from "../../api/moviesApi";
import { getProfile, logoutUser } from "../../api/authApi";
import type { Movie } from "../../types/movie";
import { AuthModal } from "../AuthModal/AuthModal";
import { RatingBadge } from "../RatingBadge/RatingBadge";
import "./Header.css";

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

const mapProfileToCurrentUser = (profile: {
  email: string;
  name: string;
  surname: string;
}) => {
  return {
    email: profile.email,
    firstName: profile.name,
    lastName: profile.surname,
  };
};

export const Header = () => {
  const navigate = useNavigate();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getProfile();

        if (!profile) {
          setCurrentUser(null);
          return;
        }

        setCurrentUser(mapProfileToCurrentUser(profile));
      } catch (error) {
        console.error("Не удалось получить профиль пользователя:", error);
        setCurrentUser(null);
      }
    };

    void loadProfile();
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 767) {
        setIsMobileSearchVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLoginSuccess = async () => {
    try {
      const profile = await getProfile();

      if (!profile) {
        setCurrentUser(null);
        return;
      }

      setCurrentUser(mapProfileToCurrentUser(profile));
    } catch (error) {
      console.error(
        "Не удалось обновить текущего пользователя после входа:",
        error
      );
      setCurrentUser(null);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
      navigate("/");
    } catch (error) {
      console.error("Не удалось выполнить выход:", error);
    }
  };

  const handleClearSearch = () => {
    setSearchValue("");
    setSearchResults([]);
    setIsSearchOpen(false);
  };

  const handleOpenMobileSearch = () => {
    setIsMobileSearchVisible(true);
  };

  const handleCloseMobileSearch = () => {
    setSearchValue("");
    setSearchResults([]);
    setIsSearchOpen(false);
    setIsSearchLoading(false);
    setIsMobileSearchVisible(false);
  };

  const handleMovieClick = (movieId: number) => {
    setSearchValue("");
    setSearchResults([]);
    setIsSearchOpen(false);
    setIsMobileSearchVisible(false);
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
                                <RatingBadge
                                  rating={
                                    typeof rating === "number" ? rating : null
                                  }
                                  className="header__search-rating"
                                />

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

          <div className="header__mobile-actions">
            <button
              className="header__mobile-button"
              type="button"
              aria-label="Открыть жанры"
              onClick={() => navigate("/genres")}
            >
              <MenuIcon className="header__mobile-icon" />
            </button>

            <button
              className="header__mobile-button"
              type="button"
              aria-label="Открыть поиск"
              onClick={handleOpenMobileSearch}
            >
              <SearchIcon className="header__mobile-icon" />
            </button>

            {!currentUser ? (
              <button
                className="header__mobile-button"
                type="button"
                aria-label="Войти в аккаунт"
                onClick={() => setIsAuthModalOpen(true)}
              >
                <AccountIcon className="header__mobile-icon" />
              </button>
            ) : (
              <Link
                className="header__mobile-button header__mobile-button--link"
                to="/account"
                aria-label="Открыть профиль"
              >
                <AccountIcon className="header__mobile-icon" />
              </Link>
            )}
          </div>

          {isMobileSearchVisible && (
            <div className="header__mobile-search-layer">
              <button
                className="header__mobile-search-overlay"
                type="button"
                aria-label="Закрыть поиск"
                onClick={handleCloseMobileSearch}
              />
              <div className="header__mobile-search">
                <div className="header__mobile-search-input-wrap">
                  <SearchIcon className="header__mobile-search-icon" />

                  <input
                    className="header__mobile-search-input"
                    type="text"
                    placeholder="Поиск"
                    value={searchValue}
                    autoFocus
                    onChange={(event) => setSearchValue(event.target.value)}
                  />

                  <button
                    className="header__mobile-search-close"
                    type="button"
                    aria-label="Закрыть поиск"
                    onClick={handleCloseMobileSearch}
                  >
                    ×
                  </button>
                </div>

                {isSearchOpen && (
                  <div className="header__mobile-search-dropdown">
                    {isSearchLoading ? (
                      <p className="header__mobile-search-message">Поиск...</p>
                    ) : searchResults.length > 0 ? (
                      <div className="header__mobile-search-list">
                        {searchResults.map((movie) => {
                          const rating =
                            movie.tmdbRating ?? movie.imdbRating ?? movie.rating;

                          return (
                            <button
                              className="header__mobile-search-item"
                              key={movie.id}
                              type="button"
                              onClick={() => handleMovieClick(movie.id)}
                            >
                              <div className="header__mobile-search-poster">
                                {movie.posterUrl ? (
                                  <img src={movie.posterUrl} alt={movie.title} />
                                ) : null}
                              </div>

                              <div className="header__mobile-search-card-info">
                                <div className="header__mobile-search-meta">
                                  <RatingBadge
                                    rating={
                                      typeof rating === "number" ? rating : null
                                    }
                                    className="header__mobile-search-rating"
                                  />

                                  <span className="header__mobile-search-meta-text">
                                    {movie.releaseYear ?? "—"}
                                  </span>

                                  <span className="header__mobile-search-meta-text">
                                    {movie.genres?.[0] ?? "жанр"}
                                  </span>
                                </div>

                                <span className="header__mobile-search-meta-text header__mobile-search-meta-text--runtime">
                                  {formatRuntime(movie.runtime)}
                                </span>

                                <span className="header__mobile-search-title">
                                  {movie.title}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="header__mobile-search-message">
                        Ничего не найдено
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
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