import React, { useEffect, useState } from "react";
import { message, Table, Card, Button, Dropdown, Modal, Input } from "antd";
import {
  CloseCircleOutlined,
  EditOutlined,
  InfoOutlined,
  MoreOutlined,
  PlusOutlined,
  SearchOutlined,
  StopOutlined,
} from "@ant-design/icons";
import apiClient from "../../services/apiClient";
import "../../styles/tableStyles.scss";
import "../../styles/modalStyles.scss";
import { ContractTag } from "../../tags";
import { contractStatus } from "../../statuses";
import dayjs from "dayjs";
import { useAuth } from "../../context/AuthContext";
import StopContract from "../../components/contracts/StopContract";
import RContract from "../../components/contracts/RContract";

const { Search } = Input;

const Contracts = () => {
  const { role } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalChildren, setModalChildren] = useState(null);

  const items = [
    {
      key: "detail",
      label: "Chi tiết hợp đồng",
      icon: <InfoOutlined />,
      style: { color: "#1677ff" },
    },
  ];

  const handleActionClick = async (actionKey, contract) => {
    let contractDetail;
    switch (actionKey) {
      case "detail":
        contractDetail = await fetchContractDetail(contract.id);
        contractDetail &&
          setModalChildren(<RContract contractDetail={contractDetail} />);
        break;
      // case "stop":
      //   contractDetail = await fetchContractDetail(contract.id);
      //   setModalChildren(
      //     <StopContract
      //       contractDetail={contractDetail}
      //       refresh={refresh}
      //       close={close}
      //     />
      //   );
      //   break;
      default:
        console.log("Hành động không xác định:", actionKey, contract);
    }
  };

  const columns = [
    { title: "Mã", dataIndex: "id", key: "id", width: 70 },
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
        const items2 = [...items];
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
      const response = await apiClient.get("/tenant/contracts");
      setContracts(response);
    } catch (error) {
      if (error?.message) message.error(error.message);
      console.error("Error fetching contract list:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContractDetail = async (contractId) => {
    try {
      return apiClient.get(`tenant/contracts/${contractId}`);
    } catch (error) {
      console.error("Error fetching contract:", error);
      if (error?.message) message.error(error.message);
      return null;
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const refresh = () => {
    fetchContracts();
  };

  const close = () => {
    setModalChildren(null);
  };

  return (
    <>
      <Card title="Hợp đồng" className="customCard">
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
