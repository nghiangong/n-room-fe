import React, { useEffect } from "react";
import { Button, Form, Input, message, Typography } from "antd";
import apiClient from "../services/apiClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const { Title } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const { logout, role } = useAuth();

  useEffect(() => {
    logout();
  });

  const onFinish = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error("Mật khẩu không khớp!");
      return;
    }

    try {
      console.log(values);
      await apiClient.post("/managers", values);
      message.success("Đăng ký thành công!");
      navigate("/login");
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "auto" }}>
      <Title level={2}>Đăng Ký</Title>
      <Form name="register" onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Tên đăng nhập"
          name="username"
          rules={[{ required: true, message: "Vui lòng nhập tên người dùng!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="CCCD"
          name="personalIdNumber"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số ID cá nhân!",
            },
            {
              pattern: /^\d{12}$/,
              message: "Số ID cá nhân phải có đúng 12 chữ số!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="phoneNumber"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            {
              pattern: /^(\+?[0-9]{10,15})$/,
              message: "Số điện thoại không hợp lệ!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            {
              type: "email",
              message: "Email không hợp lệ!",
            },
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
        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          rules={[{ required: true, message: "Vui lòng xác nhận mật khẩu!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
