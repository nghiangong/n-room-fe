import { Button, Card, Form, Input, InputNumber, message, Select } from "antd";
import React, { useState, useEffect } from "react";
import apiClient from "../../services/apiClient";

const { Option } = Select;

const titles = {
  CREATE: "Thêm mới phòng",
  UPDATE: "Chỉnh sửa phòng",
};

const CURoom = ({
  roomDetail,
  houseNames,
  refresh,
  close,
  mode = "CREATE",
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (mode === "EDIT") {
      form.setFieldsValue({
        houseId: roomDetail.house.id,
        name: roomDetail.name,
        price: roomDetail.price,
      });
    }
    console.log(form.getFieldsValue());
  }, [roomDetail]);
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log("Giá trị", values);

      if (mode === "CREATE") {
        await apiClient.post(`/rooms`, values);
        message.success("Tạo mới thành công!");
      } else {
        await apiClient.put(`/rooms/${roomDetail.id}`, values);
        message.success("Lưu thành công!");
      }

      refresh();
      close();
    } catch (info) {
      console.log("Xác nhận không thành công:", info);
    }
  };
  return (
    <Card title={titles[mode]}>
      <div
        style={{ maxHeight: "70vh", overflowY: "auto", overflowX: "hidden" }}
      >
        <Form
          form={form}
          layout="vertical"
          disabled={mode === "VIEW"}
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
            rules={[{ required: true, message: "Vui lòng chọn tòa nhà" }]}
          >
            <Select placeholder="Chọn tòa nhà">
              {houseNames.map((opt) => (
                <Option key={opt.id} value={opt.id}>
                  {opt.name}
                </Option>
              ))}
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
      {mode !== "VIEW" && (
        <div style={{ textAlign: "right", marginTop: "10px" }}>
          <Button onClick={() => close()} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button type="primary" onClick={() => handleSave()}>
            Lưu
          </Button>
        </div>
      )}
    </Card>
  );
};
export default CURoom;
