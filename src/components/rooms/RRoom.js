import {
  Button,
  Card,
  Descriptions,
  Dropdown,
  message,
  Modal,
  Space,
  Table,
  Typography,
} from "antd";
import React, { useState } from "react";
import { ContractTag, RoomTag } from "../../tags";
import { roomStatus } from "../../statuses";
import UserDes from "../users/UserDes";

const { Text } = Typography;

const RRoom = ({ roomDetail, refresh, close }) => {
  const statusItems = Object.entries(roomStatus).map(([key, status]) => ({
    key,
    label: <Text style={{ color: status.color }}>{status.name}</Text>,
  }));
  return (
    <Card title="Thông tin phòng trọ" style={{ width: "700px" }}>
      <Descriptions
        column={1}
        items={[
          { key: "1", label: "Phòng", children: `${roomDetail.name}` },
          {
            key: "2",
            label: "Tòa nhà",
            children: `${roomDetail.house.name}`,
          },
          {
            key: "3",
            label: "Địa chỉ",
            children: `${roomDetail.house.address}, ${roomDetail.house.ward}, ${roomDetail.house.district}, ${roomDetail.house.province}`,
          },
          {
            key: "4",
            label: "Trạng thái",
            children: <RoomTag status={roomDetail.status} />,
          },
        ]}
      />
      {roomDetail.currentContract && (
        <>
          <div style={{ marginTop: 10 }}>
            <UserDes user={roomDetail?.repTenant} />
          </div>
          <Table
            style={{ marginTop: "10px" }}
            size="small"
            columns={[
              {
                title: "Mã hợp đồng",
                dataIndex: "id",
                key: "id",
              },
              {
                title: "Ngày bắt đầu",
                dataIndex: "startDate",
                key: "startDate",
              },
              {
                title: "Ngày kết thúc",
                dataIndex: "endDate",
                key: "endDate",
                render: (text) => (text ? text : "Chưa kết thúc"), // Nếu null, hiển thị 'Chưa kết thúc'
              },
              {
                title: "Giá thuê (VNĐ)",
                dataIndex: "rentPrice",
                key: "rentPrice",
                render: (text) => (text ? text.toLocaleString("vi-VN") : ""), // Định dạng giá tiền theo định dạng VNĐ
              },
              {
                title: "Tình trạng",
                dataIndex: "status",
                key: "status",
                render: (status) => <ContractTag status={status} />,
              },
            ]}
            dataSource={[roomDetail.currentContract]}
            rowKey="id"
            pagination={false}
          />
        </>
      )}
    </Card>
  );
};
export default RRoom;
