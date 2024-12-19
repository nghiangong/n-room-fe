import { Card, Descriptions, message, Table, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { InvoiceTag } from "../../tags";
import TenantDes from "../users/UserDes";
import apiClient from "../../services/apiClient";

const formatCurrency = (value) =>
  value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const { Text } = Typography;

const RInvoice = ({ invoiceDetail }) => {
  const columns = [
    {
      title: "Tên dịch vụ",
      dataIndex: "name",
      key: "name",
      render: (value, record) => (
        <>
          <div>{value}</div>
          <Text type="secondary">{`(${record.note})`}</Text>
        </>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "unitPrice",
      key: "unitPrice",
      align: "right",
      render: (value) => formatCurrency(value),
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      key: "unit",
      align: "right",
    },
    {
      title: "Thành tiền",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      render: (value) => formatCurrency(value),
    },
  ];
  const items = [
    {
      label: "Số",
      span: 1,
      children: invoiceDetail.id,
    },
    {
      label: "Ngày tạo",
      span: 2,
      children: invoiceDetail.createDate,
    },
    {
      label: "Phòng",
      span: 1,
      children: invoiceDetail.room.name,
    },
    {
      label: "Toà nhà",
      span: 3,
      children: invoiceDetail.house.name,
    },
    {
      label: "Địa chỉ",
      children: `${invoiceDetail.house.address}, ${invoiceDetail.house.ward}, ${invoiceDetail.house.district}, ${invoiceDetail.house.province}`,
      span: 4,
    },

    {
      label: "Tính từ ngày",
      children: invoiceDetail.startDate,
    },
    {
      label: "đến ngày",
      span: 2,
      children: invoiceDetail.endDate,
    },
    {
      label: "Trạng thái ",
      span: 4,
      children: <InvoiceTag status={invoiceDetail.status} />,
    },
  ];

  useEffect(() => {}, []);

  return (
    <Card title="Chi tiết hóa đơn" style={{ width: "700px" }}>
      <div
        style={{ maxHeight: "70vh", overflowY: "scroll", overflowX: "hidden" }}
      >
        <Descriptions
          title={invoiceDetail.name}
          items={items}
          column={3}
          style={{ marginBottom: "20px" }}
        ></Descriptions>
        <TenantDes user={invoiceDetail?.repTenant} />

        <Table
          style={{ marginTop: "10px" }}
          columns={columns}
          dataSource={invoiceDetail.invoiceItems}
          bordered
          rowKey={(record) => record.id}
          pagination={false}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell align="right" colSpan={3}>
                <Text strong type="danger">
                  Tổng thành tiền
                </Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell align="right" style={{ fontWeight: "bold" }}>
                <Text strong>{formatCurrency(invoiceDetail.amount)}</Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </div>
    </Card>
  );
};

export default RInvoice;
