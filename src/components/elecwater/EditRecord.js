import { Button, Card, Form, Input, InputNumber, message } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import apiClient from "../../services/apiClient";

const EditRecord = ({ record, recordKey, close, refresh }) => {
  const [form] = Form.useForm();

  let log;
  console.log(recordKey);
  useEffect(() => {
    switch (recordKey) {
      case "elecPrev":
        log = record.elecs.prev;
        break;
      case "elecCur":
        log = record.elecs.cur;
        break;
      case "waterPrev":
        log = record.waters.prev;
        break;
      case "waterCur":
        log = record.waters.cur;
        break;
      default:
        break;
    }
    console.log("log = " + log);
    form.setFieldsValue({
      roomName: record.roomName,
      roomId: record.roomId,
      date: dayjs(log.date).format("DD/MM/YYYY"),
      value: log.value,
    });
  }, []);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log("Giá trị", values);
      switch (recordKey) {
        case "elecPrev":
        case "elecCur":
          await apiClient.put(`/elecRecords`, values);
          break;
        case "waterPrev":
        case "waterCur":
          await apiClient.put(`/waterRecords`, values);
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
    <Card title="Chỉnh sửa số công tơ">
      <Form
        form={form}
        layout="vertical"
        className="customForm"
        layout="horizontal"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item name="roomName" label="Tên phòng">
          <Input disabled />
        </Form.Item>
        <Form.Item name="roomId" hidden></Form.Item>
        <Form.Item name="date" label="Ngày ghi">
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="value"
          label="Số công tơ"
          rules={[{ required: true, message: "Vui lòng nhập số công tơ!" }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
      </Form>
      <div style={{ textAlign: "right", marginTop: "10px" }}>
        <Button onClick={() => close()} style={{ marginRight: 8 }}>
          Hủy
        </Button>
        <Button type="primary" onClick={() => handleSave()}>
          Lưu
        </Button>
      </div>
    </Card>
  );
};

export default EditRecord;
