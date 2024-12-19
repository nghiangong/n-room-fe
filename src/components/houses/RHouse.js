import { Card, Descriptions } from "antd";
import { HouseTag } from "../../tags";
import ROtherFees from "../otherFee/ROtherFees";
import RElecWaterCalc from "./RElecWaterCalc";

const getAddress = (house) => {
  if (!house) return "Không có thông tin";
  const { address, ward, district, province } = house;
  return `${address || ""}, ${ward || ""}, ${district || ""}, ${
    province || ""
  }`;
};
const RHouse = ({ houseDetail }) => {
  return (
    <Card title="Thông tin tòa nhà" style={{ width: "700px", marginTop: 16 }}>
      <div
        style={{ maxHeight: "70vh", overflowY: "scroll", overflowX: "hidden" }}
      >
        <Descriptions
          column={1}
          items={[
            {
              key: "1",
              label: "Tòa nhà",
              children: houseDetail?.name || "Không có thông tin",
            },
            {
              key: "3",
              label: "Địa chỉ",
              children: getAddress(houseDetail),
            },
            {
              key: "3",
              label: "Trạng thái",
              children: <HouseTag status={houseDetail?.status} />,
            },
          ]}
        />
        <div style={{ marginTop: 16 }}>
          <RElecWaterCalc house={houseDetail} />
        </div>
        <div style={{ marginTop: 16 }}>
          <ROtherFees otherFees={houseDetail?.otherFees} />
        </div>
      </div>
    </Card>
  );
};

export default RHouse;
