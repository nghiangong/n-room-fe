import React, { useEffect, useState } from "react";
import { Card, message, Table } from "antd";
import { RoomTag } from "../../tags";
import apiClient from "../../services/apiClient";

const columns = [
  { title: "ID", dataIndex: "id", key: "id" },
  { title: "Tên phòng", dataIndex: "name", key: "name" },
  {
    title: "Giá (VNĐ)",
    dataIndex: "price",
    key: "price",
    render: (text) => text.toLocaleString("vi-VN"),
  },
  {
    title: "Tình trạng",
    dataIndex: "status",
    key: "status",
    render: (status) => <RoomTag status={status} />,
  },
];

const RoomList = ({ houseDetail }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `/houses/${houseDetail.id}/roomList`
      );
      setRooms(response);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách phòng!");
      console.error("Error fetching room list:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRooms();
  }, []);
  return (
    <Card title="Danh sách phòng trọ" style={{ width: "700px" }}>
      <Table
        columns={columns}
        dataSource={rooms}
        rowKey="id"
        pagination={false}
        bordered
        scroll={{ y: 300 }}
      />
    </Card>
  );
};

export default RoomList;
