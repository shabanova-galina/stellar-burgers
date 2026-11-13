import { useSelector } from '@/services/store';
import { Preloader } from '@ui';
import { Navigate, useLocation, type Location } from 'react-router-dom';

import type React from 'react';

type TLocationState = {
  from?: Location;
};

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactNode;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children,
}: ProtectedRouteProps): React.JSX.Element => {
  const isAuthChecked = useSelector((state) => state.auth.isAuthChecked);
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && loggedIn) {
    const state = location.state as TLocationState | null;
    const from = state?.from ?? { pathname: '/' };

    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !loggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
