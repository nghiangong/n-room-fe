import React from "react";
import { Card, Form, InputNumber, Radio, Select } from "antd";

const WaterCalc = ({ mode, form }) => {
  const havingWaterIndex = Form.useWatch("havingWaterIndex");
  return (
    <>
      <Card title="Cách tính tiền nước" size="small">
        <Form.Item
          label="Công tơ nước riêng"
          name="havingWaterIndex"
          layout="horizontal"
          style={{ margin: "10px 0 0 0" }}
          rules={[{ required: true, message: "Vui lòng chọn" }]}
        >
          <Radio.Group>
            <Radio value={true}>Có</Radio>
            <Radio value={false}>Không</Radio>
          </Radio.Group>
        </Form.Item>
        {havingWaterIndex ? (
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
        ) : (
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
