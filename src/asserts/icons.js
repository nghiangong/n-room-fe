import React from "react";
import { ReactComponent as DoorSVG } from "./door-closed.svg";
import { ReactComponent as InvoiceSVG } from "./budget-alt.svg";
import { ReactComponent as ContractSVG } from "./file-signature.svg";
import { ReactComponent as ServiceSVG } from "./sack-dollar.svg";
import { ReactComponent as ElectricitySVG } from "./bolt.svg";
import { ReactComponent as WaterSVG } from "./raindrops.svg";
import { ReactComponent as UsersSVG } from "./users.svg";

export const RoomIcon = (props) => {
  return (
    <DoorSVG {...props} style={{ width: "16px", height: "16px" }} /> // Kích thước có thể điều chỉnh
  );
};

export const InvoiceIcon = (props) => {
  return (
    <InvoiceSVG {...props} style={{ width: "16px", height: "16px" }} /> // Kích thước có thể điều chỉnh
  );
};

export const ContractIcon = (props) => {
  return (
    <ContractSVG {...props} style={{ width: "16px", height: "16px" }} /> // Kích thước có thể điều chỉnh
  );
};

export const ServiceIcon = (props) => {
  return (
    <ServiceSVG {...props} style={{ width: "16px", height: "16px" }} /> // Kích thước có thể điều chỉnh
  );
};

export const ElecIcon = (props) => {
  return (
    <ElectricitySVG {...props} style={{ width: "16px", height: "16px" }} /> // Kích thước có thể điều chỉnh
  );
};

export const WaterIcon = (props) => {
  return (
    <WaterSVG {...props} style={{ width: "16px", height: "16px" }} /> // Kích thước có thể điều chỉnh
  );
};

export const UsersIcon = (props) => {
  return (
    <UsersSVG {...props} style={{ width: "16px", height: "16px" }} /> // Kích thước có thể điều chỉnh
  );
};
