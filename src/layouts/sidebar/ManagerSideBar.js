import React, { useEffect, useState } from "react";
import { HomeOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
// import {} from "../../asserts/icons";

const items = [
  {
    key: `/`,
    label: "Quản lý cho thuê",
    icon: <HomeOutlined />,
    children: [
      {
        key: "/houses",
        label: <Link to="houses">Quản lý tòa nhà</Link>,
      },
      {
        key: "/rooms",
        label: <Link to="rooms">Quản lý phòng</Link>,
      },
      {
        key: "/contracts",
        label: <Link to="contracts">Quản lý hợp đồng</Link>,
      },
      {
        key: "/tenants",
        label: <Link to="tenants">Quản lý khách hàng</Link>,
      },
      {
        key: "/invoices",
        label: <Link to="invoices">Quản lý hóa đơn</Link>,
      },
      {
        key: "/elecwater",
        label: <Link to="elecwater">Quản lý chốt điện nước</Link>,
      },
    ],
  },
];

const ManagerSidebar = () => {
  const location = useLocation();

  useEffect(() => {}, []);

  return (
    <div>
      <Menu
        style={{
          width: 256,
          height: "100%",
        }}
        mode="inline"
        items={items}
        selectedKeys={[location.pathname.replace(/^\/manager/, "")]}
        defaultOpenKeys={["/"]}
      />
    </div>
  );
};
export default ManagerSidebar;
