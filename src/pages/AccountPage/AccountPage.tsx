import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import heartIcon from "../../assets/icons/heart.svg";
import accountIcon from "../../assets/icons/account.svg";
import mailIcon from "../../assets/icons/mail.svg";
import { getProfile, logoutUser } from "../../api/authApi";
import { MainLayout } from "../../layouts/MainLayout";
import type { Movie } from "../../types/movie";
import "./AccountPage.css";

type AccountTab = "favorites" | "settings";

type CurrentUser = {
  email: string;
  firstName: string;
  lastName: string;
};

const FAVORITES_STORAGE_KEY = "marusya_favorites";

const getStoredFavorites = (): Movie[] => {
  const rawFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);

  if (!rawFavorites) {
    return [];
  }

  try {
    return JSON.parse(rawFavorites) as Movie[];
  } catch (error) {
    console.error(
      "Не удалось прочитать избранные фильмы из localStorage:",
      error
    );
    return [];
  }
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

export const AccountPage = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<AccountTab>("favorites");
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getProfile();

        if (!profile) {
          setCurrentUser(null);
          navigate("/");
          return;
        }

        setCurrentUser(mapProfileToCurrentUser(profile));
      } catch (error) {
        console.error("Не удалось получить профиль пользователя:", error);
        setCurrentUser(null);
        navigate("/");
      }
    };

    void loadProfile();
    setFavorites(getStoredFavorites());
  }, [navigate]);

  useEffect(() => {
    const handleStorageUpdate = () => {
      setFavorites(getStoredFavorites());
    };

    window.addEventListener("storage", handleStorageUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, []);

  const initials = useMemo(() => {
    if (!currentUser) {
      return "";
    }

    const firstInitial = currentUser.firstName?.charAt(0) ?? "";
    const lastInitial = currentUser.lastName?.charAt(0) ?? "";

    return `${firstInitial}${lastInitial}`.toUpperCase();
  }, [currentUser]);

  const fullName = useMemo(() => {
    if (!currentUser) {
      return "";
    }

    return `${currentUser.firstName} ${currentUser.lastName}`.trim();
  }, [currentUser]);

  const handleRemoveFavorite = (movieId: number | string) => {
    const updatedFavorites = favorites.filter((movie) => movie.id !== movieId);

    setFavorites(updatedFavorites);
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updatedFavorites));
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

  return (
    <MainLayout>
      <section className="account-page">
        <h1 className="account-page__title">Мой аккаунт</h1>

        <div className="account-page__tabs">
          <button
            className={`account-page__tab ${
              activeTab === "favorites" ? "account-page__tab--active" : ""
            }`}
            type="button"
            onClick={() => setActiveTab("favorites")}
          >
            <img
              className="account-page__tab-icon-image"
              src={heartIcon}
              alt=""
              aria-hidden="true"
            />
            <span>Избранное</span>
          </button>

          <button
            className={`account-page__tab ${
              activeTab === "settings" ? "account-page__tab--active" : ""
            }`}
            type="button"
            onClick={() => setActiveTab("settings")}
          >
            <img
              className="account-page__tab-icon-image"
              src={accountIcon}
              alt=""
              aria-hidden="true"
            />
            <span>Настройки</span>
          </button>
        </div>

        {activeTab === "favorites" && (
          <div className="account-page__favorites">
            {favorites.length > 0 ? (
              <div className="account-page__favorites-grid">
                {favorites.map((movie) => (
                  <article className="account-page__movie-card" key={movie.id}>
                    <button
                      className="account-page__remove"
                      type="button"
                      aria-label="Удалить из избранного"
                      onClick={() => handleRemoveFavorite(movie.id)}
                    >
                      ×
                    </button>

                    <Link
                      className="account-page__movie-link"
                      to={`/movie/${movie.id}`}
                    >
                      {movie.posterUrl ? (
                        <img
                          className="account-page__movie-image"
                          src={movie.posterUrl}
                          alt={movie.title}
                        />
                      ) : (
                        <div className="account-page__movie-placeholder">
                          {movie.title}
                        </div>
                      )}
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <p className="account-page__message">
                У вас пока нет избранных фильмов.
              </p>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="account-page__settings">
            {currentUser ? (
              <>
                <div className="account-page__settings-item">
                  <div className="account-page__settings-icon account-page__settings-icon--avatar">
                    {initials}
                  </div>

                  <div className="account-page__settings-text">
                    <span className="account-page__settings-label">
                      Имя Фамилия
                    </span>
                    <span className="account-page__settings-value">
                      {fullName}
                    </span>
                  </div>
                </div>

                <div className="account-page__settings-item">
                  <div className="account-page__settings-icon">
                    <img src={mailIcon} alt="" />
                  </div>

                  <div className="account-page__settings-text">
                    <span className="account-page__settings-label">
                      Электронная почта
                    </span>
                    <span className="account-page__settings-value">
                      {currentUser.email}
                    </span>
                  </div>
                </div>

                <button
                  className="account-page__logout ui-button ui-button--primary"
                  type="button"
                  onClick={handleLogout}
                >
                  Выйти из аккаунта
                </button>
              </>
            ) : (
              <p className="account-page__message">
                Пользователь не авторизован.
              </p>
            )}
          </div>
        )}
      </section>
    </MainLayout>
  );
};