import React from "react";
import { Tag } from "antd";

import {
  contractStatus,
  houseStatus,
  invoiceStatus,
  paymentStatus,
  roomStatus,
  tenantRole,
} from "./statuses";

export const HouseTag = ({ status, count }) => {
  const tagInfo = houseStatus[status] || { color: "default", name: status };
  return (
    <Tag color={tagInfo.color}>
      {count ? `${tagInfo.name}: ${count}` : tagInfo.name}
    </Tag>
  );
};

export const RoomTag = ({ status, count }) => {
  const tagInfo = roomStatus[status] || { color: "default", name: status };
  return (
    <Tag color={tagInfo.color}>
      {count ? `${tagInfo.name}: ${count}` : tagInfo.name}
    </Tag>
  );
};

export const ContractTag = ({ status }) => {
  const tagInfo = contractStatus[status] || { color: "default", name: status };
  return <Tag color={tagInfo.color}>{tagInfo.name}</Tag>;
};

export const InvoiceTag = ({ status }) => {
  const tagInfo = invoiceStatus[status] || { color: "default", name: status };
  return <Tag color={tagInfo.color}>{tagInfo.name}</Tag>;
};

export const PaymentTag = ({ status }) => {
  const tagInfo = paymentStatus[status] || { color: "default", name: status };
  return <Tag color={tagInfo.color}>{tagInfo.name}</Tag>;
};

export const TenantTag = ({ status }) => {
  const tagInfo = tenantRole[status] || { color: "default", name: status };
  return <Tag color={tagInfo.color}>{tagInfo.name}</Tag>;
};
