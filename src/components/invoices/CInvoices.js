import {
  Button,
  Card,
  ConfigProvider,
  DatePicker,
  Form,
  message,
  Select,
  Space,
} from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import apiClient from "../../services/apiClient";

import viVN from "antd/locale/vi_VN";
import CreateInvoicesResponse from "./CreateInvoicesResponse";
dayjs.locale("vi");

const CreateInvoices = ({ houseNames, refresh, close, setModalChildren }) => {
  const [form] = Form.useForm();

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      values.month = values.month.format("YYYY-MM-DD");
      console.log(values);
      const response = await apiClient.post(`/invoices/house`, values);
      // message.success("Tạo hóa đơn thành công!");
      setModalChildren(<CreateInvoicesResponse response={response} />);
      refresh();
      // close();
    } catch (error) {
      if (error?.message) message.error(error.message);
      console.log("Tạo không thành công:", error.message);
    }
  };

  return (
    <>
      <Card
        title="Tạo hóa đơn"
        className="customCard"
        style={{ maxHeight: "70vh", width: 400 }}
      >
        <div
          style={{ maxHeight: "70vh", overflowY: "auto", overflowX: "hidden" }}
        >
          <Form form={form} layout="horizontal">
            <Form.Item
              name="houseId"
              label="Tòa nhà"
              rules={[{ required: true, message: "Vui lòng chọn!" }]}
            >
              <Select style={{ width: 200 }} placeholder="Chọn tòa nhà">
                {houseNames.map((item, index) => (
                  <Select.Option key={index} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <ConfigProvider locale={viVN}>
              <Form.Item
                name="month"
                label="Tháng"
                rules={[{ required: true, message: "Vui lòng chọn!" }]}
              >
                <DatePicker picker="month" format="MM/YYYY" />
              </Form.Item>
            </ConfigProvider>
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
    </>
  );
};

export default CreateInvoices;
