import React from "react";
import {
  Table,
  Card,
  Button,
  Form,
  Input,
  Select,
  Tooltip,
  InputNumber,
} from "antd";
import { DeleteFilled, PlusOutlined } from "@ant-design/icons";

const UNIT_OPTIONS = [
  { value: "PER_ROOM", label: "1 phòng / tháng" },
  { value: "PER_PERSON", label: "1 người / tháng" },
  { value: "PER_BICYCLE", label: "1 xe đạp / tháng" },
  { value: "PER_MOTORBIKE", label: "1 xe máy / tháng" },
];

const OtherFees = ({ mode = "VIEW" }) => {
  return (
    <Card title="Dịch vụ" size="small">
      <Form.List name="otherFees">
        {(fields, { add, remove }) => (
          <>
            <Table
              rowKey="key"
              columns={[
                {
                  title: "Tên dịch vụ",
                  dataIndex: "name",
                  key: "name",
                  render: (_, __, index) => (
                    <Form.Item
                      name={[index, "name"]}
                      fieldKey={[index, "name"]}
                      style={{ margin: 0 }}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên dịch vụ",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập tên dịch vụ" />
                    </Form.Item>
                  ),
                },
                {
                  title: "Giá (VND)",
                  dataIndex: "price",
                  key: "price",
                  render: (_, __, index) => (
                    <Form.Item
                      name={[index, "price"]}
                      fieldKey={[index, "price"]}
                      style={{ margin: 0 }}
                      rules={[{ required: true, message: "Vui lòng nhập giá" }]}
                    >
                      <InputNumber
                        type="number"
                        style={{ width: "100%" }}
                        formatter={(value) =>
                          value
                            ? value.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                            : ""
                        }
                        parser={(value) => value.replace(/\.\s?|(,*)/g, "")}
                      />
                    </Form.Item>
                  ),
                },

                {
                  title: "Đơn vị",
                  dataIndex: "unit",
                  key: "unit",
                  render: (_, __, index) => (
                    <Form.Item
                      name={[index, "unit"]}
                      fieldKey={[index, "unit"]}
                      style={{ margin: 0 }}
                      rules={[
                        { required: true, message: "Vui lòng chọn đơn vị" },
                      ]}
                    >
                      <Select placeholder="Chọn đơn vị">
                        {UNIT_OPTIONS.map((option) => (
                          <Select.Option
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  ),
                },
                ...(mode !== "VIEW"
                  ? [
                      {
                        key: "actions",
                        render: (_, __, index) => (
                          <Tooltip title="Xóa">
                            <Button
                              danger
                              shape="circle"
                              icon={<DeleteFilled />}
                              onClick={() => remove(index)}
                            />
                          </Tooltip>
                        ),
                      },
                    ]
                  : []),
              ]}
              dataSource={fields.map((field, index) => ({
                ...field,
                key: index,
              }))}
              pagination={false}
              size="small"
              bordered
              footer={() =>
                mode !== "VIEW" && (
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Thêm dịch vụ
                  </Button>
                )
              }
            />
          </>
        )}
      </Form.List>
    </Card>
  );
};

export default OtherFees;
