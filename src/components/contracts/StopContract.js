import {
  Button,
  Card,
  ConfigProvider,
  DatePicker,
  Form,
  message,
  Space,
} from "antd";
import React, { useEffect } from "react";
import apiClient from "../../services/apiClient";

import dayjs from "dayjs";
import viVN from "antd/locale/vi_VN";
dayjs.locale("vi");

const StopContract = ({ contract, refresh, close }) => {
  const [form] = Form.useForm();

  useEffect(() => {}, []);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log(values);

      // if (endDate == "curCycle")
      //   await apiClient.put("tenant/contracts/stopAtCycleEnd");
      // else await apiClient.put("tenant/contracts/stopAtNextCycleEnd");
      // message.success("Chấm dứt hợp đồng thành công!");
      // refresh();
      // close();
    } catch (error) {
      console.error("Save failed:", error);
      if (error?.message) message.error(error.message);
    }
  };

  return (
    <Card title="Kết thúc hợp đồng" style={{ width: "400px" }}>
      <div
        style={{ maxHeight: "70vh", overflowY: "auto", overflowX: "hidden" }}
      >
        <Form form={form} layout="vertical">
          <ConfigProvider locale={viVN}>
            <Form.Item
              name="endDate"
              label="Ngày kết thúc"
              rules={[
                { required: true, message: "Vui lòng chọn ngày kết thúc!" },
              ]}
            >
              <DatePicker format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item name="noteDate" label="Ngày khách thuê báo hủy">
              <DatePicker format="DD/MM/YYYY" />
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
  );
};

export default StopContract;
