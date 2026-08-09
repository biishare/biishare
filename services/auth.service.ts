import { AxiosError } from 'axios';

import { api } from '../lib/axios';
import type {
  LoginFormValues,
  RegisterFormValues,
} from '../lib/validations/auth';

export type CreatorStatus = 'none' | 'pending' | 'approved';

export type CreatorApplication = {
  workDescription: string;
  publicName: string;
  verificationCode?: string;
  verificationPhotoName?: string;
  submittedAt: string;
};

export type AuthUser = {
  id: string;
  name: string;
  username?: string;
  email: string;
  avatarUrl?: string;
  coverUrl?: string;
  creatorStatus?: CreatorStatus;
  isCreator?: boolean;
  creatorAppliedAt?: string;
  creatorApprovedAt?: string;
  creatorApplication?: CreatorApplication;
  nameUpdatedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  message: string;
  user: AuthUser;
};

const AUTH_USER_KEY = 'biishare_auth_user';
const LEGACY_AUTH_TOKEN_KEY = 'biishare_auth_token';
export const AUTH_SESSION_CHANGED_EVENT = 'biishare_auth_session_changed';

let cachedAuthUser: AuthUser | null = null;

function notifyAuthSessionChanged() {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new Event(AUTH_SESSION_CHANGED_EVENT));
}

function clearStoredAuthSession() {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(LEGACY_AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    return error.response?.data?.error || fallback;
  }

  return fallback;
}

export function saveAuthSession(data: AuthResponse) {
  cachedAuthUser = data.user;
  clearStoredAuthSession();
  notifyAuthSessionChanged();
}

export function saveAuthUser(user: AuthUser) {
  cachedAuthUser = user;
  clearStoredAuthSession();
  notifyAuthSessionChanged();
}

export function getAuthSession() {
  return cachedAuthUser ? { user: cachedAuthUser } : null;
}

export function clearAuthSession() {
  cachedAuthUser = null;
  clearStoredAuthSession();
  notifyAuthSessionChanged();
}

export async function loginUser(values: LoginFormValues) {
  const response = await api.post<AuthResponse>('/auth/login', values);
  return response.data;
}

export async function registerUser(values: RegisterFormValues) {
  const response = await api.post<AuthResponse>('/auth/register', values);
  return response.data;
}

export async function checkUsernameAvailability(username: string) {
  const response = await api.get<{ username: string; available: boolean }>(
    '/auth/username',
    {
      params: { username },
    }
  );

  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get<{ user: AuthUser }>('/auth/me');

  return response.data.user;
}

export async function logoutUser() {
  await api.post<{ message: string }>('/auth/logout');
}

export type CreatorApplicationValues = {
  publicName: string;
  workDescription: string;
  verificationCode: string;
  verificationPhoto: File;
  consentAccepted: boolean;
};

export async function applyCreatorApplication(values?: CreatorApplicationValues) {
  if (!values) {
    const response = await api.post<
      AuthResponse & { creatorStatus: CreatorStatus }
    >('/auth/creator-application');

    return response.data;
  }

  const formData = new FormData();
  formData.append('publicName', values.publicName);
  formData.append('workDescription', values.workDescription);
  formData.append('verificationCode', values.verificationCode);
  formData.append('verificationPhoto', values.verificationPhoto);
  formData.append('consentAccepted', String(values.consentAccepted));

  const response = await api.post<
    AuthResponse & { creatorStatus: CreatorStatus }
  >('/auth/creator-application', formData);

  return response.data;
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
    formData.append('avatar', avatar);
  }

  if (cover) {
    formData.append('cover', cover);
  }

  const response = await api.post<{ message: string; user: AuthUser }>(
    '/auth/profile-images',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
}
