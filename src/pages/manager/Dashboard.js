import React from "react";
import { Outlet } from "react-router-dom";
import ManagerSidebar from "../../layouts/sidebar/ManagerSideBar";

const Dashboard = () => {
  return (
    <div style={{ display: "flex", height: "100%" }}>
      <ManagerSidebar style={{ width: "250px", backgroundColor: "#f0f2f5" }} />
      <div style={{ flex: 1, overflow: "auto" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;