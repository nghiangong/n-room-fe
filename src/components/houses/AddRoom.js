import { Button, Card, Form, Input, InputNumber, message, Select } from "antd";
import React, { useState, useEffect } from "react";
import apiClient from "../../services/apiClient";

const { Option } = Select;

const AddRoom = ({ houseDetail, close }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      houseId: houseDetail.id,
    });
  }, []);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log("Giá trị", values);
      await apiClient.post(`/rooms`, values);
      message.success("Tạo mới thành công!");
      close();
    } catch (info) {
      console.log("Xác nhận không thành công:", info);
    }
  };
  return (
    <Card title="Thêm phòng">
      <div
        style={{ maxHeight: "70vh", overflowY: "auto", overflowX: "hidden" }}
      >
        <Form
          form={form}
          layout="vertical"
          className="customForm"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
        >
          <Form.Item
            label="Tòa nhà"
            name="houseId"
            layout="horizontal"
            rules={[{ required: true, message: "Vui lòng chọn cách tính" }]}
          >
            <Select placeholder="Chọn tòa nhà" disabled>
              <Option key={houseDetail.id} value={houseDetail.id}>
                {houseDetail.name}
              </Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên phòng"
            layout="horizontal"
            rules={[{ required: true, message: "Vui lòng nhập tên phòng!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá thuê"
            layout="horizontal"
            rules={[{ required: true, message: "Vui lòng nhập giá thuê!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
              parser={(value) => value.replace(/\.\s?|(,*)/g, "")}
            />
          </Form.Item>
        </Form>
      </div>
      <div style={{ textAlign: "right", marginTop: "10px" }}>
        <Button onClick={() => close()} style={{ marginRight: 8 }}>
          Hủy
        </Button>
        <Button type="primary" onClick={() => handleSave()}>
          Lưu
        </Button>
      </div>
    </Card>
  );
};
export default AddRoom;
