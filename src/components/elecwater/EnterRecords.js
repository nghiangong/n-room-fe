import {
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  InputNumber,
  message,
  Table,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";

const titles = {
  ELEC: "Nhập số điện",
  WATER: "Nhập số nước",
};

const EnterRecords = ({ houseName, date, records, mode, refresh, close }) => {
  const [form] = Form.useForm();
  const [enterRecords, setEnterRecords] = useState([]);

  const columns = [
    {
      title: "Phòng",
      dataIndex: "roomName",
      key: "roomName",
      width: 100,
    },
    {
      title: "Số công tơ",
      key: "value",
      render: (_, __, index) => {
        return (
          <>
            <Form.Item name={[index, "roomId"]} hidden style={{ margin: 0 }} />
            <Form.Item
              name={[index, "value"]}
              rules={[{ required: true, message: "Vui lòng nhập số công tơ!" }]}
              style={{ margin: 0 }}
            >
              <InputNumber />
            </Form.Item>
          </>
        );
      },
    },
  ];
  useEffect(() => {
    const enterRecords = records
      .filter((record) => {
        if (mode == "ELEC" && record.elecs.cur.value) return false;
        if (mode == "WATER" && record.waters.cur.value) return false;
        return (
          record.status === "OCCUPIED" || record.status === "SOON_AVAILABLE"
        );
      })
      .map((record) => ({
        roomName: record.roomName,
        roomId: record.roomId,
      }));
    form.setFieldsValue({
      date: date.format("YYYY-MM-DD"),
      list: enterRecords,
    });
    console.log("form = ", form.getFieldsValue());
    setEnterRecords(enterRecords);
  }, []);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log("Giá trị", values);
      switch (mode) {
        case "ELEC":
          await apiClient.post(`/elecRecords`, values);
          break;
        case "WATER":
          await apiClient.post(`/waterRecords`, values);
          break;
        default:
          break;
      }
      message.success("Lưu thành công!");
      refresh();
      close();
    } catch (info) {
      console.log("Xác nhận không thành công:", info);
    }
  };

  return (
    <Card
      title={titles[mode]}
      className="customCard"
      style={{ maxHeight: "80vh", width: 400 }}
    >
      <Descriptions
        column={2}
        items={[
          { key: "1", label: "Tòa nhà", children: `${houseName}` },
          {
            key: "2",
            label: "Tháng",
            children: `${date.format("MM-YYYY")}`,
          },
        ]}
      />
      {enterRecords.length > 0 ? (
        <>
          <Form
            form={form}
            style={{
              flex: 1,
              overflow: "hidden",
              display: "flex",
              marginTop: 10,
              flexDirection: "column",
            }}
          >
            <Form.Item name="date" hidden>
              <Input />
            </Form.Item>
            <Form.List name="list">
              {(fields) => (
                <Table
                  className="customTable"
                  columns={columns}
                  bordered
                  dataSource={enterRecords}
                  pagination={false}
                  scroll={{ y: true }}
                  rowKey="roomId"
                />
              )}
            </Form.List>
          </Form>
          <div style={{ textAlign: "right", marginTop: "10px" }}>
            <Button onClick={() => close()} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" onClick={() => handleSave()}>
              Lưu
            </Button>
          </div>
        </>
      ) : (
        <Typography.Text style={{ color: "orange" }}>
          Không còn phòng nào đang thuê chưa được nhập số điện
        </Typography.Text>
      )}
    </Card>
  );
};

export default EnterRecords;
