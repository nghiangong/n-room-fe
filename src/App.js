import { Layout } from "antd";

import React from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import { Content } from "antd/es/layout/layout";
import Header from "./layouts/header/Header";
import Register from "./pages/Register";
import Home from "./pages/Home";

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
import TenantContract from "./pages/tenant/Contract";
import TenantInvoices from "./pages/tenant/Invoices";
import TenantMembers from "./pages/tenant/Members";

const ProtectedRoute = () => {
  const { role } = useAuth();

  if (role == "ROLE_MANAGER") {
    return <ManagerDashboard />;
  }
  if (role == "ROLE_TENANT" || role == "ROLE_REP_TENANT") {
    return <TenantDashboard />;
  }

  // return <Navigate to="/login" replace />; // Render nội dung nếu có quyền
};

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
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
                  <Route path="contract" element={<TenantContract />} />
                  <Route path="invoices" element={<TenantInvoices />} />
                  <Route path="members" element={<TenantMembers />} />
                </Route>
                <Route path="*" element={<Home />} />
              </Routes>
            </Content>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}
export default App;
