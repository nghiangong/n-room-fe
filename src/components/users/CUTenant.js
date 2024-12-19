import { Button, Card, Form, Input, InputNumber, message, Space } from "antd";
import React, { useEffect } from "react";
import apiClient from "../../services/apiClient";
import { useAuth } from "../../context/AuthContext";

const titles = {
  CREATE: "Thêm thành viên",
  UPDATE: "Chỉnh sửa thông tin",
};

const CUTenant = ({ tenant, refresh, close, mode = "CREATE" }) => {
  const { role } = useAuth();

  const [form] = Form.useForm();

  useEffect(() => {
    if (mode === "UPDATE") {
      form.setFieldsValue(tenant || {});
    } else {
      form.resetFields();
    }
  }, [tenant, mode]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (mode === "CREATE") {
        await apiClient.post(`tenant/members`, values);
        message.success("Tạo mới thành công!");
      } else {
        if (role == "ROLE_REP_TENANT")
          await apiClient.put(`tenant/members/${tenant.id}`, values);
        else await apiClient.post(`tenants/${tenant.id}`, values);
        message.success("Lưu thành công!");
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
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
              parser={(value) => value.replace(/\.\s?|(,*)/g, "")}
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

export default CUTenant;
