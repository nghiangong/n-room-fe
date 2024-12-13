import React, { useEffect, useState } from "react";
import { Card, Input, message, Table } from "antd";
import { CloseCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { contractStatus } from "../../statuses";
import { ContractTag } from "../../tags";
import apiClient from "../../services/apiClient";

const { Search } = Input;

const Tenants = () => {
  const [tenants, setTenants] = useState([]);
  const [houseNames, setHouseNames] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { title: "Id", dataIndex: "id", key: "id", width: 50 },
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
  ];

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/tenants");
      setTenants(response);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách khách thuê!");
      console.error("Error fetching tenant list:", error);
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
      {/* <Modal
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
      </Modal> */}
    </>
  );
};

export default Tenants;
