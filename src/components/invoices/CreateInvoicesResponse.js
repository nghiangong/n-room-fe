import { Card, Table } from "antd";
import dayjs from "dayjs";

const getMessageStyle = (status) => {
  switch (status) {
    case "WARN":
      return { color: "orange" };
    case "SUCCESS":
      return { color: "green" };
    case "ERROR":
      return { color: "red" };
    default:
      return {};
  }
};

const CreateInvoicesResponse = ({ response }) => {
  const columns = [
    {
      dataIndex: "roomName",
      key: "roomName",
      minWidth: 100,
      render: (roomName) => `Phòng ${roomName}`,
    },
    {
      dataIndex: "message",
      key: "message",
      render: (message, record) => (
        <span style={getMessageStyle(record.status)}>{message}</span>
      ),
    },
  ];
  return (
    <>
      <Card
        title="Trạng thái tạo hóa đơn"
        className="customCard"
        style={{ maxHeight: "70vh", width: 500 }}
      >
        <div
          style={{ maxHeight: "70vh", overflowY: "auto", overflowX: "hidden" }}
        >
          <p style={{ margin: 0 }}>{`Tòa nhà: ${response.houseName}`}</p>
          <p>{`Tháng: ${dayjs(response.month).format("MM/YYYY")}`}</p>
          <Table
            className="customTable"
            columns={columns}
            dataSource={response.statuses}
            bordered
            showHeader={false}
            size="small"
            tableLayout="auto"
            pagination={false}
            scroll={{ y: true }}
            rowKey={(record) => record.roomId}
          />
        </div>
      </Card>
    </>
  );
};
export default CreateInvoicesResponse;
