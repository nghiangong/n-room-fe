export const houseStatus = {
  ACTIVE: { color: "green", name: "Hoạt động" },
  INACTIVE: { color: "default", name: "Dừng hoạt động" },
};
export const roomStatus = {
  AVAILABLE: { color: "blue", name: "Trống" },
  OCCUPIED: { color: "green", name: "Đang thuê" },
  INACTIVE: { color: "gray", name: "Ngưng hoạt động" },
  SOON_AVAILABLE: { color: "purple", name: "Sắp trống" },
};
export const contractStatus = {
  ACTIVE: { color: "green", name: "Đang hiệu lực" },
  SOON_INACTIVE: { color: "green", name: "Sắp hết hạn" },
  PENDING_CHECKOUT: { color: "orange", name: "Đợi trả phòng" },
  PENDING_PAYMENT: { color: "red", name: "Đợi thanh toán" },
  INACTIVE: { color: "default", name: "Hết hiệu lực" },
};
export const invoiceStatus = {
  PROCESSING: { color: "orange", name: "Đang thanh toán" },
  PAID: { color: "green", name: "Đã thanh toán" },
  UNPAID: { color: "red", name: "Chưa thanh toán" },
  CANCELLED: { color: "gray", name: "Đã hủy" },
};
export const tenantRole = {
  REP_TENANT: { color: "green", name: "Người đại diện" },
  TENANT: { color: "blue", name: "Khách thuê" },
};
export const costUnits = {
  PER_ROOM: { name: "1 phòng / tháng" },
  PER_PERSON: { name: "1 người / tháng" },
  PER_BICYCLE: { name: "1 xe đạp / tháng" },
  PER_MOTORBIKE: { name: "1 xe máy / tháng" },
};
