import { Card, Col, Descriptions, message, Row } from "antd";
import React, { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import { RoomTag } from "../../tags";
import ROtherFees from "../../components/otherFee/ROtherFees";
import RRecords from "../../components/elecwater/RRecords";
import UserDes from "../../components/users/UserDes";

const Room = () => {
  const [roomDetail, setRoomDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const house = roomDetail?.house;
  console.log("room = " + roomDetail);
  console.log(house);

  const fetchRoom = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/tenant/room");
      console.log(response);
      setRoomDetail(response || {});
    } catch (error) {
      if (error?.message) message.error(error.message);
      console.error("Error fetching room details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoom();
  }, []);

  const getAddress = (house) => {
    if (!house) return "Không có thông tin";
    const { address, ward, district, province } = house;
    return `${address || ""}, ${ward || ""}, ${district || ""}, ${
      province || ""
    }`;
  };
  if (roomDetail)
    return (
      <Card
        title="Thông tin phòng trọ"
        className="customCard"
        loading={loading}
      >
        <Row gutter={[10, 10]}>
          <Col span={12}>
            <Row gutter={[10, 10]}>
              <Col span={24}>
                <Descriptions
                  column={1}
                  items={[
                    {
                      key: "1",
                      label: "Phòng",
                      children: roomDetail?.name || "Không có thông tin",
                    },
                    {
                      key: "2",
                      label: "Tòa nhà",
                      children: roomDetail?.house?.name || "Không có thông tin",
                    },
                    {
                      key: "3",
                      label: "Địa chỉ",
                      children: getAddress(roomDetail?.house),
                    },
                    {
                      key: "4",
                      label: "Trạng thái",
                      children: <RoomTag status={roomDetail?.status} />,
                    },
                  ]}
                />
              </Col>
              <Col span={24}>
                <UserDes user={roomDetail?.house.manager} />
              </Col>
              {house?.havingElecIndex && (
                <Col span={12}>
                  <RRecords records={roomDetail?.elecRecords} mode="ELEC" />
                </Col>
              )}
              {house?.havingWaterIndex && (
                <Col span={12}>
                  <RRecords records={roomDetail?.waterRecords} mode="WATER" />
                </Col>
              )}
            </Row>
          </Col>
          <Col span={12}>
            <ROtherFees otherFees={roomDetail?.house.otherFees} />
          </Col>
        </Row>
      </Card>
    );
};

export default Room;
