import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  Button,
  message,
  Input,
  Tooltip,
  Dropdown,
  Modal,
} from "antd";
import {
  CloseCircleOutlined,
  EditOutlined,
  InfoOutlined,
  MoreOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { HouseTag } from "../../tags";
import apiClient from "../../services/apiClient";
import "../../styles/tableStyles.scss";
import "../../styles/modalStyles.scss";
import House from "../../components/houses/House";
import RoomList from "../../components/houses/RoomList";
import AddRoom from "../../components/houses/AddRoom";
import RHouse from "../../components/houses/RHouse";
import { get } from "../../utils";

const { Search } = Input;

const Houses = () => {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalChildren, setModalChildren] = useState(null);

  const items = [
    {
      key: "detail",
      label: "Chi tiết nhà",
      icon: <InfoOutlined />,
      style: { color: "#1677ff" },
    },
    {
      key: "edit",
      label: "Sửa thông tin",
      icon: <EditOutlined />,
      style: { color: "orange" },
    },
    {
      key: "rooms",
      label: "Danh sách phòng",
      icon: <UnorderedListOutlined />,
      style: { color: "#1677ff" },
    },
    {
      key: "unlock",
      label: "Hoạt động",
      icon: <PlayCircleOutlined />,
      style: { color: "green" },
    },
    {
      key: "lock",
      label: "Dừng hoạt động",
      icon: <PauseCircleOutlined />,
      style: { color: "orange" },
    },
  ];

  const handleActionClick = async (actionKey, house) => {
    let houseDetail;
    try {
      switch (actionKey) {
        case "detail":
          houseDetail = await fetchHouseDetail(house.id);
          setModalChildren(<RHouse houseDetail={houseDetail} />);
          break;
        case "edit":
          houseDetail = await fetchHouseDetail(house.id);
          setModalChildren(
            <House
              houseDetail={houseDetail}
              refresh={refresh}
              close={close}
              mode="UPDATE"
            />
          );
          break;
        case "create":
          setModalChildren(
            <House refresh={refresh} close={close} mode="CREATE" />
          );
          break;
        case "rooms":
          setModalChildren(<RoomList houseDetail={houseDetail} />);
          break;
        default:
          console.log("Hành động không xác định:", actionKey, house);
      }
    } catch (error) {
      console.error("Lỗi khi xử lý hành động:", error);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 50 },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      width: 200,
      fixed: "left",
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
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      width: 300,
      render: (text, record) => (
        <Tooltip
          title={`${record.address}, ${record.ward}, ${record.district}, ${record.province}`}
        >
          <span>{`${record.address}, ${record.ward}, ${record.district}, ${record.province}`}</span>
        </Tooltip>
      ),
    },
    {
      title: "Số phòng",
      children: [
        {
          title: "Tổng",
          dataIndex: "roomsCount",
          key: "roomsCount",
          width: 70,
        },
        {
          title: "Đang thuê",
          dataIndex: "occupiedRoomsCount",
          key: "occupiedRoomsCount",
          width: 100,
        },
        {
          title: "Trống",
          dataIndex: "availableRoomsCount",
          key: "availableRoomsCount",
          width: 70,
        },
        {
          title: "Sắp trống",
          dataIndex: "availableSoonRoomsCount",
          key: "availableSoonRoomsCount",
          width: 100,
        },
        {
          title: "Ngưng hoạt động",
          dataIndex: "inactiveRoomsCount",
          key: "inactiveRoomsCount",
          width: 150,
        },
      ],
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      fixed: "right",
      width: 150,
      filters: [
        { text: "Hoạt động", value: "ACTIVE" },
        { text: "Không hoạt động", value: "INACTIVE" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => <HouseTag status={status} />,
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
            case "ACTIVE":
              return get(items, ["detail", "rooms", "edit", "lock"]);
            case "INACTIVE":
              return get(items, ["detail", "rooms", "unlock"]);
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

  const fetchHouses = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/houses");
      setHouses(response);
    } catch (error) {
      if (error?.message) message.error(error.message);
      console.error("Error fetching house list:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHouseDetail = async (id) => {
    try {
      const response = await apiClient.get(`/houses/${id}`);
      console.log("houseDetail", response);
      return response;
    } catch (error) {
      if (error?.message) message.error(error.message);
      console.error("Error fetching house detail:", error);
    }
  };

  useEffect(() => {
    fetchHouses();
  }, []);

  const refresh = () => {
    fetchHouses();
  };

  const close = () => {
    setModalChildren(null);
  };

  return (
    <>
      <Card
        title="Danh sách nhà trọ"
        className="customCard"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleActionClick("create")}
          >
            Thêm mới
          </Button>
        }
      >
        <Table
          className="customTable"
          columns={columns}
          bordered
          dataSource={houses}
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

export default Houses;
