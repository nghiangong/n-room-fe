import {
  Button,
  Card,
  ConfigProvider,
  DatePicker,
  message,
  Select,
} from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import viVN from "antd/locale/vi_VN";
import apiClient from "../../services/apiClient";

dayjs.locale("vi");

const CreateInvoice = ({ houseNames, refresh, close }) => {
  const [houseId, setHouseId] = useState(null);
  const [date, setDate] = useState(dayjs().endOf("month"));

  const handleSave = async () => {
    try {
      await await apiClient.post(
        `/invoices?houseId=${houseId}&date=${date.format("YYYY-MM-DD")}`
      );
      message.info("Tạo hóa đơn thành công!");
      refresh();
      close();
    } catch (error) {
      message.error(error.message);
      console.log("Tạo không thành công:", error.message);
    }
  };

  return (
    <>
      <Card
        title="Tạo hóa đơn mới"
        className="customCard"
        style={{ maxHeight: "70vh", width: 400 }}
      >
        <span>
          <span style={{ marginRight: 8 }}>Tòa nhà:</span>
          <Select
            style={{ width: 200 }}
            placeholder="Chọn tòa nhà"
            onChange={(value) => setHouseId(value)}
          >
            {houseNames.map((item, index) => (
              <Select.Option key={index} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </span>
        <span style={{ marginTop: 10 }}>
          <ConfigProvider locale={viVN}>
            <span style={{ marginRight: 8 }}>Tháng:</span>
            <DatePicker
              picker="month"
              value={date}
              onChange={(value) => {
                setDate(value);
                console.log(value);
              }}
              format="MM/YYYY"
            />
          </ConfigProvider>
        </span>
        <div style={{ textAlign: "right", marginTop: "10px" }}>
          <Button onClick={() => close()} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button type="primary" onClick={() => handleSave()}>
            Lưu
          </Button>
        </div>
      </Card>
    </>
  );
};

export default CreateInvoice;
