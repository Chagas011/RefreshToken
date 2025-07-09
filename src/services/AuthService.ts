import { httpClient } from './httpClient';

interface ISignInDTO {
  email: string;
  password: string;
}

interface ISignUpDTO {
  email: string;
  password: string;
  name: string;
}

interface ISignInResponse {
  accessToken: string;
  refreshToken: string;
}

export function AuthService() {
  const signIn = async ({ email, password }: ISignInDTO) => {
    const { data } = await httpClient.post<ISignInResponse>('/signin', {
      email,
      password,
    });

    return data;
  };

  const refreshToken = async (refreshToken: string) => {
    const { data } = await httpClient.post<ISignInResponse>('/refresh-token', {
      refreshToken,
    });

    return data;
  };
  const signUp = async ({ email, password, name }: ISignUpDTO) => {
    const { data } = await httpClient.post('/signup', {
      email,
      password,
      name,
    });
    return data;
  };

  return {
    signIn,
    signUp,
    refreshToken,
  };
}
