import React from "react";
import { Outlet } from "react-router-dom";
import TenantSidebar from "../../layouts/sidebar/TenantSidebar";

const Dashboard = () => {
  return (
    <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
      <TenantSidebar />
      <div style={{ flex: 1, overflow: "auto" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
