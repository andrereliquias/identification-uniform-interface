import { useAuth } from "./app/contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? children : null;
};

export default PrivateRoute;
