import { AuthService } from '@/services/AuthService';
import { httpClient } from '@/services/httpClient';
import { createContext, useCallback, useLayoutEffect, useState } from 'react';

interface IAuthContextValue {
  signedIn: boolean;
  signIn(email: string, password: string): Promise<void>;
  signOut(): void;
}

export const AuthContext = createContext({} as IAuthContextValue);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [signedIn, setSignedIn] = useState(() => {
    return !!localStorage.getItem('accessToken');
  });

  useLayoutEffect(() => {
    const interceptorId = httpClient.interceptors.request.use((config) => {
      const accessToken = localStorage.getItem('accessToken');

      if (accessToken) {
        config.headers.set('Authorization', `Bearer ${accessToken}`);
      }
      return config;
    });

    return () => {
      httpClient.interceptors.request.eject(interceptorId);
    };
  }, []);

  useLayoutEffect(() => {
    const interceptorId = httpClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const refreshToken = localStorage.getItem('refreshToken');
        const originalRequest = error.config;

        if (originalRequest.url === '/refresh-token') {
          setSignedIn(false);
          localStorage.clear();
          return Promise.reject(error);
        }

        if (
          (error.response && error.response.status !== 401) ||
          !refreshToken
        ) {
          return Promise.reject(error);
        }

        const { refreshToken: refreshTokenService } = AuthService();
        const response = await refreshTokenService(refreshToken);

        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('accessToken', response.accessToken);

        return httpClient(originalRequest);
      },
    );

    return () => {
      httpClient.interceptors.response.eject(interceptorId);
    };
  }, []);

  const { signIn: signInService } = AuthService();

  const signIn = useCallback(async (email: string, password: string) => {
    const { accessToken, refreshToken } = await signInService({
      email,
      password,
    });
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setSignedIn(true);
  }, []);

  const signOut = useCallback(async () => {
    localStorage.clear();
    setSignedIn(false);
  }, []);

  const value: IAuthContextValue = { signedIn, signIn, signOut };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
