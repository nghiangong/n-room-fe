import React from "react";
import { Table, Card } from "antd";
import { costUnits } from "../../statuses";
import { formatCurrency } from "../../utils";

const ROtherFees = ({ otherFees }) => {
  return (
    <Card title="Dịch vụ" size="small">
      <Table
        rowKey="key"
        columns={[
          {
            title: "Tên dịch vụ",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Giá (VND)",
            dataIndex: "price",
            key: "price",
            align: "right",
            render: (price) => formatCurrency(price),
          },

          {
            title: "Đơn vị",
            dataIndex: "unit",
            key: "unit",
            render: (unit) => costUnits[unit].name,
          },
        ]}
        dataSource={otherFees}
        pagination={false}
        size="small"
        bordered
      />
    </Card>
  );
};

export default ROtherFees;
