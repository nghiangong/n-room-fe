import { Card, Descriptions, message } from "antd";
import React, { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import { RoomTag } from "../../tags";

const Room = () => {
  const [roomDetail, setRoomDetail] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/rooms");
      setRoomDetail(response);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách phòng!");
      console.error("Error fetching room list:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {}, []);

  return (
    <>
      <Card
        title="Thông tin phòng trọ"
        className="customCard"
        loading={loading}
      >
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
      </Card>
    </>
  );
};

export default Room;
