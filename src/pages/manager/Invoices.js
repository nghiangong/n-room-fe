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
  DeleteOutlined,
  InfoOutlined,
  MoreOutlined,
  RedoOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import apiClient from "../../services/apiClient";
import { invoiceStatus } from "../../statuses";
import Invoice from "../../components/invoices/RInvoice";
import { InvoiceTag } from "../../tags";
import CreateInvoice from "../../components/invoices/CInvoice";
import { get } from "../../utils";

const { Search } = Input;

const formatCurrency = (value) =>
  value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [houseNames, setHouseNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalChildren, setModalChildren] = useState(null);

  const items = [
    {
      key: "detail",
      label: "Chi tiết hóa đơn",
      icon: <InfoOutlined />,
      style: { color: "#1677ff" },
    },
    {
      key: "confirmPayment",
      label: "Xác nhận thanh toán",
      icon: <CheckCircleOutlined />,
      style: { color: "green" },
    },
    {
      key: "remove",
      label: "Xóa",
      icon: <DeleteOutlined />,
      style: { color: "red" },
    },
  ];

  const handleActionClick = async (actionKey, invoice) => {
    switch (actionKey) {
      case "detail":
        console.log("Xem chi tiết:", invoice);
        setModalChildren(<Invoice invoiceDetail={invoice} />);
        break;
      case "confirmPayment":
        Modal.confirm({
          title: "Xác nhận thanh toán",
          content: "Bạn có chắc chắn muốn xác nhận đã thanh toán không?",
          okText: "Xác nhận",
          cancelText: "Hủy",
          onOk: async () => {
            try {
              await apiClient.put(`invoices/${invoice.id}/paid`);
              refresh();
              close();
              message.success("Xác nhận thanh toán thành công!");
            } catch (error) {
              console.error("Save failed:", error);
              if (error?.message) message.error(error.message);
            }
          },
          onCancel: () => {
            console.log("Hủy xác nhận thanh toán.");
          },
        });
        break;
      case "remove":
        await remove(invoice.id);
        break;
      default:
        console.log("Hành động không xác định:", actionKey, invoice);
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
      render: (text, record) => {
        const { status } = record;
        const items2 = (() => {
          switch (status) {
            case "PAID":
              return get(items, ["detail"]);
            case "UNPAID":
              return get(items, ["detail", "confirmPayment", "remove"]);
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

  const fetchInvoices = async () => {
    try {
      const response = await apiClient.get("/invoices");
      setInvoices(response);
    } catch (error) {
      console.error("Error fetching invoice list:", error);
      if (error?.message) message.error(error.message);
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

  const remove = async (id) => {
    try {
      await apiClient.delete(`/invoices/${id}`);
      refresh();
    } catch (error) {
      if (error?.message) message.error(error.message);
      console.error(error);
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
