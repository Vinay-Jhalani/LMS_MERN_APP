import { Loader } from "lucide-react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useSelector(
    (store) => store.auth
  );

  if (isLoading)
    return (
      <div className="w-[100vw] h-[100vh] flex items-center justify-center">
        <Loader className="w-[15%] h-[15%] animate-spin text-[#fdce4d]" />
      </div>
    );

  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export const AuthenticatedUser = ({ children }) => {
  const { isAuthenticated } = useSelector((store) => store.auth);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useSelector(
    (store) => store.auth
  );

  if (isLoading || user == null)
    return (
      <div className="w-[100vw] h-[100vh] flex items-center justify-center">
        <Loader className="w-[15%] h-[15%] animate-spin text-[#fdce4d]" />
      </div>
    );

  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== "instructor") {
    return <Navigate to="/" />;
  }

  return children;
};
