import React from "react";
import { Card, Form, InputNumber, Radio, Table } from "antd";

const ElecCalc = ({ mode, form }) => {
  const havingElecIndex = Form.useWatch("havingElecIndex");
  if (!form.getFieldValue("elecCostByPeopleCount")) {
    form.setFieldValue("elecCostByPeopleCount", new Array(5).fill(null));
  }

  return (
    <>
      <Card title="Cách tính tiền điện" size="small">
        <Form.Item
          label="Công tơ điện riêng"
          name="havingElecIndex"
          layout="horizontal"
          style={{ margin: "10px 0 0 0" }}
          rules={[{ required: true, message: "Vui lòng chọn" }]}
        >
          <Radio.Group>
            <Radio value={true}>Có</Radio>
            <Radio value={false}>Không</Radio>
          </Radio.Group>
        </Form.Item>
        {havingElecIndex ? (
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
        ) : (
          <Table
            bordered
            dataSource={form.getFieldValue("elecCostByPeopleCount")}
            style={{ width: "max-content", margin: "10px 0 0 0" }}
            size="small"
            pagination={false}
            columns={[
              {
                title: "Phòng",
                key: "peopleCount",
                align: "right",
                width: "90px",
                render: (text, record, index) => index + 1 + " người",
              },
              {
                title: "Chi phí điện (1 tháng)",
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
          />
        )}
      </Card>
    </>
  );
};

export default ElecCalc;
