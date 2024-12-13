import React from "react";
import { Card, Form, InputNumber, Select } from "antd";

const { Option } = Select;

const formatCurrency = (value) =>
  value
    ? value.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
    : "";

const options = [
  {
    key: "Cách 1",
    name: "WC1",
    description:
      "Chi phí nước được tính dựa trên số nước tiêu thụ của phòng. Giá mỗi số nước là cố định.",
  },
  {
    key: "Cách 2",
    name: "WC2",
    description:
      "Chi phí nước được tính dựa trên số nước tiêu thụ của phòng. Giá mỗi số nước thay đổi theo số nước trung bình mỗi người sử dụng.",
  },
  {
    key: "Cách 3",
    name: "WC3",
    description:
      "Chi phí nước được tính dựa trên số nước tiêu thụ của phòng. Giá mỗi Số nước thay đổi theo chi phí nước của cả tòa nhà.",
  },
  {
    key: "Cách 4",
    name: "WC4",
    description:
      "Chi phí nước được tính dựa trên số người trong 1 phòng. Chi phí nước trên một người là cố định.",
  },
];

const WaterCalc = ({ mode = "VIEW", form }) => {
  const waterChargeCalc = Form.useWatch("waterChargeCalc");
  return (
    <>
      <Card title="Cách tính tiền nước" size="small">
        <div style={{ display: "flex" }}>
          <span>Mô tả: </span>
          <span style={{ flex: 1, marginLeft: "5px" }}>
            {options.find((opt) => opt.name == waterChargeCalc)?.description ||
              "N/A"}
          </span>
        </div>

        <Form.Item
          label="Cách tính"
          name="waterChargeCalc"
          layout="horizontal"
          style={{ margin: "10px 0 0 0" }}
          rules={[{ required: true, message: "Vui lòng chọn cách tính" }]}
        >
          <Select placeholder="Chọn loại tính điện">
            {options.map((opt) => (
              <Option key={opt.name} value={opt.name}>
                {opt.key}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {waterChargeCalc == "WC1" && (
          <Form.Item
            label="Giá 1 số nước"
            name="waterPricePerUnit"
            layout="horizontal"
            style={{ margin: "10px 0 0 0" }}
            rules={[
              { required: true, message: "Vui lòng nhập giá" },
              {
                type: "number",
                min: 0,
                message: "Giá phải lớn hơn hoặc bằng 0",
              },
            ]}
          >
            <InputNumber
              type="number"
              formatter={(value) =>
                value ? value.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""
              }
              parser={(value) => value.replace(/\.\s?|(,*)/g, "")}
            />
          </Form.Item>
        )}
        {waterChargeCalc == "WC4" && (
          <Form.Item
            label="Chi phí nước một người: "
            name="waterChargePerPerson"
            layout="horizontal"
            style={{ margin: "10px 0 0 0" }}
            rules={[
              { required: true, message: "Vui lòng nhập chi phí" },
              {
                type: "number",
                min: 0,
                message: "Chi phí phải lớn hơn hoặc bằng 0",
              },
            ]}
          >
            <InputNumber
              type="number"
              formatter={(value) =>
                value ? value.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""
              }
              parser={(value) => value.replace(/\.\s?|(,*)/g, "")}
            />
          </Form.Item>
        )}
      </Card>
    </>
  );
};

export default WaterCalc;
