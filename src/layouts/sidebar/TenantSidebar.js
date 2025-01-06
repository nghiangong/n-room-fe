import React, { Children, useEffect, useState } from "react";
import {
  DollarOutlined,
  HomeOutlined,
  SolutionOutlined,
  TeamOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
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
      key: "/room",
      label: <Link to="room">Phòng thuê</Link>,
      icon: <HomeOutlined />,
    },
    {
      key: "/contract",
      label: <Link to="contract">Hợp đồng</Link>,
      icon: <SolutionOutlined />,
    },
    {
      key: "/invoices",
      label: <Link to="invoices">Hóa đơn</Link>,
      icon: <DollarOutlined />,
    },
    // {
    //   key: "records",
    //   label: <Link to="records">Số điện/nước</Link>,
    //   icon: <UnorderedListOutlined />,
    // },
    {
      key: "/members",
      label: <Link to="members">Thành viên</Link>,
      icon: <TeamOutlined />,
    },
  ];

  const onClick = (e) => {
    console.log("click ", e);
  };
  return (
    <div>
      <Menu
        style={{
          width: 256,
          height: "100%",
        }}
        onClick={onClick}
        mode="inline"
        items={items}
        selectedKeys={[location.pathname.replace(/^\/tenant/, "")]}
      />
    </div>
  );
};
export default TenantSidebar;
