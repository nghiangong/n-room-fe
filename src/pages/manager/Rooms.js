import React, { useEffect, useState } from "react";
import { message, Table, Card, Button, Dropdown, Modal, Input } from "antd";
import {
  CloseCircleOutlined,
  EditOutlined,
  InfoCircleOutlined,
  MoreOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { RoomTag } from "../../tags";
import apiClient from "../../services/apiClient";
import "../../styles/tableStyles.scss";
import "../../styles/modalStyles.scss";
import "../../styles/cardStyles.scss";
import RoomEditor from "../../components/rooms/RoomEditor";
import { roomStatus } from "../../statuses";
import Room from "../../components/rooms/Room";

const { Search } = Input;

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [houseNames, setHouseNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalChildren, setModalChildren] = useState(null);

  const items = [
    {
      key: "detail",
      label: "Chi tiết phòng trọ",
      icon: <InfoCircleOutlined />,
    },
    { key: "edit", label: "Sửa phòng", icon: <EditOutlined /> },
  ];

  const handleActionClick = (actionKey, room) => {
    switch (actionKey) {
      case "detail":
        console.log("Xem chi tiết phòng:", room);
        setModalChildren(
          <Room roomDetail={room} close={close} refresh={refresh} />
        );
        break;
      case "edit":
        console.log("Sửa thông tin phòng:", room);
        setModalChildren(
          <RoomEditor
            roomDetail={room}
            houseNames={houseNames}
            refresh={refresh}
            close={close}
            mode="EDIT"
          />
        );
        break;
      default:
        console.log("Hành động không xác định:", actionKey, room);
    }
  };

  const columns = [
    { title: "Id", dataIndex: "id", key: "id", width: 50 },
    { title: "Trạng thái", dataIndex: "status", key: "status", width: "100"},
    {
      title: "Tòa nhà",
      dataIndex: ["house", "name"],
      key: "houseName",
      filters: houseNames.map((houseName) => ({
        value: houseName.name,
        text: houseName.name,
      })),
      filterMultiple: false,
      onFilter: (value, record) => record.house.name === value,
    },
    {
      title: "Tên phòng",
      dataIndex: "name",
      key: "name",
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
        record.name.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Giá ban đầu (VNĐ)",
      dataIndex: ["currentContract", "rentPrice"],
      render: (text, record) => `${record.price.toLocaleString("vi-VN")}`,
    },
    {
      title: "Giá thuê (VNĐ)",
      dataIndex: ["currentContract", "rentPrice"],
      render: (text, record) =>
        record.currentContract?.rentPrice.toLocaleString("vi-VN") || "",
    },
    {
      title: "Số người",
      dataIndex: ["currentContract", "numberOfPeople"],
      key: "numberOfPeople",
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
      title: "Thao tác",
      dataIndex: "",
      key: "action",
      width: 100,
      fixed: "right",
      align: "center",
      render: (text, record) => (
        <Dropdown
          menu={{
            items,
            onClick: ({ key }) => handleActionClick(key, record),
          }}
          placement="bottomLeft"
        >
          <MoreOutlined
            style={{ cursor: "pointer", fontSize: "20px", color: "#08c" }}
          />
        </Dropdown>
      ),
    },
  ];

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/rooms");
      setRooms(response);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách phòng!");
      console.error("Error fetching room list:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHouseNameList = async () => {
    try {
      const response = await apiClient.get("/houses/nameList");
      setHouseNames(response);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách tên tòa nhà!");
      console.error("Error fetching house name list:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchHouseNameList();
  }, []);

  const refresh = () => {
    fetchRooms();
  };

  const close = () => {
    setModalChildren(null);
  };

  return (
    <>
      <Card
        title="Danh sách phòng trọ"
        className="customCard"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setModalChildren(
                <RoomEditor
                  houseNames={houseNames}
                  refresh={refresh}
                  close={close}
                  mode="CREATE"
                />
              );
            }}
          >
            Thêm phòng
          </Button>
        }
      >
        <Table
          className="customTable"
          columns={columns}
          bordered
          dataSource={rooms}
          loading={loading}
          pagination={false}
          scroll={{ y: true }}
          rowKey="id"
        />
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

export default Rooms;
