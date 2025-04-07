import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLoadUserQuery } from '../../redux/features/api/apiSlice';
import { startTokenRefreshTimer, stopTokenRefreshTimer } from '../utils/apiClient';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state: any) => state.auth);

  useEffect(() => {
    // If user is authenticated, start the token refresh timer
    if (token) {
      startTokenRefreshTimer();
    }

    // Clean up timer when component unmounts
    return () => {
      stopTokenRefreshTimer();
    };
  }, [token]);

  return <>{children}</>;
};

export default AuthProvider; 