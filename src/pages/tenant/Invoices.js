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
  InfoOutlined,
  MoreOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import apiClient from "../../services/apiClient";
import { invoiceStatus } from "../../statuses";
import { InvoiceTag } from "../../tags";
import Invoice from "../../components/invoices/RInvoice";

const { Search } = Input;

const formatCurrency = (value) =>
  value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalChildren, setModalChildren] = useState(null);

  const items = [
    {
      key: "detail",
      label: "Chi tiết hóa đơn",
      icon: <InfoOutlined />,
      style: { color: "#1677ff" },
    },
  ];

  const handleActionClick = async (actionKey, invoice) => {
    switch (actionKey) {
      case "detail":
        console.log("Xem chi tiết:", invoice);
        const invoiceDetail = await fetchInvoiceDetail(invoice.id);
        invoiceDetail &&
          setModalChildren(<Invoice invoiceDetail={invoiceDetail} />);
        break;
      default:
        console.log("Hành động không xác định:", actionKey, invoice);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 50 },
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
      render: (text) => dayjs(text).format("DD/MM/YYYY"),
    },
    {
      title: "Tính từ",
      dataIndex: "startDate",
      align: "right",
      key: "startDate",
      render: (text) => dayjs(text).format("DD/MM/YYYY"),
    },
    {
      title: "Đến ngày",
      dataIndex: "endDate",
      align: "right",
      key: "endDate",
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
          placement="bottom"
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
      const response = await apiClient.get("tenant/invoices");
      setInvoices(response);
    } catch (error) {
      console.error("Error fetching invoice list:", error);
      if (error?.message) message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoiceDetail = (invoiceId) => {
    try {
      return apiClient.get(`tenant/invoices/${invoiceId}`);
    } catch (error) {
      console.error("Error fetching invoice:", error);
      if (error?.message) message.error(error.message);
      return null;
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const refresh = () => {
    fetchInvoices();
  };

  const close = () => {
    setModalChildren(null);
  };

  return (
    <>
      <Card title="Danh sách hóa đơn" className="customCard">
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
