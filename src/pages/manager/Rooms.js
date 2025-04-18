import React, { useEffect, useState } from "react";
import { message, Table, Card, Button, Dropdown, Modal, Input } from "antd";
import {
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  InfoOutlined,
  MoreOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { ContractTag, PaymentTag, RoomTag } from "../../tags";
import apiClient from "../../services/apiClient";
import "../../styles/tableStyles.scss";
import "../../styles/modalStyles.scss";
import "../../styles/cardStyles.scss";
import { paymentStatus, roomStatus } from "../../statuses";
import RRoom from "../../components/rooms/RRoom";
import CURoom from "../../components/rooms/CURoom";
import { formatCurrency, get } from "../../utils";

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
      icon: <InfoOutlined />,
      style: { color: "blue" },
    },
    {
      key: "edit",
      label: "Sửa phòng",
      icon: <EditOutlined />,
      style: { color: "orange" },
    },
    {
      key: "inactive",
      label: "Dừng hoạt động",
      icon: <PauseCircleOutlined />,
      style: { color: "orange" },
    },
    {
      key: "active",
      label: "Hoạt động",
      icon: <PlayCircleOutlined />,
      style: { color: "green" },
    },
    {
      key: "remove",
      label: "Xóa",
      icon: <DeleteOutlined />,
      style: { color: "red" },
    },
  ];

  const handleActionClick = (actionKey, room) => {
    switch (actionKey) {
      case "detail":
        setModalChildren(
          <RRoom roomDetail={room} close={close} refresh={refresh} />
        );
        break;
      case "create":
        setModalChildren(
          <CURoom
            houseNames={houseNames}
            close={close}
            refresh={refresh}
            mode="CREATE"
          />
        );
        break;
      case "edit":
        setModalChildren(
          <CURoom
            room={room}
            houseNames={houseNames}
            refresh={refresh}
            close={close}
            mode="UPDATE"
          />
        );
        break;
      case "active":
        active(room.id);
        break;
      case "inactive":
        inactive(room.id);
        break;
      case "remove":
        remove(room.id);
        break;
      default:
        console.log("Hành động không xác định:", actionKey, room);
    }
  };

  const columns = [
    { title: "Mã", dataIndex: "id", key: "id", width: 70 },
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
      title: "Giá thuê",
      dataIndex: ["currentContract", "rentPrice"],
      align: "right",
      render: (text, record) => `${formatCurrency(record.price)}`,
    },
    {
      title: "Số người",
      align: "center",
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
      title: "Hóa đơn",
      dataIndex: ["currentContract", "paymentStatus"],
      fixed: "right",
      filters: Object.keys(paymentStatus).map((key) => ({
        value: key,
        text: paymentStatus[key].name,
      })),
      onFilter: (value, record) =>
        record?.currentContract?.paymentStatus === value,
      render: (status) => <PaymentTag status={status} />,
    },
    {
      title: "Thao tác",
      dataIndex: "",
      key: "action",
      width: 100,
      fixed: "right",
      align: "center",
      render: (text, record) => {
        const { status } = record;
        const items2 = (() => {
          switch (status) {
            case "AVAILABLE":
              return get(items, ["detail", "edit", "inactive", "remove"]);
            case "OCCUPIED":
            case "SOON_AVAILABLE":
              return get(items, ["detail", "edit"]);
            case "INACTIVE":
              return get(items, ["unlock", "active", "remove"]);
            default:
              return [];
          }
        })();
        return (
          <Dropdown
            menu={{
              items: items2,
              onClick: ({ key }) => handleActionClick(key, record),
            }}
            placement="bottom"
          >
            <MoreOutlined
              style={{ cursor: "pointer", fontSize: "20px", color: "#08c" }}
            />
          </Dropdown>
        );
      },
    },
  ];

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/rooms");
      setRooms(response);
    } catch (error) {
      if (error?.message) message.error(error.message);
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
      if (error?.message) message.error(error.message);
      console.error("Error fetching house name list:", error);
    }
  };

  const active = async (id) => {
    try {
      await apiClient.put(`/rooms/${id}/active`);
      refresh();
    } catch (error) {
      if (error?.message) message.error(error.message);
      console.error(error);
    }
  };

  const inactive = async (id) => {
    try {
      await apiClient.put(`/rooms/${id}/inactive`);
      refresh();
    } catch (error) {
      if (error?.message) message.error(error.message);
      console.error(error);
    }
  };

  const remove = async (id) => {
    try {
      await apiClient.delete(`/rooms/${id}`);
      refresh();
    } catch (error) {
      if (error?.message) message.error(error.message);
      console.error(error);
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
            onClick={() => handleActionClick("create")}
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
