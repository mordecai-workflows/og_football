// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Spinner from './Spinner';

const ProtectedRoute = ({ redirectTo = '/login' }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const verifyUser = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/verify', {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Failed to verify');

        const data = await res.json();

        if (isMounted) {
          setAuthenticated(data.valid === true);
        }
      } catch (err) {
        console.error('Error verifying user:', err);
        if (isMounted) setAuthenticated(false);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    verifyUser();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <Spinner />;

  return authenticated ? <Outlet /> : <Navigate to={redirectTo} state={{ from: location }} replace />;
};

export default ProtectedRoute;
