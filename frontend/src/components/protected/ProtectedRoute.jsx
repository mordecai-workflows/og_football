import React, { useMemo } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import FullScreenSpinner from "../fullscreenspinner/FullScreenSpinner";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({
  redirectTo = "/login",
  allowedRoles = [],
}) {
  const { user, loading } = useAuth();
  const location = useLocation();

  const isAuthorized = useMemo(() => {
    if (!user) return false;
    return allowedRoles.length === 0 || allowedRoles.includes(user.user_type);
  }, [user, allowedRoles]);

  if (loading) {
    return <FullScreenSpinner />;
  }

  if (!isAuthorized) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <Outlet />;
}
