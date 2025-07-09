import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

interface IAuthGuard {
  isPrivate: boolean;
}

export function AuthGuard({ isPrivate }: IAuthGuard) {
  const { signedIn } = useAuth();
  if (signedIn && !isPrivate) {
    return <Navigate to="/" replace />;
  }

  if (!signedIn && isPrivate) {
    return <Navigate to="/sign-in" />;
  }
  return <Outlet />;
}
