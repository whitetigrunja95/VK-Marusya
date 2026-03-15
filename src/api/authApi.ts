const API_BASE_URL = "https://cinemaguide.skillbox.cc";

type AuthResultResponse = {
  result: boolean;
};

export type ProfileResponse = {
  favorites: string[];
  surname: string;
  name: string;
  email: string;
};

const getFormBody = (params: Record<string, string>) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, value);
  });

  return searchParams.toString();
};

const getRequestOptions = (method: "GET" | "POST", body?: string): RequestInit => {
  return {
    method,
    credentials: "include",
    headers: {
      accept: "application/json",
      ...(body
        ? {
            "Content-Type": "application/x-www-form-urlencoded",
          }
        : {}),
    },
    ...(body ? { body } : {}),
  };
};

export const loginUser = async (email: string, password: string) => {
  const response = await fetch(
    `${API_BASE_URL}/auth/login`,
    getRequestOptions(
      "POST",
      getFormBody({
        email,
        password,
      })
    )
  );

  if (!response.ok) {
    throw new Error("Не удалось выполнить вход");
  }

  return (await response.json()) as AuthResultResponse;
};

export const registerUser = async (
  email: string,
  password: string,
  name: string,
  surname: string
) => {
  const response = await fetch(
    `${API_BASE_URL}/user`,
    getRequestOptions(
      "POST",
      getFormBody({
        email,
        password,
        name,
        surname,
      })
    )
  );

  if (!response.ok) {
    let errorMessage = "Не удалось зарегистрировать пользователя";

    try {
      const errorData = (await response.json()) as { error?: string };
      if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch {
      //
    }

    throw new Error(errorMessage);
  }

  return (await response.json()) as AuthResultResponse;
};

export const getProfile = async () => {
  const response = await fetch(
    `${API_BASE_URL}/profile`,
    getRequestOptions("GET")
  );

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Не удалось получить профиль пользователя");
  }

  return (await response.json()) as ProfileResponse;
};

export const logoutUser = async () => {
  const response = await fetch(
    `${API_BASE_URL}/auth/logout`,
    getRequestOptions("GET")
  );

  if (!response.ok) {
    throw new Error("Не удалось выполнить выход");
  }

  return (await response.json()) as AuthResultResponse;
};