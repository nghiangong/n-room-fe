import React, { useEffect } from "react";
import { Layout, Dropdown, Avatar, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";

const items = [
  {
    key: "/userInfo",
    label: "Thông tin cá nhân",
    icon: <UserOutlined />,
  },
  {
    key: "/changePassword",
    label: "Thay đổi mật khẩu",
    icon: <LockOutlined />,
  },
  {
    key: "/logout",
    label: "Đăng xuất",
    icon: <PoweroffOutlined />,
  },
];

const handleMenuClick = (e) => {
  message.info("Click on menu item.");
  console.log("click", e.key);
};

const Header = () => {
  useEffect(() => {
    //get thoong tin gnwuoi dung
  }, []);
  return (
    <Layout.Header>
      <div style={{ float: "right", marginRight: "20px", color: "white" }}>
        <Dropdown
          menu={{
            items,
            onClick: handleMenuClick,
          }}
        >
          <span style={{ cursor: "pointer" }}>
            <Avatar
              icon={<UserOutlined />}
              style={{
                backgroundColor: "#bdbdbd",
              }}
            />
            <span style={{ marginLeft: 8 }}>Nghĩa Nguyễn</span>
          </span>
        </Dropdown>
      </div>
    </Layout.Header>
  );
};

export default Header;
