import React, { useEffect, useState } from "react";
import { Layout, Dropdown, Avatar, message, Space, Button, Modal } from "antd";
import {
  UserOutlined,
  LockOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import { decodeToken } from "../../utils";
import "../../styles/headerStyles.scss";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";
import RUser from "../../components/users/RUser";
import ChangePassword from "../../components/users/ChangePassword";

const items = [
  {
    key: "userInfo",
    label: "Thông tin cá nhân",
    icon: <UserOutlined />,
    style: { color: "blue" },
  },
  {
    key: "changePassword",
    label: "Thay đổi mật khẩu",
    icon: <LockOutlined />,
    style: { color: "orange" },
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
  const [modalChildren, setModalChildren] = useState(null);

  const handleMenuClick = async (e) => {
    switch (e.key) {
      case "userInfo":
        const user = await apiClient.get("/users/my-info");
        setModalChildren(
          <RUser
            user={user}
            close={close}
            setModalChildren={setModalChildren}
          />
        );
        break;
      case "changePassword":
        setModalChildren(<ChangePassword close={close} />);
        break;
      case "logout":
        logout();
        break;
      default:
        break;
    }
  };

  const close = () => {
    setModalChildren(null);
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
      <Modal
        className="customModal"
        open={modalChildren}
        footer={null}
        centered
        onCancel={close}
        maskClosable={false}
        destroyOnClose
        width="max-Content"
      >
        {modalChildren}
      </Modal>
    </Layout.Header>
  );
};

export default Header;
