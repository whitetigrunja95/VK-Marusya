import { useEffect, useState } from "react";
import logoAuth from "../../assets/icons/logo-auth.svg";
import mailIcon from "../../assets/icons/mail.svg";
import accountIcon from "../../assets/icons/account.svg";
import keyIcon from "../../assets/icons/key.svg";
import { loginUser, registerUser } from "../../api/authApi";
import "./AuthModal.css";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userName: string) => void;
};

type AuthView = "login" | "register" | "success";

type LoginErrors = {
  email?: boolean;
  password?: boolean;
  credentials?: boolean;
};

type RegisterErrors = {
  email?: boolean;
  firstName?: boolean;
  lastName?: boolean;
  password?: boolean;
  confirmPassword?: boolean;
  emailExists?: boolean;
};

export const AuthModal = ({
  isOpen,
  onClose,
  onLoginSuccess,
}: AuthModalProps) => {
  const [view, setView] = useState<AuthView>("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState<LoginErrors>({});

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerFirstName, setRegisterFirstName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerErrors, setRegisterErrors] = useState<RegisterErrors>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setView("login");

      setLoginEmail("");
      setLoginPassword("");
      setLoginErrors({});

      setRegisterEmail("");
      setRegisterFirstName("");
      setRegisterLastName("");
      setRegisterPassword("");
      setRegisterConfirmPassword("");
      setRegisterErrors({});
      setIsSubmitting(false);
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const contentClassName = `auth-modal__content ${
    view === "success"
      ? "auth-modal__content--success"
      : view === "register"
      ? "auth-modal__content--register"
      : "auth-modal__content--login"
  }`;

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors: LoginErrors = {};

    if (!loginEmail.trim()) {
      errors.email = true;
    }

    if (!loginPassword.trim()) {
      errors.password = true;
    }

    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      return;
    }

    try {
      setIsSubmitting(true);
      setLoginErrors({});

      await loginUser(loginEmail.trim(), loginPassword);
      onLoginSuccess(loginEmail.trim());
      onClose();
    } catch (error) {
      console.error("Ошибка авторизации:", error);
      setLoginErrors({ credentials: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const errors: RegisterErrors = {};

    if (!registerEmail.trim()) {
      errors.email = true;
    }

    if (!registerFirstName.trim()) {
      errors.firstName = true;
    }

    if (!registerLastName.trim()) {
      errors.lastName = true;
    }

    if (!registerPassword.trim()) {
      errors.password = true;
    }

    if (!registerConfirmPassword.trim()) {
      errors.confirmPassword = true;
    }

    if (
      registerPassword.trim() &&
      registerConfirmPassword.trim() &&
      registerPassword !== registerConfirmPassword
    ) {
      errors.password = true;
      errors.confirmPassword = true;
    }

    if (Object.keys(errors).length > 0) {
      setRegisterErrors(errors);
      return;
    }

    try {
      setIsSubmitting(true);
      setRegisterErrors({});

      await registerUser(
        registerEmail.trim(),
        registerPassword,
        registerFirstName.trim(),
        registerLastName.trim()
      );

      setView("success");
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      setRegisterErrors({ email: true, emailExists: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-modal">
      <button
        className="auth-modal__overlay"
        type="button"
        onClick={onClose}
        aria-label="Закрыть окно"
      />

      <div className={contentClassName} role="dialog" aria-modal="true">
        <button
          className="auth-modal__close"
          type="button"
          onClick={onClose}
          aria-label="Закрыть окно"
        >
          ×
        </button>

        <img className="auth-modal__logo" src={logoAuth} alt="Маруся" />

        {view === "login" && (
          <form className="auth-modal__form" onSubmit={handleLoginSubmit}>
            <div className="auth-modal__fields">
              <div
                className={`auth-modal__field ${
                  loginErrors.email ? "auth-modal__field--error" : ""
                }`}
              >
                <img className="auth-modal__icon" src={mailIcon} alt="" />
                <input
                  className="auth-modal__input"
                  type="email"
                  placeholder="Электронная почта"
                  value={loginEmail}
                  onChange={(event) => {
                    setLoginEmail(event.target.value);
                    setLoginErrors({});
                  }}
                />
              </div>

              <div
                className={`auth-modal__field ${
                  loginErrors.password ? "auth-modal__field--error" : ""
                }`}
              >
                <img className="auth-modal__icon" src={keyIcon} alt="" />
                <input
                  className="auth-modal__input"
                  type="password"
                  placeholder="Пароль"
                  value={loginPassword}
                  onChange={(event) => {
                    setLoginPassword(event.target.value);
                    setLoginErrors({});
                  }}
                />
              </div>
            </div>

            {loginErrors.credentials && (
              <p className="auth-modal__error-message">
                Неверная почта или пароль
              </p>
            )}

            <button className="auth-modal__submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Вход..." : "Войти"}
            </button>

            <button
              className="auth-modal__switch"
              type="button"
              onClick={() => {
                setLoginErrors({});
                setView("register");
              }}
            >
              Регистрация
            </button>
          </form>
        )}

        {view === "register" && (
          <form className="auth-modal__form" onSubmit={handleRegisterSubmit}>
            <h2 className="auth-modal__title">Регистрация</h2>

            <div className="auth-modal__fields">
              <div
                className={`auth-modal__field ${
                  registerErrors.email ? "auth-modal__field--error" : ""
                }`}
              >
                <img className="auth-modal__icon" src={mailIcon} alt="" />
                <input
                  className="auth-modal__input"
                  type="email"
                  placeholder="Электронная почта"
                  value={registerEmail}
                  onChange={(event) => {
                    setRegisterEmail(event.target.value);
                    setRegisterErrors({});
                  }}
                />
              </div>

              <div
                className={`auth-modal__field ${
                  registerErrors.firstName ? "auth-modal__field--error" : ""
                }`}
              >
                <img className="auth-modal__icon" src={accountIcon} alt="" />
                <input
                  className="auth-modal__input"
                  type="text"
                  placeholder="Имя"
                  value={registerFirstName}
                  onChange={(event) => {
                    setRegisterFirstName(event.target.value);
                    setRegisterErrors({});
                  }}
                />
              </div>

              <div
                className={`auth-modal__field ${
                  registerErrors.lastName ? "auth-modal__field--error" : ""
                }`}
              >
                <img className="auth-modal__icon" src={accountIcon} alt="" />
                <input
                  className="auth-modal__input"
                  type="text"
                  placeholder="Фамилия"
                  value={registerLastName}
                  onChange={(event) => {
                    setRegisterLastName(event.target.value);
                    setRegisterErrors({});
                  }}
                />
              </div>

              <div
                className={`auth-modal__field ${
                  registerErrors.password ? "auth-modal__field--error" : ""
                }`}
              >
                <img className="auth-modal__icon" src={keyIcon} alt="" />
                <input
                  className="auth-modal__input"
                  type="password"
                  placeholder="Пароль"
                  value={registerPassword}
                  onChange={(event) => {
                    setRegisterPassword(event.target.value);
                    setRegisterErrors({});
                  }}
                />
              </div>

              <div
                className={`auth-modal__field ${
                  registerErrors.confirmPassword
                    ? "auth-modal__field--error"
                    : ""
                }`}
              >
                <img className="auth-modal__icon" src={keyIcon} alt="" />
                <input
                  className="auth-modal__input"
                  type="password"
                  placeholder="Подтвердите пароль"
                  value={registerConfirmPassword}
                  onChange={(event) => {
                    setRegisterConfirmPassword(event.target.value);
                    setRegisterErrors({});
                  }}
                />
              </div>
            </div>

            {registerErrors.emailExists && (
              <p className="auth-modal__error-message">
                Пользователь с такой почтой уже существует
              </p>
            )}

            <button className="auth-modal__submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Создание..." : "Создать аккаунт"}
            </button>

            <button
              className="auth-modal__switch"
              type="button"
              onClick={() => {
                setRegisterErrors({});
                setView("login");
              }}
            >
              У меня есть пароль
            </button>
          </form>
        )}

        {view === "success" && (
          <div className="auth-modal__success">
            <h2 className="auth-modal__title">Регистрация завершена</h2>

            <p className="auth-modal__success-text">
              Используйте вашу электронную почту для входа
            </p>

            <button
              className="auth-modal__submit"
              type="button"
              onClick={() => setView("login")}
            >
              Войти
            </button>
          </div>
        )}
      </div>
    </div>
  );
};