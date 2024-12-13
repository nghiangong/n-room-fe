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
  InfoCircleOutlined,
  MoreOutlined,
  PlusCircleOutlined,
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

const { Search } = Input;

const Houses = () => {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalChildren, setModalChildren] = useState(null);

  const items = [
    { key: "detail", label: "Chi tiết nhà", icon: <InfoCircleOutlined /> },
    { key: "edit", label: "Sửa thông tin", icon: <EditOutlined /> },
    {
      key: "roomList",
      label: "Danh sách phòng",
      icon: <UnorderedListOutlined />,
    },
    { key: "addRoom", label: "Thêm phòng", icon: <PlusCircleOutlined /> },
  ];

  const handleActionClick = async (actionKey, house) => {
    try {
      const houseDetail = await fetchHouseDetail(house.id);

      switch (actionKey) {
        case "detail":
          setModalChildren(
            <House
              houseDetail={houseDetail}
              refresh={refresh}
              close={close}
              mode="VIEW"
            />
          );
          console.log("Xem chi tiết nhà:", house);
          break;
        case "edit":
          setModalChildren(
            <House
              houseDetail={houseDetail}
              refresh={refresh}
              close={close}
              mode="EDIT"
            />
          );
          console.log("Sửa thông tin nhà:", house);
          break;
        case "roomList":
          console.log("Xem danh sách phòng:", house);
          setModalChildren(<RoomList houseDetail={houseDetail} />);
          break;
        case "addRoom":
          console.log("Thêm phòng vào nhà:", house);
          setModalChildren(
            <AddRoom
              houseDetail={houseDetail}
              close={close}
              refresh={refresh}
            />
          );
          break;
        default:
          console.log("Hành động không xác định:", actionKey, house);
      }
    } catch (error) {
      console.error("Lỗi khi xử lý hành động:", error);
    }
  };

  const columns = [
    { title: "Id", dataIndex: "id", key: "id", width: 50 },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      width: 200, // Đặt chiều rộng cố định
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

  const fetchHouses = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/houses");
      setHouses(response);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách tòa nhà!");
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
      message.error("Lỗi khi lấy chi tiết tòa nhà!");
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
            onClick={() => {
              message.info("Chức năng thêm nhà trọ!");
              setModalChildren(
                <House refresh={refresh} close={close} mode="CREATE" />
              );
            }}
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
