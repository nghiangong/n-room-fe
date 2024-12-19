import { Descriptions } from "antd";
import { formatCurrency } from "../../utils";

const RElecWaterCalc = ({ house }) => {
  console.log(house.elecCostByPeopleCount);
  const items = [];
  if (house?.havingElecIndex) {
    items.push({
      key: "1",
      label: "Chi phí điện",
      children: `${formatCurrency(house?.elecPricePerUnit)} / 1 số`,
    });
  } else {
    items.push({
      key: "1",
      label: "Chi phí điện",
      children: (
        <>
          {house?.elecCostByPeopleCount?.map((cost, index) => (
            <>
              {`phòng ${index + 1} người: ${
                cost !== null ? formatCurrency(cost) : "N/A"
              }`}
              <br />
            </>
          ))}
        </>
      ),
    });
  }
  if (house?.havingWaterIndex) {
    items.push({
      key: "2",
      label: "Chi phí nước",
      children: `${formatCurrency(house?.waterPricePerUnit)} / 1 số`,
    });
  } else {
    items.push({
      key: "2",
      label: "Chi phí nước",
      children: `${formatCurrency(house?.waterChargePerPerson)} / 1 người`,
    });
  }
  return <Descriptions column={1} items={items} />;
};
export default RElecWaterCalc;
