// src/routes/GuestRoute.tsx
import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";

interface GuestRouteProps {
  children: JSX.Element;
}

const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token"); // Replace with your auth logic

  if (isAuthenticated) {
    return <Navigate to="/recipe" replace />;
  }

  return children;
};

export default GuestRoute;
