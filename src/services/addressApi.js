import axios from "axios";

const baseURL = "http://localhost:8080/address";
export const provinceListApi = async () => {
  try {
    const response = await axios.get(`${baseURL}/provinces`);
    return response.data.result;
  } catch (error) {
    console.error("Error fetching provinces data:", error);
  }
};

export const districtListApi = async (province) => {
  try {
    const response = await axios.get(
      `${baseURL}/districts?province=${province}`
    );
    return response.data.result;
  } catch (error) {
    console.error("Error fetching districts data:", error);
  }
};

export const wardListApi = async (district) => {
  try {
    const response = await axios.get(`${baseURL}/wards?district=${district}`);
    return response.data.result;
  } catch (error) {
    console.error("Error fetching wards data:", error);
  }
};
