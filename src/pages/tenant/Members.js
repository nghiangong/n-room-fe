import React, { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  InfoOutlined,
  MoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import apiClient from "../../services/apiClient";
import { Button, Card, Dropdown, message, Modal, Table } from "antd";
import { TenantTag } from "../../tags";
import { useAuth } from "../../context/AuthContext";
import Contract from "../../components/contracts/Contract";
import CUUser from "../../components/users/CUUser";

const Members = () => {
  const { role } = useAuth();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalChildren, setModalChildren] = useState(null);

  const items = [
    {
      key: "update",
      label: "Chỉnh sửa",
      icon: <EditOutlined />,
      style: { color: "orange" },
    },
    {
      key: "delete",
      label: "Xóa",
      icon: <DeleteOutlined />,
      style: { color: "red" },
    },
  ];

  const handleActionClick = async (actionKey, tenant) => {
    switch (actionKey) {
      case "create":
        setModalChildren(
          <CUUser refresh={refresh} close={close} mode="CREATE_MEMBER" />
        );
        break;
      case "delete":
        try {
          console.log("here");
          await apiClient.delete(`tenant/members/${tenant.id}`);
          message.success("Xóa thành công!");
          refresh();
        } catch (error) {
          if (error?.message) message.error(error.message);
        }
        break;
      case "update":
        setModalChildren(
          <CUUser
            user={tenant}
            refresh={refresh}
            close={close}
            mode="UPDATE_MEMBER"
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
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (status) => <TenantTag status={status} />,
    },
  ];
  if (role === "ROLE_REP_TENANT") {
    columns.push({
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
    });
  }

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/tenant/members");
      setMembers(response);
    } catch (error) {
      if (error?.message) message.error(error.message);
      console.error("Error fetching member list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const refresh = () => {
    fetchMembers();
  };

  const close = () => {
    setModalChildren(null);
  };

  return (
    <>
      <Card
        title="Danh sách thành viên"
        className="customCard"
        extra={
          role == "ROLE_REP_TENANT" && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleActionClick("create")}
            >
              Thêm mới
            </Button>
          )
        }
      >
        <Table
          className="customTable"
          columns={columns}
          bordered
          dataSource={members}
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

export default Members;
