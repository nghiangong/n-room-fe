import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    switch (role) {
      case "ROLE_MANAGER":
        navigate("/manager");
        break;
      case "ROLE_TENANT":
      case "ROLE_REP_TENANT":
        navigate("/tenant");
        break;
      case null: 
        navigate("/login");
        break;
      default:
        break;
    }
  }, []);
  return;
};
export default Home;
