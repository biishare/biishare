import { AxiosError } from "axios";

import { api } from "../lib/axios";
import type {
  LoginFormValues,
  RegisterFormValues,
} from "../lib/validations/auth";

export type AuthUser = {
  id: string;
  name: string;
  username?: string;
  email: string;
  avatarUrl?: string;
  coverUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  message: string;
  user: AuthUser;
};

const AUTH_USER_KEY = "biishare_auth_user";
const LEGACY_AUTH_TOKEN_KEY = "biishare_auth_token";

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    return error.response?.data?.error || fallback;
  }

  return fallback;
}

export function saveAuthSession(data: AuthResponse) {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
  localStorage.removeItem(LEGACY_AUTH_TOKEN_KEY);
}

export function saveAuthUser(user: AuthUser) {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  localStorage.removeItem(LEGACY_AUTH_TOKEN_KEY);
}

export function getAuthSession() {
  const storedUser = localStorage.getItem(AUTH_USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return {
      user: JSON.parse(storedUser) as AuthUser,
    };
  } catch {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
}

export function clearAuthSession() {
  localStorage.removeItem(LEGACY_AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export async function loginUser(values: LoginFormValues) {
  const response = await api.post<AuthResponse>("/auth/login", values);
  return response.data;
}

export async function registerUser(values: RegisterFormValues) {
  const response = await api.post<AuthResponse>("/auth/register", values);
  return response.data;
}

export async function checkUsernameAvailability(username: string) {
  const response = await api.get<{ username: string; available: boolean }>(
    "/auth/username",
    {
      params: { username },
    }
  );

  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get<{ user: AuthUser }>("/auth/me");

  return response.data.user;
}

export async function logoutUser() {
  await api.post<{ message: string }>("/auth/logout");
}

export async function uploadProfileImages({
  avatar,
  cover,
}: {
  avatar?: File | null;
  cover?: File | null;
}) {
  const formData = new FormData();

  if (avatar) {
    formData.append("avatar", avatar);
  }

  if (cover) {
    formData.append("cover", cover);
  }

  const response = await api.post<{ message: string; user: AuthUser }>(
    "/auth/profile-images",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}
