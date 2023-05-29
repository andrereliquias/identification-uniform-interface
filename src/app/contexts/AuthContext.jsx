import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import validateLogin from "../common/validateLogin";
import logout from "../common/logout";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    if (cookies.token) {
      validateLogin(cookies.token).then((isValid) => {
        setIsAuthenticated(isValid);
        if (!isValid) {
          logout();
        }
      });
    }
  }, [navigate, cookies]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
