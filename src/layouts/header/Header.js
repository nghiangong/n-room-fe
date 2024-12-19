import React, { useEffect, useState } from "react";
import { Layout, Dropdown, Avatar, message, Space, Button } from "antd";
import {
  UserOutlined,
  LockOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import { decodeToken } from "../../utils";
import "../../styles/headerStyles.scss";
import { useNavigate } from "react-router-dom";

const items = [
  {
    key: "userInfo",
    label: "Thông tin cá nhân",
    icon: <UserOutlined />,
    style: { color: "#1677ff" },
  },
  {
    key: "changePassword",
    label: "Thay đổi mật khẩu",
    icon: <LockOutlined />,
    style: { color: "#f2c967" },
  },
  {
    key: "logout",
    label: "Đăng xuất",
    icon: <PoweroffOutlined />,
  },
];

const Header = () => {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState(null);

  const handleMenuClick = (e) => {
    switch (e.key) {
      case "logout":
        logout();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (token) setFullName(decodeToken(token).fullName);
  }, [token]);

  return (
    <Layout.Header className="customHeader" color="#b6dddc">
      <Space align="center">
        <span className="logo">NRooM</span>
        <span className="appName">Quản lý phòng trọ</span>
      </Space>
      <span className="rightCorner">
        {token ? (
          <Dropdown
            menu={{
              items,
              onClick: handleMenuClick,
            }}
            className="user"
          >
            <span>
              <Avatar
                icon={<UserOutlined />}
                style={{
                  backgroundColor: "#bdbdbd",
                }}
              />
              <span style={{ marginLeft: 8 }}>{fullName}</span>
            </span>
          </Dropdown>
        ) : (
          <Space>
            <Button type="dashed" ghost onClick={() => navigate("/login")}>
              Đăng nhập
            </Button>
            <Button type="dashed" ghost onClick={() => navigate("/register")}>
              Đăng ký
            </Button>
          </Space>
        )}
      </span>
    </Layout.Header>
  );
};

export default Header;
