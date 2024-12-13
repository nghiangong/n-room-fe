export const houseStatus = {
  ACTIVE: { color: "green", name: "Hoạt động" },
  INACTIVE: { color: "default", name: "Dừng hoạt động" },
};
export const roomStatus = {
  AVAILABLE: { color: "blue", name: "Trống" },
  OCCUPIED: { color: "green", name: "Đang thuê" },
  INACTIVE: { color: "gray", name: "Ngưng phục vụ" },
  SOON_AVAILABLE: { color: "purple", name: "Sắp trống" },
};
export const contractStatus = {
  ACTIVE: { color: "green", name: "Đang hiệu lực" },
  PENDING_SUSPENSION: { color: "yellow", name: "Sắp kết thúc" },
  INACTIVE: { color: "default", name: "Hết hiệu lực" },
};
export const invoiceStatus = {
  PROCESSING: { color: "blue", name: "Đang thanh toán" },
  PAID: { color: "green", name: "Đã thanh toán" },
  UNPAID: { color: "red", name: "Chưa thanh toán" },
  CANCELLED: { color: "gray", name: "Đã hủy" },
};
