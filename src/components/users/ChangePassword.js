import { Button, Card, Form, Input, message, Space } from "antd";
import apiClient from "../../services/apiClient";

const ChangePassword = ({ close }) => {
  const [form] = Form.useForm();

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log("values = ", values);
      if (values.newPassword !== values.confirmPassword) {
        message.error("Mật khẩu mới không khớp!");
        return;
      }
      if (values.endDate) values.endDate = values.endDate.format("YYYY-MM-DD");

      console.log(values);
      await apiClient.put("/users/changePassword", values);
      message.success("Đổi mật khẩu thành công!");
      close();
    } catch (error) {
      console.error("Save failed:", error);
      if (error?.message) message.error(error.message);
    }
  };

  return (
    <Card title="Đổi mật khẩu" style={{ width: "400px" }}>
      <div
        style={{ maxHeight: "70vh", overflowY: "auto", overflowX: "hidden" }}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{
            span: 10,
          }}
          wrapperCol={{
            span: 14,
          }}
        >
          <Form.Item
            label="Mật khẩu cũ"
            name="oldPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            rules={[{ required: true, message: "Vui lòng xác nhận mật khẩu!" }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
        <Space
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}
        >
          <Button onClick={close}>Hủy</Button>
          <Button type="primary" onClick={handleSave}>
            Lưu
          </Button>
        </Space>
      </div>
    </Card>
  );
};
export default ChangePassword;
