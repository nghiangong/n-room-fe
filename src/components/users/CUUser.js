import { Button, Card, Form, Input, InputNumber, message, Space } from "antd";
import React, { useEffect } from "react";
import apiClient from "../../services/apiClient";
import { useAuth } from "../../context/AuthContext";

const titles = {
  CREATE_MEMBER: "Thêm thành viên",
  UPDATE_MEMBER: "Chỉnh sửa thông tin",
  UPDATE_MANAGER: "Thay đổi thông tin",
  UPDATE_TENANT: "Chỉnh sửa thông tin",
};

const CUUser = ({ user, refresh, close, mode = "CREATE_MEMBER" }) => {
  const { role } = useAuth();

  const [form] = Form.useForm();

  useEffect(() => {
    if (
      mode === "UPDATE_MANAGER" ||
      mode === "UPDATE_TENANT" ||
      mode === "UPDATE_MEMBER"
    ) {
      form.setFieldsValue(user || {});
    } else {
      form.resetFields();
    }
  }, [user, mode]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      switch (mode) {
        case "CREATE_MEMBER":
          await apiClient.post(`tenant/members`, values);
          message.success("Tạo mới thành công!");
          break;
        case "UPDATE_MEMBER":
          await apiClient.put(`tenant/members/${user.id}`, values);
          message.success("Lưu thành công!");
          break;
        case "UPDATE_MANAGER":
          await apiClient.put(`users`, values);
          message.success("Lưu thành công!");
          break;
        case "UPDATE_TENANT":
          await apiClient.put(`tenants/${user.id}`, values);
          message.success("Lưu thành công!");
          break;
        default:
          break;
      }
      refresh();
      close();
    } catch (error) {
      console.error("Save failed:", error);
      if (error?.message) message.error(error.message);
    }
  };

  return (
    <Card title={titles[mode]} style={{ width: "400px" }}>
      <div
        style={{ maxHeight: "70vh", overflowY: "auto", overflowX: "hidden" }}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="personalIdNumber"
            label="CCCD"
            rules={[
              { required: true, message: "Vui lòng nhập căn cước công dân!" },
              {
                pattern: /^\d{12}$/,
                message: "CCCD phải có đúng 12 chữ số!",
              },
            ]}
          >
            <Input maxLength={12} placeholder="Nhập căn cước công dân" />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^(\+84|0)\d{9,10}$/,
                message:
                  "Số điện thoại không hợp lệ! Vui lòng nhập số bắt đầu bằng +84 hoặc 0, gồm 9-10 chữ số.",
              },
            ]}
          >
            <Input
              style={{ width: "100%" }}
              maxLength={11}
              placeholder="Vui lòng nhập số điện thoại!"
            />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập tài khoản email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </div>
      <Space
        style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}
      >
        <Button onClick={close}>Hủy</Button>
        <Button type="primary" onClick={handleSave}>
          Lưu
        </Button>
      </Space>
    </Card>
  );
};

export default CUUser;
