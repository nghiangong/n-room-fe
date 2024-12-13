import axios from "axios";

export const provinceListApi = async () => {
  try {
    const response = await axios.get(`http://localhost:8081/provinces`);
    return response.data.result;
  } catch (error) {
    console.error("Error fetching provinces data:", error);
  }
};

export const districtListApi = async (province) => {
  try {
    const response = await axios.get(
      `http://localhost:8081/districts?province=${province}`
    );
    return response.data.result;
  } catch (error) {
    console.error("Error fetching districts data:", error);
  }
};

export const wardListApi = async (district) => {
  try {
    const response = await axios.get(
      `http://localhost:8081/wards?district=${district}`
    );
    return response.data.result;
  } catch (error) {
    console.error("Error fetching wards data:", error);
  }
};
