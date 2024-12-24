export const houseStatus = {
  ACTIVE: { color: "green", name: "Hoạt động" },
  INACTIVE: { color: "default", name: "Dừng hoạt động" },
};
export const roomStatus = {
  AVAILABLE: { color: "blue", name: "Trống" },
  OCCUPIED: { color: "green", name: "Đang thuê" },
  INACTIVE: { color: "default", name: "Ngưng hoạt động" },
  SOON_AVAILABLE: { color: "lime", name: "Sắp trống" },
};
export const contractStatus = {
  ACTIVE: { color: "green", name: "Đang hiệu lực" },
  SOON_EXPIRED: { color: "lime", name: "Sắp hết hạn" },
  PENDING_CHECKOUT_OR_INVOICE: {
    color: "orange",
    name: "Đợi trả phòng",
  },
  EXPIRED: { color: "default", name: "Hết hiệu lực" },
};
export const invoiceStatus = {
  PROCESSING: { color: "orange", name: "Đang thanh toán" },
  PAID: { color: "green", name: "Đã thanh toán" },
  UNPAID: { color: "red", name: "Chưa thanh toán" },
  CANCELLED: { color: "default", name: "Đã hủy" },
};

export const paymentStatus = {
  PAID: { color: "green", name: "Đã thanh toán" },
  UNPAID: { color: "red", name: "Chưa thanh toán" },
};

export const tenantRole = {
  REP_TENANT: { color: "green", name: "Người đại diện" },
  TENANT: { color: "lime", name: "Khách thuê" },
};
export const costUnits = {
  PER_ROOM: { name: "1 phòng / tháng" },
  PER_PERSON: { name: "1 người / tháng" },
  PER_BICYCLE: { name: "1 xe đạp / tháng" },
  PER_MOTORBIKE: { name: "1 xe máy / tháng" },
};
