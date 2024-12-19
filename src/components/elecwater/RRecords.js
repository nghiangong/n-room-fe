import React from "react";
import { Table, Card } from "antd";

const titles = {
  ELEC: "Số điện",
  WATER: "Số nước",
};

const RRecords = ({ records, mode }) => {
  return (
    <Card title={titles[mode]} size="small">
      <Table
        rowKey="key"
        columns={[
          {
            title: "Tháng",
            dataIndex: "date",
            key: "date",
            render: (date) => {
              const month = new Date(date).toLocaleString("vi-VN", {
                month: "long",
                // year: "numeric",
              });
              return month;
            },
          },
          {
            title: "Chỉ số",
            dataIndex: "value",
            key: "value",
            align: "right",
          },
        ]}
        dataSource={records}
        pagination={false}
        size="small"
        bordered
      />
    </Card>
  );
};

export default RRecords;
