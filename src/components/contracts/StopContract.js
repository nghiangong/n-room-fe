import {
  Button,
  Card,
  ConfigProvider,
  DatePicker,
  Descriptions,
  Form,
  message,
  Space,
} from "antd";
import React, { useEffect } from "react";
import apiClient from "../../services/apiClient";

import dayjs from "dayjs";
import viVN from "antd/locale/vi_VN";
import { ContractTag } from "../../tags";
dayjs.locale("vi");

const StopContract = ({ contractDetail, refresh, close }) => {
  const [form] = Form.useForm();

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
      key: "12",
      label: "Trạng thái",
      children: <ContractTag status={contractDetail?.status} />,
    },
  ];

  useEffect(() => {
    const { house, room, ...contract } = contractDetail;
    form.setFieldsValue({
      contractId: contract.id,
      endDate: contract.endDate ? dayjs(contract.endDate) : "",
    });
  }, []);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (values.endDate) values.endDate = values.endDate.format("YYYY-MM-DD");

      console.log(values);
      await apiClient.put(`/contracts/${contractDetail.id}/stop`, values);
      message.success("Chấm dứt hợp đồng thành công!");
      refresh();
      close();
    } catch (error) {
      console.error("Save failed:", error);
      if (error?.message) message.error(error.message);
    }
  };

  return (
    <Card title="Kết thúc hợp đồng" style={{ width: "350px" }}>
      <div
        style={{ maxHeight: "70vh", overflowY: "auto", overflowX: "hidden" }}
      >
        <div style={{ marginBottom: 16 }}>
          <Descriptions items={items} column={1} />
        </div>
        <Form form={form} layout="horizontal">
          <ConfigProvider locale={viVN}>
            <Form.Item name="contractId" hidden></Form.Item>
            <Form.Item
              name="endDate"
              label="Ngày kết thúc"
              rules={[
                { required: true, message: "Vui lòng chọn ngày kết thúc!" },
              ]}
            >
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
