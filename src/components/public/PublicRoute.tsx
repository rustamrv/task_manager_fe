import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@api/Store';
import { setInitialState, setPending } from '@api/AuthSlice';

interface PublicRouteProps {
  children: React.ReactNode;
  path: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children, path }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => {
    return state.auth.isAuthenticated;
  });
  const isPending = useSelector((state: RootState) => state.auth.isPending);

  console.log({
    isPending,
    isAuthenticated,
  });

  useEffect(() => {
    dispatch(setPending());
    dispatch(setInitialState());
  }, [dispatch]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
