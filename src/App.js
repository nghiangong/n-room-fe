import { Layout } from "antd";

import React from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import { Content } from "antd/es/layout/layout";
import Header from "./layouts/header/Header";
import Register from "./pages/Register";
import ManagerDashboard from "./pages/manager/Dashboard";
import Houses from "./pages/manager/Houses";
import Rooms from "./pages/manager/Rooms";
import Invoices from "./pages/manager/Invoices";
import Test from "./pages/manager/Test";
import Contracts from "./pages/manager/Contracts";
import ElecWater from "./pages/manager/ElecWater";
import Tenants from "./pages/manager/Tenants";
import TenantDashboard from "./pages/tenant/Dashboard";
import TenantRoom from "./pages/tenant/Room";

const ProtectedRoute = () => {
  const { role } = useAuth();

  if (role == "ROLE_MANAGER") {
    return <ManagerDashboard />; // Chuyển hướng nếu không có quyền
  }
  if (role == "ROLE_TENANT") {
    return <TenantDashboard />; // Chuy
  }

  // return <Navigate to="/login" replace />; // Render nội dung nếu có quyền
};

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Layout style={{ height: "100vh" }}>
            <Header />
            <Content>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/manager" element={<ProtectedRoute />}>
                  <Route path="houses" element={<Houses />} />
                  <Route path="rooms" element={<Rooms />} />
                  <Route path="contracts" element={<Contracts />} />
                  <Route path="tenants" element={<Tenants />} />
                  <Route path="invoices" element={<Invoices />} />
                  <Route path="elecwater" element={<ElecWater />} />
                  <Route path="test" element={<Test />} />
                </Route>
                <Route path="tenant" element={<ProtectedRoute />}>
                  <Route path="room" element={<TenantRoom />} />
                </Route>
                <Route path="*" element={<div>404 Not Found</div>} />
              </Routes>
            </Content>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}
export default App;
