import { useAuth } from "@/store/authContext";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ element }: { element: ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? element : <Navigate to="/auth?login" />;
};
