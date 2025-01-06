import React, { useEffect, useState } from "react";
import { Card, Dropdown, Input, message, Modal, Table } from "antd";
import {
  CloseCircleOutlined,
  EditOutlined,
  MoreOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { contractStatus } from "../../statuses";
import { ContractTag } from "../../tags";
import apiClient from "../../services/apiClient";
import CUUser from "../../components/users/CUUser";

const { Search } = Input;

const Tenants = () => {
  const [tenants, setTenants] = useState([]);
  const [houseNames, setHouseNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalChildren, setModalChildren] = useState(null);

  const items = [
    {
      key: "update",
      label: "Sửa thông tin",
      icon: <EditOutlined />,
      style: { color: "orange" },
    },
  ];

  const handleActionClick = async (actionKey, tenant) => {
    switch (actionKey) {
      case "update":
        setModalChildren(
          <CUUser
            user={tenant}
            refresh={refresh}
            close={close}
            mode="UPDATE_TENANT"
          />
        );
        break;
      default:
        console.log("Hành động không xác định:", actionKey, tenant);
    }
  };

  const columns = [
    { title: "Mã", dataIndex: "id", key: "id", width: 70 },
    {
      title: "Khách thuê",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "CMND/CCCD",
      dataIndex: "personalIdNumber",
      key: "personalIdNumber",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
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
      title: "Hợp đồng",
      dataIndex: ["contract", "status"],
      key: "status",
      fixed: "right",
      filters: Object.keys(contractStatus).map((key) => ({
        value: key,
        text: contractStatus[key].name,
      })),
      onFilter: (value, record) => record.contract.status === value,
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
        if (record.role === "REP_TENANT") return null;
        else
          return (
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
          );
      },
    },
  ];

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/tenants");
      setTenants(response);
    } catch (error) {
      if (error?.message) message.error(error.message);
      console.error("Error fetching tenant list:", error);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    fetchTenants();
  };

  const close = () => {
    setModalChildren(null);
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
    fetchTenants();
    fetchHouseNameList();
  }, []);

  return (
    <>
      <Card title="Danh sách khách đang thuê" className="customCard">
        <Table
          className="customTable"
          columns={columns}
          bordered
          dataSource={tenants}
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

export default Tenants;
