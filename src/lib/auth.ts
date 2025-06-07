import { cookies } from 'next/headers';

export const setAuthCookie = (token: string) => {
  document.cookie = `auth-token=${token}; path=/; max-age=86400`; // 24 hours
};

export const removeAuthCookie = () => {
  document.cookie = 'auth-token=; path=/; max-age=0';
};

export const isAuthenticated = () => {
  return document.cookie.includes('auth-token=');
}; 