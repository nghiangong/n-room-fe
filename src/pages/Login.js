import React, { useEffect } from "react";
import { Button, Form, Input, message, Typography } from "antd";
import { useAuth } from "../context/AuthContext";
import apiClient from "../services/apiClient";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const Login = () => {
  const { login, logout, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (role) navigate("/");
  }, []);

  const onFinish = async (values) => {
    console.log("Login values:", values);
    try {
      const res = await apiClient.post("/auth/login", values);
      login(res.token);
      message.success("Đăng nhập thành công!");
    } catch (error) {
      console.log(error);
      if (error?.message)
        message.error("Tên tài khoản hoặc mật khẩu không đúng!");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "50px" }}>
      <Title level={2}>Đăng Nhập</Title>
      <Form name="login" onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Tên tài khoản"
          name="username"
          rules={[
            { required: true, message: "Vui lòng nhập tên tài khoảnkhoản!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
