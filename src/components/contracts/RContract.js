import React, { useEffect, useState } from "react";
import { Card, Descriptions, message } from "antd";
import dayjs from "dayjs";
import TenantDes from "../users/UserDes";
import { ContractTag } from "../../tags";

const RContract = ({ contractDetail, style }) => {
  let items = [
    {
      key: "id",
      label: "Mã hợp đồng",
      children: <span>{contractDetail?.id}</span>,
    },
    {},

    {
      key: "1",
      label: "Tòa nhà",
      children: <span>{contractDetail?.house?.name}</span>,
    },
    {
      key: "2",
      label: "Phòng",
      children: <span>{contractDetail?.room?.name}</span>,
    },
    {
      key: "3",
      label: "Ngày bắt đầu",
      children: (
        <span>
          {contractDetail?.startDate
            ? dayjs(contractDetail.startDate).format("DD/MM/YYYY")
            : "-"}
        </span>
      ),
    },
    {
      key: "4",
      label: "Ngày kết thúc",
      children: (
        <span>
          {contractDetail?.endDate
            ? dayjs(contractDetail.endDate).format("DD/MM/YYYY")
            : "-"}
        </span>
      ),
    },
    {
      key: "5",
      label: "Giá thuê",
      children: (
        <span>{contractDetail?.rentPrice?.toLocaleString("vi-VN")}</span>
      ),
    },
    {
      key: "6",
      label: "Tiền cọc",
      children: <span>{contractDetail?.deposit?.toLocaleString("vi-VN")}</span>,
    },
    {
      key: "7",
      label: "Số người ở",
      children: <span>{contractDetail?.numberOfPeople}</span>,
    },
    {},
    {
      key: "8",
      label: "Số xe đạp",
      children: <span>{contractDetail?.numberOfBicycle}</span>,
    },
    {
      key: "9",
      label: "Số xe máy",
      children: <span>{contractDetail?.numberOfMotorbike}</span>,
    },
    {
      key: "startElecNumber",
      label: "Số điện đầu",
      children: contractDetail?.startElecNumber,
    },
    {
      key: "startWaterNumber",
      label: "Số nước đầu",
      children: contractDetail?.startWaterNumber,
    },
    {
      key: "endElecNumber",
      label: "Số điện cuối",
      children: contractDetail?.endElecNumber,
    },
    {
      key: "endWaterNumber",
      label: "Số nước cuối",
      children: contractDetail?.endWaterNumber,
    },
    {
      key: "12",
      label: "Trạng thái",
      children: <ContractTag status={contractDetail?.status} />,
    },
  ];

  useEffect(() => {}, []);

  return (
    <Card title="Chi tiết hợp đồng" style={{ width: "700px", ...style }}>
      <Descriptions items={items} column={2} />
      {contractDetail?.repTenant && (
        <div style={{ marginTop: 10 }}>
          <TenantDes user={contractDetail?.repTenant} />
        </div>
      )}
    </Card>
  );
};

export default RContract;
