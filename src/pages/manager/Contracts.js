import React, { useEffect, useState } from "react";
import { message, Table, Card, Button, Dropdown, Modal, Input } from "antd";
import {
  ArrowRightOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  EditOutlined,
  InfoOutlined,
  LogoutOutlined,
  MoreOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import apiClient from "../../services/apiClient";
import "../../styles/tableStyles.scss";
import "../../styles/modalStyles.scss";
import { ContractTag } from "../../tags";
import { contractStatus } from "../../statuses";
import dayjs from "dayjs";
import Contract from "../../components/contracts/Contract";
import RContract from "../../components/contracts/RContract";
import StopContract from "../../components/contracts/StopContract";
import CCheckoutInvoice from "../../components/contracts/CCheckoutInvoice";
import { get } from "../../utils";

const { Search } = Input;

const Contracts = () => {
  const [contracts, setContracts] = useState([]);
  const [houseNames, setHouseNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalChildren, setModalChildren] = useState(null);

  const items = [
    {
      key: "detail",
      label: "Chi tiết hợp đồng",
      icon: <InfoOutlined />,
      style: { color: "#1677ff" },
    },
    {
      key: "edit",
      label: "Sửa hợp đồng",
      icon: <EditOutlined />,
      style: { color: "#ffc107" },
    },
    {
      key: "checkout",
      label: "Trả phòng",
      icon: <ArrowRightOutlined />,
      style: { color: "#ffc107" },
    },
    {
      key: "stop",
      label: "Kết thúc",
      icon: <CloseOutlined />,
      style: { color: "#fd7e14" },
    },
  ];

  const handleActionClick = (actionKey, contract) => {
    switch (actionKey) {
      case "detail":
        setModalChildren(<RContract contractDetail={contract} />);
        break;
      case "edit":
        setModalChildren(
          <Contract
            contractDetail={contract}
            houseNames={houseNames}
            close={close}
            refresh={refresh}
            mode="UPDATE"
          />
        );
        break;
      case "create":
        setModalChildren(
          <Contract
            houseNames={houseNames}
            refresh={refresh}
            close={close}
            mode="CREATE"
          />
        );
        break;
      case "stop":
        setModalChildren(
          <StopContract contract={contract} close={close} refresh={refresh} />
        );
        break;
      case "checkout":
        setModalChildren(
          <CCheckoutInvoice
            contractDetail={contract}
            close={close}
            refresh={refresh}
          />
        );
        break;
      default:
        console.log("Hành động không xác định:", actionKey, contract);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 50 },
    {
      title: "Tòa nhà",
      dataIndex: ["house", "name"],
      key: "houseName",
      filters: houseNames?.map((houseName) => ({
        value: houseName.name,
        text: houseName.name,
      })),
      filterMultiple: false,
      onFilter: (value, record) => record.house.name === value,
    },
    {
      title: "Phòng",
      dataIndex: ["room", "name"],
      key: "roomName",
      sorter: (a, b) => a.room.name.localeCompare(b.room.name),
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
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      align: "right",
      key: "startDate",
      render: (text) => dayjs(text).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      align: "right",
      key: "endDate",
      render: (text) =>
        text ? dayjs(text).format("DD/MM/YYYY") : "Chưa kết thúc",
    },
    {
      title: "Tiền thuê (VNĐ)",
      dataIndex: "rentPrice",
      key: "rentPrice",
      align: "right",
      render: (text, record) => record.rentPrice.toLocaleString("vi-VN") || "",
    },
    {
      title: "Tiền cọc (VNĐ)",
      dataIndex: "deposit",
      key: "deposit",
      align: "right",
      render: (text, record) => record.rentPrice.toLocaleString("vi-VN") || "",
    },
    {
      title: "Tình trạng",
      dataIndex: "status",
      key: "status",
      fixed: "right",
      filters: Object.keys(contractStatus).map((key) => ({
        value: key,
        text: contractStatus[key].name,
      })),
      onFilter: (value, record) => record.status === value,
      render: (status) => <ContractTag status={status} />,
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
              return get(items, ["detail", "edit", "stop"]);
            case "PENDING_CHECKOUT":
              return get(items, ["detail", "edit", "checkout"]);
            case "SOON_INACTIVE":
            case "PENDING_PAYMENT":
              return get(items, ["detail", "edit"]);
            case "INACTIVE":
              return get(items, ["detail"]);
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

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/contracts");
      setContracts(response);
    } catch (error) {
      if (error?.message) message.error(error.message);
      console.error("Error fetching contract list:", error);
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

  useEffect(() => {
    fetchContracts();
    fetchHouseNameList();
  }, []);

  const refresh = () => {
    fetchContracts();
  };

  const close = () => {
    setModalChildren(null);
  };

  return (
    <>
      <Card
        title="Danh sách hợp đồng"
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
          dataSource={contracts}
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

export default Contracts;
