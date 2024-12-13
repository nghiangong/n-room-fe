import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  message,
  Dropdown,
  Input,
  Modal,
  Space,
  Select,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  MoreOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import apiClient from "../../services/apiClient";
import { invoiceStatus } from "../../statuses";
import Invoice from "../../components/invoices/Invoice";
import { InvoiceTag } from "../../tags";
import CreateInvoice from "../../components/invoices/CreateInvoice";

const { Search } = Input;

const formatCurrency = (value) =>
  value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [houseNames, setHouseNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalChildren, setModalChildren] = useState(null);
  const [date, setDate] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const items = [
    {
      key: "confirmPayment",
      label: "Xác nhận thanh toán",
      icon: <CheckCircleOutlined />,
    },
    { key: "detail", label: "Chi tiết hóa đơn", icon: <InfoCircleOutlined /> },
  ];

  const handleActionClick = (actionKey, invoice) => {
    switch (actionKey) {
      case "detail":
        console.log("Xem chi tiết:", invoice);
        setModalChildren(<Invoice invoiceDetail={invoice} />);
        break;
      case "edit":
        console.log("Sửa thông tin nhà:", invoice);
        break;
      case "roomList":
        console.log("Xem danh sách phòng:", invoice);
        break;
      case "addRoom":
        console.log("Thêm phòng vào nhà:", invoice);
        break;
      default:
        console.log("Hành động không xác định:", actionKey, invoice);
    }
  };

  const columns = [
    { title: "Id", dataIndex: "id", key: "id", width: 50 },
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
      title: "Phòng",
      dataIndex: ["room", "name"],
      key: "roomName",
      width: 100,
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
      title: "Tên hóa đơn",
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
      title: "Ngày tạo",
      dataIndex: "createDate",
      align: "right",
      key: "createDate",
      width: "110px",
      render: (text) => dayjs(text).format("DD/MM/YYYY"),
    },
    {
      title: "Tổng thành tiền",
      dataIndex: "amount",
      align: "right",
      render: (value) => formatCurrency(value),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      fixed: "right",
      filters: Object.keys(invoiceStatus).map((key) => ({
        value: key,
        text: invoiceStatus[key].name,
      })),
      onFilter: (value, record) => record.status === value,
      render: (status) => <InvoiceTag status={status} />,
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

  const fetchInvoices = async () => {
    try {
      const response = await apiClient.get("/invoices");
      setInvoices(response);
    } catch (error) {
      console.error("Error fetching invoice list:", error);
      message.error("Lỗi khi tải danh sách hóa đơn");
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
    fetchInvoices();
    fetchHouseNameList();
  }, []);

  const refresh = () => {
    fetchInvoices();
  };

  const close = () => {
    setModalChildren(null);
  };

  const handleCreateClick = () => {
    setModalChildren(
      <CreateInvoice close={close} refresh={refresh} houseNames={houseNames} />
    );
  };

  return (
    <>
      <Card
        title="Danh sách hóa đơn"
        className="customCard"
        extra={
          <Button type="primary" onClick={() => handleCreateClick()}>
            Tạo hóa đơn
          </Button>
        }
      >
        <Table
          className="customTable"
          columns={columns}
          bordered
          dataSource={invoices}
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

export default Invoices;
