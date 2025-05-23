import React, { createContext, useContext, useState, useEffect } from "react";
import { decodeToken } from "../utils";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      setRole(decodeToken(token).scope);
    } else {
      setRole(null);
    }
  }, [token]);

  const login = (userToken) => {
    localStorage.setItem("token", userToken);
    setToken(userToken);
    navigate("/");
  };

  const logout = async () => {
    await axios.post("http://localhost:8080/auth/logout", token, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    localStorage.removeItem("token");
    setToken(null);
  };

  if (token && role == null) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ role, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
