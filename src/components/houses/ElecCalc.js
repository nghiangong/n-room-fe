import React from "react";
import { Card, Form, InputNumber, Select, Table } from "antd";

const { Option } = Select;

const formatCurrency = (value) =>
  value
    ? value.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
    : "";

const options = [
  {
    key: "Cách 1",
    name: "EC1",
    description:
      "Chi phí điện được tính dựa trên số người ở trong phòng và số ngày ở trong tháng",
  },
  {
    key: "Cách 2",
    name: "EC2",
    description:
      "Chi phí điện được tính dựa trên số điện tiêu thụ. Giá mỗi số điện là cố định.",
  },
  {
    key: "Cách 3",
    name: "EC3",
    description:
      "Chi phí điện được tính dựa trên số điện tiêu thụ. Giá mỗi số điện thay đổi theo chi phí điện của cả tòa nhà.",
  },
];

const ElecCalc = ({ mode = "VIEW", form }) => {
  const elecChargeCalc = Form.useWatch("elecChargeCalc");
  if (!form.getFieldValue("elecCostByPeopleCount")) {
    form.setFieldValue("elecCostByPeopleCount", new Array(5).fill(null));
  }

  return (
    <>
      <Card title="Cách tính tiền điện" size="small">
        <div style={{ display: "flex" }}>
          <span>Mô tả: </span>
          <span style={{ flex: 1, marginLeft: "5px" }}>
            {options.find((opt) => opt.name == elecChargeCalc)?.description ||
              "N/A"}
          </span>
        </div>

        <Form.Item
          label="Cách tính"
          name="elecChargeCalc"
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
        {elecChargeCalc == "EC1" && (
          <Table
            bordered
            dataSource={form.getFieldValue("elecCostByPeopleCount")}
            style={{ width: "max-content", margin: "10px 0 0 0" }}
            columns={[
              {
                title: "Phòng",
                key: "peopleCount",
                align: "right",
                width: "90px",
                render: (text, record, index) => index + 1 + " người",
              },
              {
                title: "Chi phí điện 1 tháng (VND)",
                key: "electricityCost",
                render: (text, record, index) => (
                  <Form.Item
                    name={["elecCostByPeopleCount", index]}
                    rules={[
                      { required: true, message: "Vui lòng nhập chi phí" },
                    ]}
                    style={{ margin: 0 }}
                  >
                    <InputNumber
                      type="number"
                      style={{ width: "100%" }}
                      formatter={(value) =>
                        value ? value.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""
                      }
                      parser={(value) => value.replace(/\.\s?|(,*)/g, "")}
                    />
                  </Form.Item>
                ),
              },
            ]}
            pagination={false}
          />
        )}
        {elecChargeCalc == "EC2" && (
          <Form.Item
            label="Giá 1 số điện"
            name="elecPricePerUnit"
            layout="horizontal"
            style={{ margin: "10px 0 0 0" }}
            rules={[{ required: true, message: "Vui lòng nhập giá" }]}
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

export default ElecCalc;
