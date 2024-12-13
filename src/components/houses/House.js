import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, message, Card, Row, Col } from "antd";
import {
  provinceListApi,
  districtListApi,
  wardListApi,
} from "../../services/addressApi";
import "../../styles/formStyles.scss";
import apiClient from "../../services/apiClient";
import OtherFees from "../otherFee/OtherFees";
import ElecCalc from "./ElecCalc";
import WaterCalc from "./WaterCalc";

const { Option } = Select;

const titles = {
  CREATE: "Thêm mới tòa nhà",
  EDIT: "Chỉnh sửa tòa nhà",
  VIEW: "Thông tin tòa nhà",
};

const House = ({ houseDetail, refresh, close, mode = "CREATE" }) => {
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    if (mode === "EDIT") {
      form.setFieldsValue(houseDetail);
      provinceListApi().then((result) => {
        setProvinces(result);
      });

      houseDetail.province &&
        districtListApi(houseDetail.province).then((result) => {
          setDistricts(result);
        });

      houseDetail.district &&
        wardListApi(houseDetail.district).then((result) => {
          setWards(result);
        });
    } else if (mode === "VIEW") {
      form.setFieldsValue(houseDetail);
    } else if (mode === "CREATE") {
      provinceListApi().then((result) => {
        setProvinces(result);
      });
    }
  }, [houseDetail]);

  const handleValuesChange = async (changedValues) => {
    if (changedValues.province)
      districtListApi(changedValues.province).then((result) => {
        form.setFieldsValue({ district: null, ward: null });
        setDistricts(result);
      });

    if (changedValues.district)
      wardListApi(changedValues.district).then((result) => {
        form.setFieldsValue({ ward: null });
        setWards(result);
      });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log("Giá trị", values);

      if (mode === "CREATE") {
        await apiClient.post(`/houses`, values);
        message.success("Tạo mới thành công!");
      } else {
        await apiClient.put(`/houses/${houseDetail.id}`, values);
        message.success("Lưu thành công!");
      }

      refresh();
      close();
    } catch (info) {
      console.log("Xác nhận không thành công:", info);
    }
  };

  return (
    <Card title={titles[mode]} style={{ width: "700px" }}>
      <div
        style={{ maxHeight: "70vh", overflowY: "scroll", overflowX: "hidden" }}
      >
        <Form
          form={form}
          onValuesChange={handleValuesChange}
          layout="vertical"
          disabled={mode === "VIEW"}
          className="customForm"
        >
          <Row gutter={14}>
            <Col span={12}>
              <Form.Item
                label="Tên tòa nhà"
                name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên tòa nhà" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Địa chỉ"
                name="address"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tỉnh/Thành phố"
                name="province"
                rules={[
                  { required: true, message: "Vui lòng chọn tỉnh/thành phố" },
                ]}
              >
                <Select placeholder="Chọn tỉnh/thành phố">
                  {provinces.map((prov, index) => (
                    <Option key={index} value={prov}>
                      {prov}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Quận/Huyện"
                name="district"
                rules={[
                  { required: true, message: "Vui lòng chọn quận/huyện" },
                ]}
              >
                <Select placeholder="Chọn quận/huyện">
                  {districts.map((dist, index) => (
                    <Option key={index} value={dist}>
                      {dist}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Phường/Xã"
                name="ward"
                rules={[{ required: true, message: "Vui lòng chọn phường/xã" }]}
              >
                <Select placeholder="Chọn phường/xã">
                  {wards.map((ward, index) => (
                    <Option key={index} value={ward}>
                      {ward}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <OtherFees form={form} mode={mode} />
          <Row gutter={14} style={{ marginTop: "10px" }}>
            <Col span={12}>
              <ElecCalc form={form} />
            </Col>
            <Col span={12}>
              <WaterCalc form={form} />
            </Col>
          </Row>
        </Form>
      </div>
      {mode !== "VIEW" && (
        <div style={{ textAlign: "right", marginTop: "10px" }}>
          <Button onClick={() => close()} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button type="primary" onClick={() => handleSave()}>
            Lưu
          </Button>
        </div>
      )}
    </Card>
  );
};

export default House;
