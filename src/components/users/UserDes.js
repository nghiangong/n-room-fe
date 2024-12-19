import React from "react";
import { Descriptions } from "antd";
import "../../styles/descriptionStyles.scss";

const titles = {
  MANAGER: "Chủ trọ",
  REP_TENANT: "Khách thuê",
  TENANT: "Khách thuê",
};

const UserDes = ({ user }) => {
  const items = [
    {
      key: "1",
      label: "Họ tên",
      children: user?.fullName || "Chưa có thông tin",
    },
    {
      key: "2",
      label: "Số CMND",
      children: user?.personalIdNumber || "Chưa có thông tin",
    },
    {
      key: "3",
      label: "Số điện thoại",
      children: user?.phoneNumber || "Chưa có thông tin",
    },
    {
      key: "4",
      label: "Email",
      children: user?.email || "Chưa có thông tin",
    },
  ];

  return (
    <Descriptions
      className="customDescription"
      title={titles[user.role]}
      column={2}
      items={items}
    />
  );
};

export default UserDes;
