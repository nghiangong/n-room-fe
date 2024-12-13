import React, { createContext, useContext, useState, useEffect } from "react";

const decode = (token) =>
  JSON.parse(decodeURIComponent(escape(atob(token.split(".")[1]))));

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      setRole(decode(token).scope);
    }
  }, [token]);

  const login = (userToken) => {
    localStorage.setItem("token", userToken);
    setToken(userToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setRole(null);
    setToken(null);
  };

  if (token && role == null) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ role, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook để sử dụng AuthContext
export const useAuth = () => useContext(AuthContext);
