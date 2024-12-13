import React, { useEffect } from "react";
import { Button, Form, Input, message, Typography } from "antd";
import { useAuth } from "../context/AuthContext";
import apiClient from "../services/apiClient";

const { Title } = Typography;

const Login = () => {
  const { login, logout, role } = useAuth();

  useEffect(() => {
    // if (role) logout();
  }, []);

  const onFinish = async (values) => {
    console.log("Login values:", values);

    try {
      const res = await apiClient.post("/auth/login", values);
      login(res.token);
      message.success("Đăng nhập thành công!");
    } catch (error) {
      console.log(error);
      message.error("Tên người dùng hoặc mật khẩu không hợp lệ!");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "50px" }}>
      <Title level={2}>Đăng Nhập</Title>
      <Form name="login" onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
