import {
  Button,
  Card,
  ConfigProvider,
  DatePicker,
  Divider,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tooltip,
} from "antd";
import {
  CloseCircleOutlined,
  EditFilled,
  SearchOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import viVN from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import EditRecord from "../../components/elecwater/EditRecord";
import { roomStatus } from "../../statuses";
import { RoomTag } from "../../tags";

dayjs.locale("vi");
const { Search } = Input;

const isEdited = (date) => {
  const currentMonth = dayjs(); // Ngày hiện tại
  const lastMonth = dayjs().subtract(1, "month"); // Tháng trước

  return date.isSame(currentMonth, "month") || date.isSame(lastMonth, "month");
};

const ElecWater = () => {
  const [houseNames, setHouseNames] = useState([]);
  const [houseId, setHouseId] = useState(null);
  const [date, setDate] = useState(dayjs().endOf("month"));
  const [loading, setLoading] = useState(false);
  const [modalChildren, setModalChildren] = useState(null);
  const [records, setRecords] = useState([]);

  const handleEditClick = (record, recordKey) => {
    setModalChildren(
      <EditRecord
        record={record}
        recordKey={recordKey}
        close={close}
        refresh={refresh}
      />
    );
  };

  const columns = [
    {
      title: "Tên phòng",
      dataIndex: "roomName",
      key: "roomName",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <Search
            placeholder="Tìm kiếm tên"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onSearch={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
            suffix={
              <CloseCircleOutlined
                onClick={() => {
                  setSelectedKeys([]);
                  confirm();
                }}
                style={{
                  cursor: "pointer",
                  visibility: selectedKeys[0] ? "visible" : "hidden",
                }}
              />
            }
          />
        </div>
      ),
      filterIcon: <SearchOutlined />,
      onFilter: (value, record) =>
        record.roomName.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      fixed: "right",
      filters: Object.keys(roomStatus).map((key) => ({
        value: key,
        text: roomStatus[key].name,
      })),
      onFilter: (value, record) => record.status === value,
      render: (status) => <RoomTag status={status} />,
    },
    {
      title: `Số điện`,
      children: [
        {
          title: `Tháng ${date
            .subtract(1, "month")
            .endOf("month")
            .format("MM-YYYY")}`,
          dataIndex: ["elecs", "prev", "value"],
          align: "center",
          key: "elecPrev",
          render: (text, record) =>
            record?.elecs && (
              <>
                <span
                  style={{
                    display: "inline-block",
                    width: "50px",
                    textAlign: "right",
                  }}
                >
                  {text}
                </span>
                <Tooltip title="Chỉnh sửa">
                  <Button
                    shape="circle"
                    type="link"
                    icon={<EditFilled />}
                    onClick={() => handleEditClick(record, "elecPrev")}
                  />
                </Tooltip>
              </>
            ),
        },
        {
          title: `Tháng ${date.format("MM - YYYY")}`,
          dataIndex: ["elecs", "cur", "value"],
          align: "center",
          key: "elecCur",
          render: (text, record) =>
            record?.elecs && (
              <>
                <span
                  style={{
                    display: "inline-block",
                    width: "50px",
                    textAlign: "right",
                  }}
                >
                  {text}
                </span>
                <Tooltip title="Chỉnh sửa">
                  <Button
                    shape="circle"
                    type="link"
                    icon={<EditFilled />}
                    onClick={() => handleEditClick(record, "elecCur")}
                  />
                </Tooltip>
              </>
            ),
        },
      ],
    },
    {
      title: `Số nước`,
      children: [
        {
          title: `Tháng ${date
            .subtract(1, "month")
            .endOf("month")
            .format("MM-YYYY")}`,
          dataIndex: ["waters", "prev", "value"],
          align: "center",
          key: "waterPrev",
          render: (text, record) =>
            record?.waters && (
              <>
                <span
                  style={{
                    display: "inline-block",
                    width: "50px",
                    textAlign: "right",
                  }}
                >
                  {text}
                </span>
                <Tooltip title="Chỉnh sửa">
                  <Button
                    shape="circle"
                    type="link"
                    icon={<EditFilled />}
                    onClick={() => handleEditClick(record, "waterPrev")}
                  />
                </Tooltip>
              </>
            ),
        },
        {
          title: `Tháng ${date.format("MM - YYYY")}`,
          dataIndex: ["waters", "cur", "value"],
          key: "waterCur",
          align: "center",
          render: (text, record) =>
            record?.waters && (
              <>
                <span
                  style={{
                    display: "inline-block",
                    width: "50px",
                    textAlign: "right",
                  }}
                >
                  {text}
                </span>
                <Tooltip title="Chỉnh sửa">
                  <Button
                    shape="circle"
                    type="link"
                    icon={<EditFilled />}
                    onClick={() => handleEditClick(record, "waterCur")}
                  />
                </Tooltip>
              </>
            ),
        },
      ],
    },
  ];

  const fetchHouseNameList = async () => {
    try {
      const response = await apiClient.get("/houses/nameList");
      setHouseNames(response);
    } catch (error) {
      if (error?.message) message.error(error.message);
      console.error("Error fetching house name list:", error);
    }
  };

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/records`, {
        params: { houseId, date: date.format("YYYY-MM-DD") },
      });
      console.log(response);
      setRecords(response);
      return response;
    } catch (error) {
      console.error("Error fetching records:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHouseNameList();
  }, []);

  useEffect(() => {
    houseId && date && fetchRecords();
  }, [houseId, date]);

  const refresh = () => {
    houseId && date && fetchRecords();
  };

  const close = () => {
    setModalChildren(null);
  };

  return (
    <>
      <Card
        title={
          <Space direction="horizontal" size="middle" style={{ marginTop: 5 }}>
            <span>Số điện/nước</span>
            <Divider type="vertical" />

            <span>
              <span style={{ marginRight: 8 }}>Tòa nhà:</span>
              <Select
                style={{ width: 200 }}
                placeholder="Chọn tòa nhà"
                onChange={(value) => setHouseId(value)}
              >
                {houseNames.map((item, index) => (
                  <Select.Option key={index} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </span>
            <ConfigProvider locale={viVN}>
              <span style={{ marginRight: 8 }}>Tháng:</span>
              <DatePicker
                picker="month"
                value={date}
                onChange={(value) => {
                  setDate(value);
                  console.log(value);
                }}
                format="MM/YYYY"
              />
            </ConfigProvider>
          </Space>
        }
        className="customCard"
      >
        {houseId && date && (
          <Table
            className="customTable"
            columns={columns}
            bordered
            dataSource={records}
            loading={loading}
            pagination={false}
            scroll={{ y: true }}
            rowKey={(record) => record.roomId}
          />
        )}
      </Card>
      <Modal
        className="customModal"
        open={modalChildren}
        footer={null}
        centered
        onCancel={close}
        maskClosable={false}
        destroyOnClose
        width="max-Content"
      >
        {modalChildren}
      </Modal>
    </>
  );
};

export default ElecWater;
