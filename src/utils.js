import dayjs from "dayjs";

export const decodeToken = (token) =>
  JSON.parse(decodeURIComponent(escape(atob(token.split(".")[1]))));

export const formatCurrency = (value) =>
  value
    ? value.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
    : "";

export const get = (items, keys) => {
  const keySet = new Set(keys);
  return items.filter((item) => keySet.has(item.key));
};

export const formatDate = (date) => {
  if (date) date = date.format("YYYY-MM-DD");
};
