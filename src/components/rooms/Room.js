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

const { Text } = Typography;

const Room = ({ roomDetail, refresh, close }) => {
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
            children: (
              <div>
                <RoomTag status={roomDetail.status} />
                <Dropdown
                  menu={{
                    items: statusItems,
                    onClick: ({ key }) => {
                      if (key !== roomDetail.status) {
                        Modal.confirm({
                          title: "Xác nhận thay đổi trạng thái",
                          content: `Bạn có chắc muốn thay đổi trạng thái sang "${roomStatus[key].name}" không?`,
                          okText: "Đồng ý",
                          cancelText: "Hủy",
                          onOk: async () => {
                            try {
                              // await houseUpdateApi(houseId, { status: key });
                              message.success(
                                "Trạng thái đã được cập nhật thành công"
                              );
                              refresh();
                            } catch (error) {
                              message.error("Không thể cập nhật trạng thái");
                              console.error("Error updating status:", error);
                            }
                          },
                        });
                      }
                    },
                  }}
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>Thay đổi</Space>
                  </a>
                </Dropdown>
              </div>
            ),
          },
        ]}
      />
      {roomDetail.currentContract && (
        <>
          <Table
            style={{ marginTop: "10px" }}
            size="small"
            columns={[
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
            ]}
            dataSource={[roomDetail.repTenant]}
            rowKey="id" // Cột "id" làm key cho mỗi dòng trong bảng
            pagination={false} // Tắt phân trang để chỉ hiển thị 1 phần tử
          />
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
            rowKey="id" // Cột "id" làm key cho mỗi dòng trong bảng
            pagination={false} // Tắt phân trang để chỉ hiển thị 1 phần tử
          />
        </>
      )}
    </Card>
  );
};
export default Room;
