import { useEffect, useState } from "react";
import logoAuth from "../../assets/icons/logo-auth.svg";
import mailIcon from "../../assets/icons/mail.svg";
import accountIcon from "../../assets/icons/account.svg";
import keyIcon from "../../assets/icons/key.svg";
import "./AuthModal.css";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type AuthView = "login" | "register" | "success";

type LoginErrors = {
  email?: boolean;
  password?: boolean;
};

type RegisterErrors = {
  email?: boolean;
  firstName?: boolean;
  lastName?: boolean;
  password?: boolean;
  confirmPassword?: boolean;
};

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
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
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors: LoginErrors = {};

    if (!loginEmail.trim()) {
      errors.email = true;
    }

    if (!loginPassword.trim()) {
      errors.password = true;
    }

    setLoginErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    onClose();
  };

  const handleRegisterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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

    setRegisterErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setView("success");
  };

  return (
    <div className="auth-modal">
      <div className="auth-modal__overlay" onClick={onClose} />

      <div className="auth-modal__content" role="dialog" aria-modal="true">
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
                  className={`auth-modal__input ${
                    loginErrors.email ? "auth-modal__input--error" : ""
                  }`}
                  type="email"
                  placeholder="Электронная почта"
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                />
              </div>

              <div
                className={`auth-modal__field ${
                  loginErrors.password ? "auth-modal__field--error" : ""
                }`}
              >
                <img className="auth-modal__icon" src={keyIcon} alt="" />
                <input
                  className={`auth-modal__input ${
                    loginErrors.password ? "auth-modal__input--error" : ""
                  }`}
                  type="password"
                  placeholder="Пароль"
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                />
              </div>
            </div>

            <button className="auth-modal__submit" type="submit">
              Войти
            </button>

            <button
              className="auth-modal__switch"
              type="button"
              onClick={() => setView("register")}
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
                  className={`auth-modal__input ${
                    registerErrors.email ? "auth-modal__input--error" : ""
                  }`}
                  type="email"
                  placeholder="Электронная почта"
                  value={registerEmail}
                  onChange={(event) => setRegisterEmail(event.target.value)}
                />
              </div>

              <div
                className={`auth-modal__field ${
                  registerErrors.firstName ? "auth-modal__field--error" : ""
                }`}
              >
                <img className="auth-modal__icon" src={accountIcon} alt="" />
                <input
                  className={`auth-modal__input ${
                    registerErrors.firstName ? "auth-modal__input--error" : ""
                  }`}
                  type="text"
                  placeholder="Имя"
                  value={registerFirstName}
                  onChange={(event) => setRegisterFirstName(event.target.value)}
                />
              </div>

              <div
                className={`auth-modal__field ${
                  registerErrors.lastName ? "auth-modal__field--error" : ""
                }`}
              >
                <img className="auth-modal__icon" src={accountIcon} alt="" />
                <input
                  className={`auth-modal__input ${
                    registerErrors.lastName ? "auth-modal__input--error" : ""
                  }`}
                  type="text"
                  placeholder="Фамилия"
                  value={registerLastName}
                  onChange={(event) => setRegisterLastName(event.target.value)}
                />
              </div>

              <div
                className={`auth-modal__field ${
                  registerErrors.password ? "auth-modal__field--error" : ""
                }`}
              >
                <img className="auth-modal__icon" src={keyIcon} alt="" />
                <input
                  className={`auth-modal__input ${
                    registerErrors.password ? "auth-modal__input--error" : ""
                  }`}
                  type="password"
                  placeholder="Пароль"
                  value={registerPassword}
                  onChange={(event) => setRegisterPassword(event.target.value)}
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
                  className={`auth-modal__input ${
                    registerErrors.confirmPassword
                      ? "auth-modal__input--error"
                      : ""
                  }`}
                  type="password"
                  placeholder="Подтвердите пароль"
                  value={registerConfirmPassword}
                  onChange={(event) =>
                    setRegisterConfirmPassword(event.target.value)
                  }
                />
              </div>
            </div>

            <button className="auth-modal__submit" type="submit">
              Создать аккаунт
            </button>

            <button
              className="auth-modal__switch"
              type="button"
              onClick={() => setView("login")}
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