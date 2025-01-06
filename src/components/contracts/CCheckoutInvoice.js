import {
  Button,
  Card,
  Descriptions,
  Form,
  InputNumber,
  message,
  Radio,
  Space,
} from "antd";
import React, { useEffect } from "react";
import { ContractTag } from "../../tags";
import dayjs from "dayjs";
import apiClient from "../../services/apiClient";
import RInvoice from "../invoices/RInvoice";

const CCheckoutInvoice = ({
  contractDetail,
  refresh,
  close,
  setModalChildren,
}) => {
  const [form] = Form.useForm();
  const { house, room, repTenant, ...contract } = contractDetail;

  let items = [
    {
      key: "id",
      label: "Mã hợp đồng",
      children: <span>{contractDetail?.id}</span>,
    },
    {
      key: "1",
      label: "Tòa nhà",
      children: <span>{contractDetail?.house?.name}</span>,
    },
    {
      key: "2",
      label: "Phòng",
      children: <span>{contractDetail?.room?.name}</span>,
    },
    {
      key: "3",
      label: "Ngày bắt đầu",
      children: (
        <span>
          {contractDetail?.startDate
            ? dayjs(contractDetail.startDate).format("DD/MM/YYYY")
            : "-"}
        </span>
      ),
    },
    {
      key: "4",
      label: "Ngày kết thúc",
      children: (
        <span>
          {contractDetail?.endDate
            ? dayjs(contractDetail.endDate).format("DD/MM/YYYY")
            : "-"}
        </span>
      ),
    },
    {
      key: "12",
      label: "Trạng thái",
      children: <ContractTag status={contractDetail?.status} />,
    },
  ];

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
      const response = await apiClient.put(
        `/contracts/${contract.id}/checkoutInvoice`,
        values
      );
      message.success("Tạo thành công hóa đơn");
      setModalChildren(<RInvoice invoiceDetail={response} />);
      refresh();
      // close();
    } catch (error) {
      console.error("Save failed:", error);
      if (error?.message) message.error(error.message);
    }
  };
  return (
    <Card title="Tạo hóa đơn trả phòng" style={{ width: "350px" }}>
      <div
        style={{ maxHeight: "70vh", overflowY: "auto", overflowX: "hidden" }}
      >
        <div style={{ marginBottom: 16 }}>
          <Descriptions items={items} column={1} />
        </div>
        <Form form={form} layout="horizontal">
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
