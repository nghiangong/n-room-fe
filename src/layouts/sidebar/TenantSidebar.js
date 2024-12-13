import React, { Children, useEffect, useState } from "react";
import { UnorderedListOutlined } from "@ant-design/icons";
import { Menu, Space } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  ElectricityIcon,
  InvoiceIcon,
  RoomIcon,
  WaterIcon,
} from "../../asserts/icons";

const TenantSidebar = () => {
  const location = useLocation();

  useEffect(() => {}, []);

  const items = [
    {
      key: "room",
      label: <Link to="room">Phòng thuê</Link>,
      icon: <UnorderedListOutlined />,
    },
    {
      key: "contracts",
      label: <Link to="contracts">Hợp đồng</Link>,
      icon: <UnorderedListOutlined />,
    },
    {
      key: "invoices",
      label: <Link to="invoices">Hóa đơn</Link>,
      icon: <UnorderedListOutlined />,
    },
    {
      key: "records",
      label: <Link to="records">Số điện/nước</Link>,
      icon: <UnorderedListOutlined />,
    },
    {
      key: "members",
      label: <Link to="members">Thành viên</Link>,
      icon: <UnorderedListOutlined />,
    },
  ];

  const onClick = (e) => {
    console.log("click ", e);
  };
  return (
    <Space style={{ backgroundColor: "white" }}>
      <Menu
        onClick={onClick}
        mode="horizontal"
        items={items}
        selectedKeys={[location.pathname]}
      />
    </Space>
  );
};
export default TenantSidebar;
