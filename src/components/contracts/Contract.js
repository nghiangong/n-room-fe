import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
} from "antd";
import React, { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import dayjs from "dayjs";
import { configDate } from "../../utils";

const { Option } = Select;

const titles = {
  CREATE: "Thêm mới hợp đồng",
  UPDATE: "Chỉnh sửa hợp đồng",
};

const Contract = ({ contractDetail, houseNames, refresh, close, mode }) => {
  const [form] = Form.useForm();
  const [roomNames, setRoomNames] = useState([]);

  useEffect(() => {
    if (mode === "UPDATE") {
      const { house, room, repTenant, ...contract } = contractDetail;
      form.setFieldsValue({
        houseId: house.id,
        roomId: room.id,
        ...contract,
        startDate: contract.startDate ? dayjs(contract.startDate) : "",
        endDate: contract.endDate ? dayjs(contract.endDate) : "",
        repTenant,
      });
      fetchRoomNameList(house.id);
    }
  }, [contractDetail]);

  const fetchRoomNameList = async (houseId) => {
    try {
      const response = await apiClient.get(`/houses/${houseId}/roomNameList`);
      setRoomNames(response);
    } catch (error) {
      if (error?.message) message.error(error.message);
      console.error("Error fetching room name list:", error);
    }
  };

  const handleValuesChange = async (changedValues) => {
    if (changedValues.houseId) {
      fetchRoomNameList(changedValues.houseId);
      form.setFieldValue("roomId", null);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      values.startDate = values.startDate.format("YYYY-MM-DD");
      if (values.endDate) values.endDate = values.endDate.format("YYYY-MM-DD");

      if (mode === "CREATE") {
        await apiClient.post(`/contracts`, values);
        message.success("Tạo mới thành công!");
      } else {
        await apiClient.put(`/contracts/${contractDetail.id}`, values);
        message.success("Lưu thành công!");
      }
      refresh();
      close();
    } catch (error) {
      console.log("Xác nhận không thành công:", error);
      if (error?.message) message.error(error.message);
    }
  };

  return (
    <Card title={titles[mode]} style={{ width: "700px" }}>
      <div
        style={{ maxHeight: "70vh", overflowY: "auto", overflowX: "hidden" }}
      >
        <Form
          form={form}
          onValuesChange={handleValuesChange}
          disabled={mode === "VIEW"}
          layout="horizontal"
          className="customForm"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tòa nhà"
                name="houseId"
                rules={[{ required: true, message: "Vui lòng chọn tòa nhà" }]}
              >
                <Select placeholder="Chọn tòa nhà">
                  {houseNames.map((opt) => (
                    <Option key={opt.id} value={opt.id}>
                      {opt.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Phòng"
                name="roomId"
                rules={[{ required: true, message: "Vui lòng chọn phòng" }]}
              >
                <Select placeholder="Chọn phòng">
                  {roomNames.map((opt) => (
                    <Option key={opt.id} value={opt.id}>
                      {opt.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ngày bắt đầu"
                name="startDate"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày bắt đầu!" },
                ]}
              >
                <DatePicker format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ngày kết thúc" name="endDate">
                <DatePicker format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Giá thuê"
                name="rentPrice"
                rules={[{ required: true, message: "Vui lòng nhập giá thuê!" }]}
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
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tiền cọc"
                name="deposit"
                rules={[{ required: true, message: "Vui lòng nhập tiền cọc!" }]}
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
            </Col>
            <Col span={12}>
              <Form.Item
                label="Số người ở"
                name="numberOfPeople"
                rules={[
                  { required: true, message: "Vui lòng nhập số người ở!" },
                ]}
              >
                <InputNumber min={1} />
              </Form.Item>
            </Col>
            <Col span={12}></Col>
            <Col span={12}>
              <Form.Item label="Số xe đạp" name="numberOfBicycle">
                <InputNumber min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Số xe máy" name="numberOfMotorbike">
                <InputNumber min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Số điện đầu" name="startElecNumber">
                <InputNumber min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Số nước đầu" name="startWaterNumber">
                <InputNumber min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Số điện cuối" name="endElecNumber">
                <InputNumber min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Số nước cuối" name="endWaterNumber">
                <InputNumber min={0} />
              </Form.Item>
            </Col>
          </Row>
          {mode !== "UPDATE" && (
            <Row>
              <Card title="Khách thuê" style={{ width: "100%" }} size="small">
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="Họ tên"
                      name={["repTenant", "fullName"]}
                      rules={[
                        { required: true, message: "Vui lòng nhập họ tên!" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Số CMND"
                      name={["repTenant", "personalIdNumber"]}
                      rules={[
                        { required: true, message: "Vui lòng nhập số CMND!" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Số điện thoại"
                      name={["repTenant", "phoneNumber"]}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập số điện thoại!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Email"
                      name={["repTenant", "email"]}
                      rules={[
                        {
                          type: "email",
                          required: true,
                          message: "Email không hợp lệ!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Row>
          )}
        </Form>
      </div>

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

export default Contract;
