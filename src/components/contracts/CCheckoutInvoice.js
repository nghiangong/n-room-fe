import { Button, Card, Form, InputNumber, message, Radio, Space } from "antd";
import React, { useEffect } from "react";

const CCheckoutInvoice = ({ contractDetail, refresh, close }) => {
  const [form] = Form.useForm();

  const { house, room, repTenant, ...contract } = contractDetail;

  useEffect(() => {
    form.setFieldsValue({
      contractId: contract.id,
      ...contract,
    });
  }, []);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log(values);
    } catch (error) {
      console.error("Save failed:", error);
      if (error?.message) message.error(error.message);
    }
  };
  return (
    <Card title="Tạo hóa đơn trả phòng" style={{ width: "400px" }}>
      <div
        style={{ maxHeight: "70vh", overflowY: "auto", overflowX: "hidden" }}
      >
        <Form form={form} layout="horizontal">
          <Form.Item name="contractId" hidden></Form.Item>
          <Form.Item
            name="refundType"
            label="Hoàn cọc"
            rules={[{ required: true, message: "Vui lòng chọn!" }]}
          >
            <Radio.Group>
              <Space direction="vertical" style={{ paddingTop: 6 }}>
                <Radio value="FULL">Toàn bộ</Radio>
                <Radio value="PARTIAL">Một phần</Radio>
                <Radio value="NO">Không hoàn</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
          {house?.havingElecIndex && (
            <Form.Item
              name="endElecNumber"
              label="Số điện cuối"
              rules={[{ required: true, message: "Vui lòng nhập!" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                min={0}
              />
            </Form.Item>
          )}
          {house?.havingWaterIndex && (
            <Form.Item
              name="endWaterNumber"
              label="Số nước cuối"
              rules={[{ required: true, message: "Vui lòng nhập!" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                min={0}
              />
            </Form.Item>
          )}
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
export default CCheckoutInvoice;
